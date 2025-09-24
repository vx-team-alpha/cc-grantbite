import { z } from "zod"
import { m } from "../paraglide/messages"

// --------- Change Name Form ---------
export const ChangeNameFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: m.first_min_length_msg() })
    .max(50, { message: m.first_max_length_msg() }),
  lastName: z
    .string()
    .min(2, { message: m.last_min_length_msg() })
    .max(50, { message: m.last_max_length_msg() }),
})

export type ChangeNameSchemaType = typeof ChangeNameFormSchema

// --------- Change Email Form ---------
export const ChangeEmailSchema = z.object({
  email: z
    .string()
    .email({ message: m.email_valid_msg() })
    .max(50, { message: m.email_max_length_msg() }),

  password: z
    .string()
    .min(8, { message: m.password_length_msg() })
    .regex(/[a-z]/, { message: m.password_lowercase_msg() })
    .regex(/[A-Z]/, { message: m.password_uppercase_msg() })
    .regex(/\d/, { message: m.password_number_msg() }),
})

export type ChangeEmailSchemaType = typeof ChangeEmailSchema

// --------- Change Password Form ---------
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, { message: m.password_length_msg() }),

    newPassword: z
      .string()
      .min(8, { message: m.password_length_msg() })
      .regex(/[a-z]/, { message: m.password_lowercase_msg() })
      .regex(/[A-Z]/, { message: m.password_uppercase_msg() })
      .regex(/\d/, { message: m.password_number_msg() }),

    confirmPassword: z
      .string()
      .min(8, { message: m.password_length_msg() })
      .regex(/[a-z]/, { message: m.password_lowercase_msg() })
      .regex(/[A-Z]/, { message: m.password_uppercase_msg() })
      .regex(/\d/, { message: m.password_number_msg() }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: m.passwords_do_not_match_msg(),
  })

export type ChangePasswordSchemaType = typeof ChangePasswordSchema

// --------- Delete Account Form ---------
export const DeleteAccountSchema = z.object({
  email: z
    .string()
    .email({ message: m.email_valid_msg() })
    .max(50, { message: m.email_max_length_msg() }),
  password: z
    .string()
    .min(8, { message: m.password_length_msg() })
    .regex(/[a-z]/, { message: m.password_lowercase_msg() })
    .regex(/[A-Z]/, { message: m.password_uppercase_msg() })
    .regex(/\d/, { message: m.password_number_msg() }),
  reason: z.string(),
})

export type DeleteAccountSchemaType = typeof DeleteAccountSchema

// --------- Change Company Details ---------
export const ChangeCompanyDetails = z.object({
  name: z
    .string()
    .min(2, { message: m.company_min_length_msg() })
    .max(50, { message: m.company_max_length_msg() }),
  registrationNo: z.string().min(1, { message: m.registration_required_msg() }),
  type: z
    .string()
    .min(2, { message: m.company_min_length_msg() })
    .max(50, { message: m.company_max_length_msg() }),
})

export type ChangeCompanyDetailsType = typeof ChangeCompanyDetails

// --------- Change Company Address ---------
export const ChangeCompanyAddress = z.object({
  street: z
    .string()
    .min(2, { message: m.street_min_length_msg() })
    .max(100, { message: m.street_max_length_msg() }),
  country: z
    .string()
    .min(2, { message: m.country_min_length_msg() })
    .max(50, { message: m.country_max_length_msg() }),
  zipcode: z
    .string()
    .min(5, { message: m.zipcode_min_length_msg() })
    .max(10, { message: m.zipcode_max_length_msg() }),
  city: z
    .string()
    .min(3, { message: m.city_min_length_msg() })
    .max(50, { message: m.city_max_length_msg() }),
})

export type ChangeCompanyAddressType = typeof ChangeCompanyAddress

// --------- Change Company Details Employee ---------
export const ChangeCompanyDetailsEmp = z.object({
  foundedYear: z.string().length(4, { message: m.founded_year_length_msg() }),

  numberEmployee: z
    .preprocess(
      (val) => {
        if (Array.isArray(val)) {
          return val.map((v) => (typeof v === "string" ? Number(v) : v))
        }
        return val
      },
      z
        .array(z.number())
        .length(2, { message: m.number_range_msg() })
        .refine(([min, max]) => min <= max, {
          message: m.minimum_maximum_msg(),
        }),
    )
    .default([10, 10]),
  revenueLastYear: z.string().max(10, { message: m.revenue_max_length_msg() }),
})

export type ChangeCompanyDetailsEmpType = typeof ChangeCompanyDetailsEmp

// --------- Create Notification ---------
export const CreateNotification = z.object({
  id: z.string().optional(),
  projectName: z.string().min(2, { message: m.project_name_min_length_msg() }),

  industry: z.array(z.string()).min(1, { message: m.select_industry_msg() }),

  projectType: z.string().nonempty({ message: m.choose_project_type_msg() }),

  startDate: z.string().nonempty({ message: m.start_date_required_msg() }),

  endDate: z.string().nonempty({ message: m.end_date_required_msg() }),

  projectStage: z.array(z.string()).min(1, { message: m.select_stage_msg() }),
  description: z.string(),

  projectBudget: z
    .preprocess(
      (val) => {
        if (Array.isArray(val)) {
          return val.map((v) => (typeof v === "string" ? Number(v) : v))
        }
        return val
      },
      z
        .array(z.number())
        .length(2, { message: m.number_range_msg() })
        .refine(([min, max]) => min <= max, {
          message: m.minimum_maximum_msg(),
        }),
    )
    .default([50000, 250000])
    .refine(([min, max]) => min <= max, {
      message: m.minimum_budget_msg(),
    }),

  fundingPurpose: z
    .array(z.string())
    .min(1, { message: m.select_funding_purpose_msg() }),
})

export type CreateNotificationType = z.infer<typeof CreateNotification>

// --------- Request Consultation Form ---------
export const ReqConsultForm = z.object({
  program: z.string().nonempty({ message: m.funding_program_required_msg() }),
  name: z.string().nonempty({ message: m.name_required_msg() }),
  email: z.string().email({ message: m.email_valid_msg() }),
  program_id: z.string().optional(),
  message: z.string(),
})

export type ReqConsultFormType = typeof ReqConsultForm

// --------- Sign In Form ---------
export const SignInForm = z.object({
  email: z.string().email({ message: m.email_validation_msg() }),
  password: z.string().min(8, { message: m.password_length_msg() }),
})

export type SignInFormType = typeof SignInForm

// --------- Sign Up Form ---------
export const SignUpForm = z.object({
  email: z.string().email({ message: m.email_validation_msg() }),

  firstName: z
    .string()
    .min(2, { message: m.name_validation_msg() })
    .max(50, { message: m.name_max_length_msg() }),

  lastName: z
    .string()
    .min(2, { message: m.last_validation_msg() })
    .max(50, { message: m.last_max_length_msg() }),

  password: z
    .string()
    .min(8, { message: m.password_length_msg() })
    .regex(/[a-z]/, { message: m.password_lowercase_msg() })
    .regex(/[A-Z]/, { message: m.password_uppercase_msg() })
    .regex(/\d/, { message: m.password_number_msg() }),
})

export type SignUpFormType = typeof SignUpForm

// --------- Forgot Password Form ---------
export const ForgotPassword = z.object({
  email: z.string().email({ message: m.email_valid_msg() }),
})

export type ForgotPasswordType = typeof ForgotPassword

// --------- NewsLetter Form ---------
export const NewsLetterForm = z
  .object({
    email: z
      .string()
      .email({ message: m.email_valid_msg() })
      .nonempty({ message: m.email_required_msg() }),
    sub_newsletter: z.boolean(),
    funding_guide: z.boolean(),
  })
  .refine((data) => data.sub_newsletter || data.funding_guide, {
    message: m.checkbox_validation_msg(),
    path: ["sub_newsletter"],
  })

export type NewsLetterFormType = typeof NewsLetterForm
