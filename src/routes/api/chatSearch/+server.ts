import type { RequestHandler } from "./$types"
import { GEMINI_API_KEY } from "$env/static/private"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { createToolCallingAgent } from "langchain/agents"
import { AgentExecutor } from "langchain/agents"

import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { createLangChainAgentStreamHandler } from "$src/lib/ai-related/langchain-utils"
import { chatIdGenerator } from "$src/lib/ai-related/chat"
import { SupabaseChatMessageHistory } from "$src/lib/ai-related/supabase-langchain"
import { type Database } from "$src/DatabaseDefinitions"
import { RunnableWithToolHistory } from "$src/lib/ai-related/runnable-tool-history"
import {
  ActiveFiltersZodSchema,
  fetchFundingPrograms,
  type SafeActiveFilters,
} from "$src/lib/search/find_programs"
import { pickSearchResultItem } from "$src/lib/db_translation_helper"
import { funding_search_prompt } from "$src/lib/ai-related/prompts"

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0,
  apiKey: GEMINI_API_KEY,
})

// const memory = new ChatMessageHistory()
// const memoryMap = new Map<string, ChatMessageHistory>()

// function getMemory(key: string): ChatMessageHistory {
//   if (!memoryMap.has(key)) {
//     memoryMap.set(key, new ChatMessageHistory())
//   }
//   return memoryMap.get(key)!
// }

export const POST: RequestHandler = async ({ request, locals }) => {
  const { session, user } = await locals.safeGetSession()
  if (!session) {
    // console.log("no session...")
  }

  const { messages, id } = await request.json()
  const locale = request.headers.get("use-locale") || "en"

  let additional_context = undefined
  if (messages.length > 0 && messages[0].role === "system") {
    additional_context = messages[0].content
  }
  const userMessage = messages[messages.length - 1]
  console.log(id)
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", funding_search_prompt],
    ["placeholder", "{additional_context}"],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ])

  const request_info_about_permalink = tool(
    async ({ permalink }: { permalink: string }) => {
      const { data, error } = await locals.supabaseServiceRole
        .from("funding_translations")
        .select(`*, funding_main!inner(*)`, { count: "exact" })
        .eq("permalink", permalink)
        .single()
      if (data && !error) {
        const {
          id,
          fts,
          embedding,
          funding_main,
          ...relevant_columns_translation
        } = data
        const {
          featured_priority,
          contact,
          src_url,
          ...relevant_columns_main
        } = funding_main
        const result = {
          ...relevant_columns_translation,
          ...relevant_columns_main,
        }
        return {
          data: result,
          error: null,
        }
      }
      return { data: null, error }
    },
    {
      name: "request_info_about_permalink",
      description:
        "Returns the informations about a funding program given the permalink",
      schema: z.object({
        permalink: z
          .string()
          .describe("The permalink about which the information is requested"),
      }),
    },
  )
  const search_for_programs = tool(
    async ({
      searchQuery,
      activeFilters,
    }: {
      searchQuery: string
      activeFilters: SafeActiveFilters
    }) => {
      // console.log(`search: ${searchQuery}: ${JSON.stringify(activeFilters)}`)
      const { items: safeItems, totalItems } = await fetchFundingPrograms(
        locals.supabaseServiceRole,
        locale,
        { searchQuery, activeFilters, page: 1, itemsPerPage: 10 },
      )

      const searchResults = safeItems.map(pickSearchResultItem)
      // console.log(`search results: ${JSON.stringify(searchResults)}`)
      return { data: searchResults }
    },
    {
      name: "search_for_programs",
      description:
        "Searches for all programs matching the filters and its description",
      schema: z.object({
        searchQuery: z
          .string()
          .describe(
            "Search terms, describe here the program that you want to find",
          ),
        activeFilters: ActiveFiltersZodSchema.describe(
          "Filters by which to filter the query",
        ),
      }),
    },
  )

  const display_programs_to_user = tool(
    async ({ permalinks }: { permalinks: string[] }) => {
      return `Tool call for display_programs_to_user with permalinks: ${JSON.stringify(
        permalinks,
      )}`
    },
    {
      name: "display_programs_to_user",
      description: "Displays the selected programs to the user",
      schema: z.object({
        permalinks: z
          .array(z.string().describe("The permalink to be displayed"))
          .describe("Array of permalinks to be displayed to the user"),
      }),
    },
  )

  const tools = [
    request_info_about_permalink,
    search_for_programs,
    display_programs_to_user,
  ]
  const agent = createToolCallingAgent({
    llm,
    tools,
    prompt,
  })
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    returnIntermediateSteps: true,
  })
  const agentExecutorWithMemory = new RunnableWithToolHistory({
    runnable: agentExecutor,
    // getMessageHistory: (sessionId) => getMemory(sessionId),
    getMessageHistory: (sessionId: string) =>
      new SupabaseChatMessageHistory<Database>({
        sessionId,
        supabase: locals.supabaseServiceRole,
      }),

    inputMessagesKey: "input",
    historyMessagesKey: "chat_history",
  })

  const config = { configurable: { sessionId: id }, version: "v2" }

  const stream = await agentExecutorWithMemory.streamEvents(
    {
      input: userMessage.content,
      additional_context: additional_context,
    },
    // @ts-expect-error weird typing
    config,
  )

  const transformStream = createLangChainAgentStreamHandler(
    stream,
    chatIdGenerator(),
    { whitelistToolCalls: ["display_programs_to_user"] },
  )

  return new Response(transformStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "x-vercel-ai-data-stream": "v1",
    },
  })
}
