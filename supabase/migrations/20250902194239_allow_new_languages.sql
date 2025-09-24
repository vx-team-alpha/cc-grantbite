ALTER TABLE "public"."funding_translations" DROP CONSTRAINT "funding_translations_language_check";

alter table "public"."funding_translations" add constraint "funding_translations_language_check" 
CHECK ((language = ANY (ARRAY['en'::text, 'de'::text, 'es'::text, 'fr'::text, 'pt'::text]))) not valid;
