create table public.deleted_users (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  email text null,
  full_name text null,
  deletion_reason text null,
  deleted_at timestamp with time zone not null default now(),
  constraint deleted_users_pkey primary key (id)
);


alter table "public"."bookmarks" enable row level security;
alter table "public"."notifications" enable row level security;
alter table "public"."newsletter" enable row level security;

create policy "bookmarks are viewable by self." on "public"."bookmarks"
  for select using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks." on "public"."bookmarks"
  for insert with check (auth.uid() = user_id);

create policy "Users can update own bookmarks." on "public"."bookmarks"
  for update using (auth.uid() = user_id);

create policy "Users can delete own bookmarks." on "public"."bookmarks"
  for delete using (auth.uid() = user_id);




create policy "notifications are viewable by self." on "public"."notifications"
  for select using (auth.uid() = user_id);

create policy "Users can insert their own notifications." on "public"."notifications"
  for insert with check (auth.uid() = user_id);

create policy "Users can update own notifications." on "public"."notifications"
  for update using (auth.uid() = user_id);

create policy "Users can delete own notifications." on "public"."notifications"
  for delete using (auth.uid() = user_id);

 

create policy "newsletter are viewable by admin sdk only" on "public"."newsletter"
  for all to public using (false);



-- create or replace function handle_new_user()
-- returns trigger
-- language plpgsql
-- as $$
-- declare
--   full_name text;
--   first_name text;
--   last_name text;
-- begin
--   full_name := new.raw_user_meta_data->>'full_name';
  
--   if new.raw_user_meta_data->>'first_name' is not null and new.raw_user_meta_data->>'last_name' is not null then
--     first_name := new.raw_user_meta_data->>'first_name';
--     last_name := new.raw_user_meta_data->>'last_name';
--   else
--     -- Split full_name into first_name and last_name
--     if full_name is not null then
--       if position(' ' in full_name) > 0 then
--         first_name := split_part(full_name, ' ', 1);
--         last_name := split_part(full_name, ' ', 2);
--       else
--         first_name := full_name;  -- Assign full_name to first_name
--         last_name := '';          -- Set last_name to an empty string
--       end if;
--     end if;
--   end if;

--   insert into public.profiles (id, first_name, last_name, avatar_url)
--   values (new.id, first_name, last_name, new.raw_user_meta_data->>'avatar_url');
  
--   return new;
-- end;
-- $$;


create table public.consult_requests (
  id uuid not null default gen_random_uuid (),
  user_id uuid null default gen_random_uuid (),
  funding_id uuid null default gen_random_uuid (),
  name text null,
  email text null,
  message text null,
  created_at timestamp with time zone not null default now(),
  program_title text null,
  constraint consult_requests_pkey primary key (id),
  constraint consult_requests_user_id_fkey foreign KEY (user_id) references profiles (id)
) TABLESPACE pg_default;


ALTER TABLE "public"."notifications" ALTER COLUMN "project_stage" TYPE text[] USING ARRAY[project_stage];
