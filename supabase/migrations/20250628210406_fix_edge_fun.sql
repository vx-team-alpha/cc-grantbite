-- make an access for it
create or replace function util.service_role_key()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  secret_value text;
begin
  -- Retrieve the service role key from the vault
  select decrypted_secret into secret_value from vault.decrypted_secrets where name = 'service_role_key';
  return secret_value;
end;
$$;

-- use the accessor
create or replace function util.invoke_edge_function(
  name text,
  body jsonb,
  timeout_milliseconds int = 5 * 60 * 1000  -- default 5 minute timeout
)
returns void
language plpgsql
set search_path = ''
as $$
declare
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
      'Bearer ' || util.service_role_key()
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
end;
$$;
