-- -- For vector operations
-- create extension if not exists vector
-- with
--   schema extensions;

-- -- For queueing and processing jobs
-- -- (pgmq will create its own schema)
-- create extension if not exists pgmq;

-- -- For async HTTP requests
-- create extension if not exists pg_net
-- with
--   schema extensions;

-- -- For scheduled processing and retries
-- -- (pg_cron will create its own schema)
-- create extension if not exists pg_cron;

-- -- For clearing embeddings during updates
-- create extension if not exists hstore
-- with
--   schema extensions;

select pgmq.create('embedding_jobs');

alter table "public"."funding_translations" add column "embedding" halfvec(3072);

CREATE INDEX funding_translations_embedding_idx ON public.funding_translations USING hnsw (embedding halfvec_cosine_ops);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.embedding_input(doc funding_translations)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
begin
  return '# ' || doc.title || E'\n\n' || doc.introduction_short || E'\n\n' || doc.md_content;
end;
$function$
;



create schema if not exists "util";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION util.clear_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
    clear_column text := TG_ARGV[0];
begin
    NEW := NEW #= hstore(clear_column, NULL);
    return NEW;
end;
$function$
;

CREATE OR REPLACE FUNCTION util.invoke_edge_function(name text, body jsonb, timeout_milliseconds integer DEFAULT ((5 * 60) * 1000))
 RETURNS void
 LANGUAGE plpgsql
AS $function$declare
  headers_raw text;
  auth_header text;
begin
  -- If we're in a PostgREST session, reuse the request headers for authorization
  headers_raw := current_setting('request.headers', true);

  -- Only try to parse if headers are present
  auth_header := case
    when headers_raw is not null then
      (headers_raw::json->>'authorization')
    else
      null
  end;

  -- Perform async HTTP request to the edge function
  perform net.http_post(
    url => util.project_url() || '/functions/v1/' || name,
    headers => jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', auth_header
    ),
    body => body,
    timeout_milliseconds => timeout_milliseconds
  );
end;$function$
;

CREATE OR REPLACE FUNCTION util.process_embeddings(batch_size integer DEFAULT 10, max_requests integer DEFAULT 5, timeout_milliseconds integer DEFAULT ((5 * 60) * 1000))
 RETURNS void
 LANGUAGE plpgsql
AS $function$declare
  job_batches jsonb[];
  batch jsonb;
begin
  with
    -- First get jobs and assign batch numbers
    numbered_jobs as (
      select
        message || jsonb_build_object('jobId', msg_id) as job_info,
        (row_number() over (order by 1) - 1) / batch_size as batch_num
      from pgmq.read(
        queue_name => 'embedding_jobs',
        vt => timeout_milliseconds / 1000,
        qty => max_requests * batch_size
      )
    ),
    -- Then group jobs into batches
    batched_jobs as (
      select
        jsonb_agg(job_info) as batch_array,
        batch_num
      from numbered_jobs
      group by batch_num
    )
  -- Finally aggregate all batches into array
  select array_agg(batch_array)
  from batched_jobs
  into job_batches;

  -- Invoke the embed edge function for each batch
  if job_batches is not null then
    foreach batch in array job_batches loop
      perform util.invoke_edge_function(
        name => 'embed',
        body => batch,
        timeout_milliseconds => timeout_milliseconds
      );
    end loop;
  end if;
end;$function$
;

CREATE OR REPLACE FUNCTION util.project_url()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  secret_value text;
begin
  -- Retrieve the project URL from Vault
  select decrypted_secret into secret_value from vault.decrypted_secrets where name = 'project_url';
  return secret_value;
end;
$function$
;

CREATE OR REPLACE FUNCTION util.queue_embeddings()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$declare
  content_function text = TG_ARGV[0];
  embedding_column text = TG_ARGV[1];
  id_column text = COALESCE(TG_ARGV[2], 'id'); 
  id_value text;
begin
  -- Extract the ID value dynamically
  id_value := (to_jsonb(NEW) ->> id_column);
  
  perform pgmq.send(
    queue_name => 'embedding_jobs',
    msg => jsonb_build_object(
      'id', id_value,
      'schema', TG_TABLE_SCHEMA,
      'table', TG_TABLE_NAME,
      'contentFunction', content_function,
      'embeddingColumn', embedding_column,
      'idColumn', id_column 
    )
  );
  return NEW;
end;$function$
;

-- Schedule the embedding processing
select
  cron.schedule(
    'process-embeddings',
    '30 seconds',
    $$
    select util.process_embeddings();
    $$
  );
  
SELECT  cron.schedule('delete-job-run-details', '0 12 * * *', $$DELETE FROM cron.job_run_details WHERE end_time < now() - interval '7 days'$$);

CREATE TRIGGER embed_documents_on_insert AFTER INSERT ON public.funding_translations FOR EACH ROW EXECUTE FUNCTION util.queue_embeddings('embedding_input', 'embedding', 'permalink');

CREATE TRIGGER embed_documents_on_update AFTER UPDATE OF title, introduction_short, md_content ON public.funding_translations FOR EACH ROW EXECUTE FUNCTION util.queue_embeddings('embedding_input', 'embedding', 'permalink');

-- match
-- Match documents using negative inner product (<#>)
create or replace function match_documents (
  query_embedding halfvec(3072),
  match_threshold float,
  match_count int,
  target_language text default null
)
returns setof funding_translations
language sql
as $$
  select *
  from funding_translations
  where funding_translations.embedding <#> query_embedding < -match_threshold
    and (target_language is null or funding_translations.language = target_language)
  order by funding_translations.embedding <#> query_embedding asc
  limit match_count;
$$;


-- fts:
CREATE OR REPLACE FUNCTION toregconfig(lang text) RETURNS regconfig AS $$
  SELECT CASE lang
    WHEN 'en' THEN 'english'::regconfig
    WHEN 'de' THEN 'german'::regconfig
    WHEN 'fr' THEN 'french'::regconfig
    WHEN 'es' THEN 'spanish'::regconfig
    WHEN 'pt' THEN 'portuguese'::regconfig
    WHEN 'it' THEN 'italian'::regconfig
    WHEN 'ru' THEN 'russian'::regconfig
    ELSE 'english'::regconfig
  END;
$$ LANGUAGE SQL IMMUTABLE RETURNS NULL ON NULL INPUT;

alter table
  funding_translations
add column
  fts tsvector generated always as (to_tsvector(toregconfig(language), title || ' ' || introduction_short)) stored;

create index funding_translations_fts on funding_translations using gin (fts); -- generate the index


create or replace function search_fts_funding (
  query text,
  target_language text default null
)
returns setof funding_translations
language sql
as $$
  select *
  from funding_translations
  where fts @@ websearch_to_tsquery(toregconfig(target_language), query)
    and (target_language is null or funding_translations.language = target_language)
  order by ts_rank(fts, websearch_to_tsquery(toregconfig(target_language), query), 1) desc
$$;


-- cache for embeddings:
CREATE TABLE embeddings_cache (
    id bigserial PRIMARY KEY,
    key text UNIQUE NOT NULL,
    "created_date" timestamp with time zone not null default now(),
    embedding halfvec(3072) not null
    );

CREATE INDEX idx_cache_key ON embeddings_cache (key);
alter table embeddings_cache enable row level security;

