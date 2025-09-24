import { fundingPurpose, stages } from "$lib/components/constants.js"
import type { Database } from "$src/DatabaseDefinitions"

type SupabaseNotification =
  Database["public"]["Tables"]["notifications"]["Row"][]

export const formatNotification = (data: SupabaseNotification) => {
  return data.map((item) => {
    const projectStage = stages
      .filter((stage) =>
        Array.isArray(item.project_stage)
          ? item.project_stage.includes(stage.value)
          : stage.value === item.project_stage,
      )
      .map((stage) => stage.label)

    const funds = Array.isArray(item.funding_purpose)
      ? fundingPurpose
          .filter((purpose) => item.funding_purpose.includes(purpose.value))
          .map((purpose) => purpose.label)
      : []

    const startDate = item.start_date
      ? new Date(item.start_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A"
    const endDate = item.end_date
      ? new Date(item.end_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A"
    return {
      id: item.id,
      name: item.project_name,
      stage: projectStage,
      useOfFunds: funds,
      term: `${startDate} - ${endDate}`,
      budget: `${item.budget_min} - ${item.budget_max}`,
      fundingProgramsFound: 0,
    }
  })
}
