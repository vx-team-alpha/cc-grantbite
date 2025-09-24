create table "public"."funding_main" (
    "id" uuid not null,
    "src_url" text not null,
    "updated_at" timestamp with time zone not null default now(),
    "success" boolean not null,
    "featured_priority" integer not null default 0,
    "overview_financial_instrument" text not null,
    "overview_award_channel" text not null,
    "provider_program_level" text not null,
    "program_status" text not null,
    "overview_eligible_applicants_short" text[] not null,
    "overview_eligible_sectors_short" text[] not null,
    "overview_target_stages_short" text[] not null,
    "overview_countries" text[] not null,
    "overview_single_consortium" text not null,
    "overview_company_size" text[] not null
);


alter table "public"."funding_main" enable row level security;

create table "public"."funding_translations" (
    "id" uuid not null,
    "language" text not null,
    "updated_at" timestamp with time zone not null default now(),
    "success" boolean not null,
    "title" text not null,
    "permalink" text not null,
    "introduction_short" text not null,
    "md_content" text not null,
    "overview_maximum_funding_amount" text not null,
    "overview_deadline" text not null,
    "overview_open_until" text not null,
    "overview_region" text not null,
    "overview_beneficiary" text not null,
    "overview_eligible_applicants_long" text not null,
    "overview_eligible_sectors_long" text not null,
    "overview_allocated_budget" text not null,
    "overview_program_title_without_acronym" text not null,
    "provider_funding_body" text not null,
    "provider_managed_by" text not null,
    "provider_additional_partners" text not null,
    "seo_keywords" text[] not null,
    "seo_title" text not null,
    "seo_meta_description" text not null,
    "overview_program_acronym_id" text not null
);


alter table "public"."funding_translations" enable row level security;

alter table "public"."foerderdatenbank_daten" alter column "uid" set not null;

CREATE UNIQUE INDEX funding_main_pkey ON public.funding_main USING btree (id);

CREATE UNIQUE INDEX funding_translations_permalink_key ON public.funding_translations USING btree (permalink);

CREATE UNIQUE INDEX funding_translations_pkey ON public.funding_translations USING btree (id, language);

alter table "public"."funding_main" add constraint "funding_main_pkey" PRIMARY KEY using index "funding_main_pkey";

alter table "public"."funding_translations" add constraint "funding_translations_pkey" PRIMARY KEY using index "funding_translations_pkey";

alter table "public"."funding_translations" add constraint "funding_translations_id_fkey" FOREIGN KEY (id) REFERENCES funding_main(id) not valid;

alter table "public"."funding_translations" validate constraint "funding_translations_id_fkey";

alter table "public"."funding_translations" add constraint "funding_translations_language_check" CHECK ((language = ANY (ARRAY['en'::text, 'de'::text]))) not valid;

alter table "public"."funding_translations" validate constraint "funding_translations_language_check";

alter table "public"."funding_translations" add constraint "funding_translations_permalink_key" UNIQUE using index "funding_translations_permalink_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.stop_change_on_permalink()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- always reset the permalink to the value already stored
  NEW.permalink := OLD.permalink;
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."funding_main" to "anon";

grant insert on table "public"."funding_main" to "anon";

grant references on table "public"."funding_main" to "anon";

grant select on table "public"."funding_main" to "anon";

grant trigger on table "public"."funding_main" to "anon";

grant truncate on table "public"."funding_main" to "anon";

grant update on table "public"."funding_main" to "anon";

grant delete on table "public"."funding_main" to "authenticated";

grant insert on table "public"."funding_main" to "authenticated";

grant references on table "public"."funding_main" to "authenticated";

grant select on table "public"."funding_main" to "authenticated";

grant trigger on table "public"."funding_main" to "authenticated";

grant truncate on table "public"."funding_main" to "authenticated";

grant update on table "public"."funding_main" to "authenticated";

grant delete on table "public"."funding_main" to "service_role";

grant insert on table "public"."funding_main" to "service_role";

grant references on table "public"."funding_main" to "service_role";

grant select on table "public"."funding_main" to "service_role";

grant trigger on table "public"."funding_main" to "service_role";

grant truncate on table "public"."funding_main" to "service_role";

grant update on table "public"."funding_main" to "service_role";

grant delete on table "public"."funding_translations" to "anon";

grant insert on table "public"."funding_translations" to "anon";

grant references on table "public"."funding_translations" to "anon";

grant select on table "public"."funding_translations" to "anon";

grant trigger on table "public"."funding_translations" to "anon";

grant truncate on table "public"."funding_translations" to "anon";

grant update on table "public"."funding_translations" to "anon";

grant delete on table "public"."funding_translations" to "authenticated";

grant insert on table "public"."funding_translations" to "authenticated";

grant references on table "public"."funding_translations" to "authenticated";

grant select on table "public"."funding_translations" to "authenticated";

grant trigger on table "public"."funding_translations" to "authenticated";

grant truncate on table "public"."funding_translations" to "authenticated";

grant update on table "public"."funding_translations" to "authenticated";

grant delete on table "public"."funding_translations" to "service_role";

grant insert on table "public"."funding_translations" to "service_role";

grant references on table "public"."funding_translations" to "service_role";

grant select on table "public"."funding_translations" to "service_role";

grant trigger on table "public"."funding_translations" to "service_role";

grant truncate on table "public"."funding_translations" to "service_role";

grant update on table "public"."funding_translations" to "service_role";

CREATE TRIGGER avoid_permalink_changes BEFORE UPDATE ON public.funding_translations FOR EACH ROW EXECUTE FUNCTION stop_change_on_permalink();


