import { AIMessage, HumanMessage, ToolMessage } from "@langchain/core/messages"
import { type Run } from "@langchain/core/tracers/base"
import {
  RunnableWithMessageHistory,
  type RunnableConfig,
} from "@langchain/core/runnables"

/**
 * Extended version of RunnableWithMessageHistory that also persists
 * intermediate tool calls and responses to the message history.
 *
 * This captures the full reasoning trace of agent executions, including:
 * - Tool calls made by the agent
 * - Tool responses/observations
 * - The final agent response
 */
export class RunnableWithToolHistory<
  RunInput,
  RunOutput,
> extends RunnableWithMessageHistory<RunInput, RunOutput> {
  async _exitHistory(run: Run, config: RunnableConfig): Promise<void> {
    const history = config.configurable?.messageHistory

    // Get input messages (same as parent class)
    let inputs
    if (Array.isArray(run.inputs) && Array.isArray(run.inputs[0])) {
      inputs = run.inputs[0]
    } else {
      inputs = run.inputs
    }

    let inputMessages = this._getInputMessages(inputs)

    // Remove duplicate historic messages if they were prepended
    if (this.historyMessagesKey === undefined) {
      const existingMessages = await history.getMessages()
      inputMessages = inputMessages.slice(existingMessages.length)
    }

    // Get output value
    const outputValue = run.outputs
    if (!outputValue) {
      throw new Error(
        `Output values from 'Run' undefined. Run: ${JSON.stringify(run, null, 2)}`,
      )
    }

    // Extract intermediate steps (tool calls) if they exist
    const intermediateSteps = outputValue.intermediateSteps
    const toolMessages: (AIMessage | ToolMessage)[] = []

    if (intermediateSteps && Array.isArray(intermediateSteps)) {
      for (const step of intermediateSteps) {
        // Each step should have { action, observation }
        if (step.action && step.observation !== undefined) {
          // Create an AI message for the tool call
          const toolCallMessage = new AIMessage({
            content: "", // Tool calls don't need text content
            tool_calls: [
              {
                id: this._generateToolCallId(),
                name: step.action.tool,
                args:
                  typeof step.action.toolInput === "string"
                    ? { input: step.action.toolInput }
                    : step.action.toolInput || {},
              },
            ],
          })

          // Create a tool message for the response
          const toolResponseMessage = new ToolMessage({
            content: String(JSON.stringify(step.observation)),
            tool_call_id: toolCallMessage.tool_calls![0].id!,
          })

          toolMessages.push(toolCallMessage, toolResponseMessage)
        }
      }
    }

    // Get final output messages (same as parent class)
    const outputMessages = this._getOutputMessages(outputValue)

    // Add all messages to history: input -> tool calls -> tool responses -> final output
    const allMessages = [...inputMessages, ...toolMessages, ...outputMessages]

    await history.addMessages(allMessages)
  }

  /**
   * Generate a unique ID for tool calls.
   * In a real implementation, you might want a more sophisticated ID generation.
   */
  private _generateToolCallId(): string {
    return `tool_call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Usage example:
/*
const chainWithToolHistory = new RunnableWithToolHistory({
  runnable: agentExecutor, // Your AgentExecutor instance
  getMessageHistory: (sessionId) => new YourChatMessageHistory({ sessionId }),
  inputMessagesKey: "input",
  historyMessagesKey: "chat_history",
});

// Now tool calls will be persisted in the message history
const result = await chainWithToolHistory.invoke(
  { input: "What's the weather in Paris?" },
  { configurable: { sessionId: "user123" } }
);
*/
