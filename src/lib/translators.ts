// import { m } from "$lib/paraglide/messages.js"
import * as m from "$lib/paraglide/messages.js"
import { enums } from "$lib/data_values/enums"

// =================================================================
// 1. THE COMPILE-TIME CHECK (Works for this structure too!)
// =================================================================
// This type generates the expected message keys based on the *keys* of the enums.
// e.g., "enum_programStatus_planned" | "enum_programStatus_open" | ...
// type ExpectedEnumMessageKeys = {
//   [EnumName in keyof typeof enums]: `enum_${EnumName}_${keyof (typeof enums)[EnumName] & string}`
// }[keyof typeof enums]

// // This check remains the same. It validates that all required message keys exist in `m`.
// type AllEnumMessagesExist = ExpectedEnumMessageKeys extends keyof typeof m
//   ? true
//   : false

// const compilerCheck: AllEnumMessagesExist = true

// =================================================================
// 2. THE RUNTIME IMPLEMENTATION (With Reverse Lookup)
// =================================================================

// Define the structure of our generated translators object for perfect type inference.
type EnumTranslators = {
  [K in keyof typeof enums as `translate${K & string}`]: (
    value: (typeof enums)[K][keyof (typeof enums)[K]],
  ) => string
}

/**
 * Creates a map of translator functions for all enums, using a reverse-lookup strategy.
 * The generated functions accept an enum *value* and return its translation.
 */
function createAllEnumTranslators(
  enumContainer: typeof enums,
): EnumTranslators {
  const translators = {} as EnumTranslators

  // For each enum (e.g., 'ProgramStatus', 'UserRole')...
  for (const enumName in enumContainer) {
    if (Object.prototype.hasOwnProperty.call(enumContainer, enumName)) {
      const enumObject = enumContainer[enumName as keyof typeof enums]

      // Create a reverse map for efficient lookup: Map<Value, Key>
      // e.g., Map { "Planned" => "planned", "Open for Registration" => "open" }
      const reverseMap = new Map<string, string>()
      for (const key in enumObject) {
        const value = enumObject[key as keyof typeof enumObject]
        reverseMap.set(value, key)
      }

      // The translator function for this specific enum.
      // It takes a value like "Planned".
      const translator = (valueToTranslate: string): string => {
        try {
          // 1. Find the enum key (e.g., "planned") using the reverse map.
          const enumKey = reverseMap.get(valueToTranslate)
          if (!enumKey) {
            console.warn(
              `Could not find enum key for value "${valueToTranslate}" in enum ${enumName}.`,
            )
            return valueToTranslate // Fallback to the original value
          }

          // 2. Construct the message key (e.g., "enum_programStatus_planned").
          const messageKey = `enum_${enumName}_${enumKey}` as keyof typeof m

          // 3. Get the translation function from Paraglide's `m` object.
          // Check if the message exists and is a function
          const translationFunction = m[messageKey]

          if (typeof translationFunction !== "function") {
            console.warn(
              `Translation function not found for key "${messageKey}". Available keys:`,
              Object.keys(m).filter((key) =>
                key.startsWith(`enum_${enumName}`),
              ),
            )
            return valueToTranslate // Fallback to the original value
          }

          // Call the translation function
          try {
            return (translationFunction as () => string)()
          } catch (error) {
            // If it fails due to missing parameters, it's probably not a simple enum translation
            console.warn(
              `Translation function "${messageKey}" requires parameters, skipping translation`,
            )
            return valueToTranslate
          }
        } catch (error) {
          console.error(
            `Error translating value "${valueToTranslate}" for enum ${enumName}:`,
            error,
          )
          return valueToTranslate // Fallback to the original value
        }
      }

      const translatorKey = `translate${enumName}` as keyof EnumTranslators
      translators[translatorKey] = translator
    }
  }

  return translators
}

// Debug function to help identify available message keys
export function debugEnumMessages() {
  const enumKeys = Object.keys(m).filter((key) => key.startsWith("enum_"))
  console.log("Available enum message keys:", enumKeys)
  return enumKeys
}

export const translators = createAllEnumTranslators(enums)
