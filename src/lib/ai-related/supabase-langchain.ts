import { BaseListChatMessageHistory } from "@langchain/core/chat_history"
import {
  mapChatMessagesToStoredMessages,
  mapStoredMessagesToChatMessages,
  type BaseMessage,
} from "@langchain/core/messages"
import type { SupabaseClient } from "@supabase/supabase-js"

interface SupabaseChatMessageHistoryInput<T> {
  sessionId: string
  supabase: SupabaseClient<T>
  tableName?: string
}

// expecting the table tableName to exist and be of shape:
// CREATE TABLE IF NOT EXISTS ${this.tableName} (
//     id SERIAL PRIMARY KEY,
//     session_id VARCHAR(255) NOT NULL,
//     message JSONB NOT NULL
// );

export class SupabaseChatMessageHistory<T> extends BaseListChatMessageHistory {
  constructor(fields: SupabaseChatMessageHistoryInput<T>) {
    const { supabase, sessionId, tableName = "chat_history_messages" } = fields
    super(fields)
    this.lc_namespace = ["ff", "lib", "ai-related", "supabase-langchain"]
    this.supabase = supabase
    this.sessionId = sessionId
    this.tableName = tableName
  }
  async getMessages(): Promise<BaseMessage[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("message")
      // @ts-expect-error session_id is a string
      .eq("session_id", this.sessionId)
      .order("id", { ascending: true })

    if (!data || error) {
      console.log("could not get messages: ", error)
      return []
    }
    const storedMessages = data.map((row) => {
      // @ts-expect-error we did not really define the table types
      const { type, ...data } = row.message
      return { type, data }
    })
    return mapStoredMessagesToChatMessages(storedMessages)
  }
  async addMessage(message: BaseMessage): Promise<void> {
    const { data, type } = mapChatMessagesToStoredMessages([message])[0]
    const { error } = await this.supabase
      .from(this.tableName)
      // @ts-expect-error we did not really define the table types
      .insert({ session_id: this.sessionId, message: { ...data, type } })
    if (error) {
      console.log("error inserting message into supabase", error)
    }
  }
  lc_namespace: string[]
  supabase: SupabaseClient<T>
  sessionId: string
  tableName: string
}
