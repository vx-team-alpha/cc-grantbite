alter table "public"."funding_main" add column "contact" json not null default '{}'::json;

