import fs from "fs/promises"
import path from "path"

const CONFIG = {
  enumsFilePath: "src/lib/utils/enums.ts",
  messagesDirPath: "messages",
  sourceLanguage: "en",
}

// function toCamelCase(str) {
//   return str.charAt(0).toLowerCase() + str.slice(1)
// }

async function main() {
  console.log("🔄 Starting enum translation sync...")

  const enumsModulePath = path.resolve(process.cwd(), CONFIG.enumsFilePath)
  const { enums } = await import(`${enumsModulePath}?v=${Date.now()}`)

  if (!enums) {
    console.error(
      `❌ Error: Could not find the 'enums' export in ${CONFIG.enumsFilePath}`,
    )
    return
  }
  console.log(`🔍 Found ${Object.keys(enums).length} enum containers.`)

  const requiredMessages = new Map()
  for (const enumName in enums) {
    const enumObject = enums[enumName]
    const prefix = enumName // toCamelCase(enumName)
    for (const key in enumObject) {
      const value = enumObject[key]
      const messageKey = `enum_${prefix}_${key}`
      requiredMessages.set(messageKey, value)
    }
  }
  console.log(
    `✅ Generated a master list of ${requiredMessages.size} required enum messages.`,
  )

  const messageFiles = (await fs.readdir(CONFIG.messagesDirPath)).filter((f) =>
    f.endsWith(".json"),
  )

  for (const fileName of messageFiles) {
    const lang = path.basename(fileName, ".json")
    const filePath = path.join(CONFIG.messagesDirPath, fileName)

    let messages
    try {
      const fileContent = await fs.readFile(filePath, "utf-8")
      messages = JSON.parse(fileContent)
    } catch (error) {
      console.error(`❌ Error reading or parsing ${fileName}. Skipping.`)
      continue
    }

    let modified = false // Use a more descriptive variable name
    for (const [key, defaultValue] of requiredMessages.entries()) {
      if (lang === CONFIG.sourceLanguage) {
        // For the source language, only add if missing.
        if (!(key in messages)) {
          messages[key] = defaultValue
          modified = true
        }
      } else {
        // For other languages, add if missing OR if the value is an empty string.
        // --- THIS IS THE KEY CHANGE ---
        if (!(key in messages) || messages[key] === "") {
          messages[key] = `[TRANSLATE] ${defaultValue}`
          modified = true
        }
      }
    }

    if (modified) {
      const sortedMessages = Object.fromEntries(Object.entries(messages).sort())
      await fs.writeFile(
        filePath,
        JSON.stringify(sortedMessages, null, 2) + "\n",
      )
      console.log(`🔧 Synced and updated messages in ${fileName}.`)
    } else {
      console.log(`👍 ${fileName} is already up to date.`)
    }
  }

  console.log("✨ Sync complete!")
}

main().catch((error) => {
  console.error("An unexpected error occurred:", error)
  process.exit(1)
})
