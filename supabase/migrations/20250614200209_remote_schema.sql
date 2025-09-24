CREATE INDEX funding_main_featured_priority_idx ON public.funding_main USING btree (featured_priority);

CREATE INDEX funding_translations_language_permalink_idx ON public.funding_translations USING btree (language, permalink);


