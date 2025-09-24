

alter table "public"."foerderdatenbank_daten" add column "uid" uuid;

alter table "public"."foerderdatenbank_processed" add column "overview_allocated_budget" text not null;

alter table "public"."foerderdatenbank_processed" add column "overview_countries" text[] not null;

alter table "public"."foerderdatenbank_processed" add column "overview_eligible_applicants_long" text not null;

alter table "public"."foerderdatenbank_processed" add column "overview_eligible_sectors_long" text not null;

alter table "public"."foerderdatenbank_processed" add column "overview_program_acronym_id" text not null;

alter table "public"."foerderdatenbank_processed" add column "overview_program_title_without_acronym" text not null;

alter table "public"."foerderdatenbank_processed" add column "overview_single_consortium" text not null;

alter table "public"."foerderdatenbank_processed" alter column "overview_company_size" set data type text[] using "overview_company_size"::text[];



