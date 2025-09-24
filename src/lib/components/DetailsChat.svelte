<script lang="ts">
  import { Chat, type Message } from "@ai-sdk/svelte"
  import { chatIdGenerator } from "../ai-related/chat"

  // Props
  interface DetailsChatProps {
    initialMessages?: Message[]
    logo?: string
    name?: string
    primaryColor?: string
  }
  let {
    initialMessages,
    logo = "",
    name = "Chat",
    primaryColor = "#854fff",
  }: DetailsChatProps = $props()

  // State
  let isOpen = $state(false)
  let messagesContainer: HTMLElement | null = $state(null)
  // let sessionId = $state("")

  const chat = new Chat({
    //id, // use the provided chat ID
    initialMessages, // initial messages if provided
    sendExtraMessageFields: true, // send id and createdAt for each message
    api: "/api/chat", // SvelteKit API route
    // Custom ID format for client-side messages:
    generateId: chatIdGenerator,
    onToolCall: ({ toolCall }) => {
      // You can trigger UI effects here, e.g. show a toast or a modal
      // Since tools are executed on the server, you don't need to return anything here.
      // If you wanted to execute tools on the client, you would return the result.
    },

    maxSteps: 10,
    //streamProtocol: 'text'
  })

  const messages = $derived(
    chat.messages.filter((msg) => msg.role !== "system"),
  )
  // autoscroll
  $effect(() => {
    if (messagesContainer && chat.messages.length > 0) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  })

  function toggleChat() {
    isOpen = !isOpen
  }

  function closeChat() {
    isOpen = false
  }
</script>

<!-- Toggle Button -->
<button
  class="toggleButton"
  onclick={toggleChat}
  style="--primary: {primaryColor}"
>
  💬
</button>

<!-- Chat Window -->
{#if isOpen}
  <div class="chat-window" style="--primary: {primaryColor}">
    <!-- Header -->
    <div class="header">
      {#if logo}
        <img src={logo} alt={name} class="logo" />
      {/if}
      <span class="name">{name}</span>
      <button class="close" onclick={closeChat}>×</button>
    </div>

    <!-- Chat Interface -->
    <div class="messages" bind:this={messagesContainer}>
      {#each messages as message (message.id)}
        <div class="message message-{message.role}">
          <!-- <strong>{message.role}:</strong> -->
          {message.content}
        </div>
      {/each}
    </div>

    <form onsubmit={chat.handleSubmit} class="input-form">
      <div class="input-area">
        <input
          bind:value={chat.input}
          placeholder="Type your message..."
          class="message-input"
        />
        <button type="submit">Send</button>
      </div>
    </form>
  </div>
{/if}

<style>
  .toggleButton {
    position: fixed;
    bottom: 65px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
  }

  .chat-window {
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 550px;
    height: 700px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    z-index: 1000;
    overflow: hidden;
  }

  .header {
    padding: 16px;
    background: var(--primary);
    color: white;
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
  }

  .logo {
    width: 24px;
    height: 24px;
    border-radius: 4px;
  }

  .name {
    font-weight: 500;
    flex: 1;
  }

  .close {
    background: none;
    border: none;
    color: white;
    font-size: 40px;
    cursor: pointer;
    padding: 2px;
  }

  .start-btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
  }

  .messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .message {
    padding: 8px 12px;
    border-radius: 8px;
    max-width: 80%;
    word-wrap: break-word;
  }

  .message-user {
    background: var(--primary);
    color: white;
    align-self: flex-end;
  }

  .message-assistant {
    background: #f5f5f5;
    color: #333;
    align-self: flex-start;
  }

  .input-area {
    padding: 16px;
    border-top: 1px solid #eee;
    display: flex;
    gap: 8px;
  }

  .input-area input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: none;
    font-family: inherit;
  }

  .input-area button {
    background: var(--primary);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
