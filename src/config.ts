import * as rawEnv from "$env/static/public"
import { z } from "zod"

const EnvSchema = z.object({
  PUBLIC_DEPLOYMENT_ENV: z
    .enum(["production", "staging", "dev"])
    .default("dev"),
  PUBLIC_SHOW_SOURCE_URL: z.boolean().default(false),
  PUBLIC_WEBSITE_BASE_URL: z
    .string()
    .min(5)
    .default("https://www.grantzilla.org"),
  PUBLIC_NAVBAR_HIDE_MORE_ITEMS: z.boolean().default(false),
  PUBLIC_NAVBAR_HIDE_LOGIN: z.boolean().default(false),
})
const parsedEnv = EnvSchema.parse(rawEnv)
// console.log(parsedEnv)

// TODO!
export const WebsiteName: string = "Grantzilla"
export const WebsiteBaseUrl: string = parsedEnv.PUBLIC_WEBSITE_BASE_URL
// export const WebsiteDescription: string = "Grantzilla"
export const CreateProfileStep: boolean = false
export const ShowSourceUrl: boolean = parsedEnv.PUBLIC_SHOW_SOURCE_URL

const isProduction = parsedEnv.PUBLIC_DEPLOYMENT_ENV === "production"
export const NavBarHideMoreItems: boolean =
  parsedEnv.PUBLIC_NAVBAR_HIDE_MORE_ITEMS
export const NavBarHideLogin: boolean = parsedEnv.PUBLIC_NAVBAR_HIDE_LOGIN

export const max_number_similar_programs = 5
