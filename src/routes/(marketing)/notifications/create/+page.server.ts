import {
  CreateNotification,
  type CreateNotificationType,
} from "$lib/schemas/index.js"
import { fail } from "@sveltejs/kit"
import type { Actions } from "./$types.js"
import type { PageServerLoad } from "./$types.js"
import { superValidate } from "sveltekit-superforms/server"

import { zod } from "sveltekit-superforms/adapters"

export const load: PageServerLoad = async ({
  url,
  locals: { supabase, session },
}) => {
  const notificationId = url.searchParams.get("id")
  if (!session || !notificationId) {
    return {
      session: null,
      form: await superValidate(zod(CreateNotification)),
    }
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", session?.user.id)
    .eq("id", notificationId)
    .order("created_at", { ascending: false })
    .single()

  if (error) {
    return {
      session: null,
      form: await superValidate(zod(CreateNotification)),
    }
  }
  const initialData: CreateNotificationType = {
    projectName: data.project_name,
    industry: data.industry,
    projectType: data.project_type,
    startDate: data.start_date,
    endDate: data.end_date,
    projectStage: data.project_stage,
    description: data.description,
    projectBudget: [Number(data.budget_min), Number(data.budget_max)],
    fundingPurpose: data.funding_purpose,
  }
  return {
    notificationId: notificationId,
    session: session,
    form: await superValidate(initialData, zod(CreateNotification)),
  }
}
