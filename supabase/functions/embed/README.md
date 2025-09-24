# how to run locally

`supabase functions serve --no-verify-jwt --env-file .env.local`

# required secrets

- `select vault.create_secret('<project-url>', 'project_url');`
- `select vault.create_secret('ey...IU', 'service_role_key');`
- GEMINI_API_KEY
