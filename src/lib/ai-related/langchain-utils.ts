export function createLangChainAgentStreamHandler(
  stream: AsyncIterable<any>,
  messageId: string,
  options?: { whitelistToolCalls?: string[] },
) {
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      const toolCallMap = new Map<
        string,
        { name: string; args: any; runId: string; isWhitelisted: boolean }
      >()
      let step = 0

      for await (const event of stream) {
        switch (event.event) {
          case "on_tool_start": {
            // Capture tool arguments from tool start event
            const runId = event.run_id
            const toolName = event.name

            // Check if tool is whitelisted (if whitelist is provided)
            const isWhitelisted =
              !options?.whitelistToolCalls ||
              options?.whitelistToolCalls.includes(toolName)

            let args: any = {}

            // Parse the input - LangChain provides it as { input: '{"city":"Munich"}' }
            if (event.data?.input?.input) {
              try {
                args = JSON.parse(event.data.input.input)
              } catch (e) {
                console.warn(
                  "Failed to parse tool input:",
                  event.data.input.input,
                )
                args = event.data.input
              }
            }

            // Generate a tool call ID (since LangChain uses run_id internally)
            const toolCallId = `tool_${runId}`

            // Always store the tool call info for matching with tool_end
            toolCallMap.set(toolCallId, {
              name: toolName,
              args: args,
              runId: runId,
              isWhitelisted: isWhitelisted,
            })

            // Only emit tool call info if whitelisted
            if (isWhitelisted) {
              // Start the first step if it hasn't been started
              if (step === 0) {
                controller.enqueue(
                  encoder.encode(`f:${JSON.stringify({ messageId })}\n`),
                )
                step = 1
              }

              // Emit the 9: chunk with the full tool call info
              controller.enqueue(
                encoder.encode(
                  `9:${JSON.stringify({
                    toolCallId: toolCallId,
                    toolName: toolName,
                    args: args,
                  })}\n`,
                ),
              )
            }
            break
          }

          case "on_chat_model_stream": {
            const chunk = event.data.chunk

            // This is a chunk of the final text response step.
            const textContent = Array.isArray(chunk.content)
              ? chunk.content.find((c: { type: string }) => c.type === "text")
                  ?.text || ""
              : typeof chunk.content === "string"
                ? chunk.content
                : ""

            if (textContent) {
              // If this is the first text chunk, it means we're in the second step.
              if (step === 1) {
                // Start the second step for the final answer
                controller.enqueue(
                  encoder.encode(`f:${JSON.stringify({ messageId })}\n`),
                )
                step = 2
              }
              controller.enqueue(
                encoder.encode(`0:${JSON.stringify(textContent)}\n`),
              )
            }
            break
          }

          case "on_tool_end": {
            const runId = event.run_id
            const toolCallId = `tool_${runId}`

            // Find the matching tool call
            const toolCall = toolCallMap.get(toolCallId)
            if (toolCall && toolCall.isWhitelisted) {
              // Only emit tool result if it was whitelisted
              controller.enqueue(
                encoder.encode(
                  `a:${JSON.stringify({
                    toolCallId: toolCallId,
                    result: event.data.output,
                  })}\n`,
                ),
              )
              // Finish the tool-calling step
              controller.enqueue(
                encoder.encode(
                  `e:${JSON.stringify({ finishReason: "tool-calls", usage: {}, isContinued: true })}\n`,
                ),
              )
            }

            // Always clean up the tool call from the map
            if (toolCall) {
              toolCallMap.delete(toolCallId)
            }
            break
          }
        }
      }

      // Finish the final text-generation step and the whole message
      controller.enqueue(
        encoder.encode(
          `e:${JSON.stringify({ finishReason: "stop", usage: {}, isContinued: false })}\n`,
        ),
      )
      controller.enqueue(
        encoder.encode(
          `d:${JSON.stringify({ finishReason: "stop", usage: {} })}\n`,
        ),
      )
      controller.close()
    },
  })
}
