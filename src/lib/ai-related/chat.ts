import { createIdGenerator } from "ai"

export const chatIdGenerator = createIdGenerator({
  prefix: "msgc",
  size: 16,
})

export const searchChatIdGenerator = createIdGenerator({
  prefix: "srch",
  size: 16,
})
