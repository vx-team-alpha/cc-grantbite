// Filter options for the funding search page
import { m } from "$lib/paraglide/messages.js"
import {
  CompanySize,
  Country,
  EligibleApplicantsShort,
  EligibleSectorsShort,
  FinancialInstrumentType,
  ProgramStatus,
  TargetStageShort,
} from "./enums"
import { translators } from "$lib/translators"

// Region options
export const countriesOptions = Object.entries(Country).map(
  ([label, value]) => ({
    value,
    label: translators.translateCountry(value),
  }),
)

export const targetStageOptions = Object.entries(TargetStageShort).map(
  ([label, value]) => ({
    value,
    label: translators.translateTargetStageShort(value),
  }),
)

export const eligibleSectorsOptions = Object.entries(EligibleSectorsShort).map(
  ([label, value]) => ({
    value,
    label: translators.translateEligibleSectorsShort(value),
  }),
)

export const programStatusOptions = Object.values(ProgramStatus).map(
  (value) => ({
    value,
    label: translators.translateProgramStatus(value),
  }),
)

export const companySizeOptions = Object.values(CompanySize).map((value) => ({
  value,
  label: translators.translateCompanySize(value),
}))

export const eligibleApplicantsOptions = Object.values(
  EligibleApplicantsShort,
).map((value) => ({
  value,
  label: translators.translateEligibleApplicantsShort(value),
}))

export const financialInstrumentOptions = Object.values(
  FinancialInstrumentType,
).map((value) => ({
  value,
  label: translators.translateFinancialInstrumentType(value),
}))

// All filters configuration
export const filters = [
  {
    id: "program_status",
    label: m.filters_program_status(),
    options: programStatusOptions,
    type: "multi", // multi selection filter
  },
  {
    id: "countries",
    label: m.filters_country(),
    options: countriesOptions,
    type: "multi", // single selection filter
  },
  {
    id: "eligible_applicants",
    label: m.filters_eligible_applicants(),
    options: eligibleApplicantsOptions,
    type: "multi", // multi selection filter
  },
  {
    id: "company_size",
    label: m.filters_company_size(),
    options: companySizeOptions,
    type: "multi",
  },
  {
    id: "eligible_sectors",
    label: m.filters_eligible_sectors(),
    options: eligibleSectorsOptions,
    type: "multi",
  },
  {
    id: "financial_instrument",
    label: m.filters_financial_instrument(),
    options: financialInstrumentOptions,
    type: "single",
  },
  // {
  //   id: "target_stages",
  //   label: "Funding Stages",
  //   options: targetStageOptions,
  //   type: "multi",
  // },
]
