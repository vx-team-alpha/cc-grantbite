alter table "public"."profiles" add column "company_info" json default null;
alter table "public"."profiles" add column "company_address" json default null;
alter table "public"."profiles" add column "company_details" json default null;
alter table "public"."profiles" add column "first_name" text default null;
alter table "public"."profiles" add column "last_name" text default null;


create table public.bookmarks (
  funding_id uuid not null default gen_random_uuid (),
  user_id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  constraint bookmark_pkey primary key (funding_id, user_id),
  constraint bookmark_funding_id_fkey foreign KEY (funding_id) references funding_main (id) on update CASCADE on delete CASCADE,
  constraint bookmark_user_id_fkey foreign KEY (user_id) references profiles (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;


CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL,
  industry TEXT[] NOT NULL,
  project_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  project_stage TEXT NOT NULL,
  description TEXT NOT NULL,
  budget_min NUMERIC NULL,
  budget_max NUMERIC NULL,
  funding_purpose TEXT[] NOT NULL,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NULL DEFAULT now(),
  user_id UUID NOT NULL,
  
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES profiles (id) 
    ON UPDATE CASCADE 
    ON DELETE CASCADE,
    
  CONSTRAINT notifications_budget_max_check 
    CHECK (budget_max >= 10000),
    
  CONSTRAINT notifications_check 
    CHECK (budget_min <= budget_max),
    
  CONSTRAINT notifications_industry_check 
    CHECK (array_length(industry, 1) >= 1),
    
  CONSTRAINT notifications_project_name_check 
    CHECK (char_length(project_name) >= 2),
    
  CONSTRAINT notifications_funding_purpose_check 
    CHECK (array_length(funding_purpose, 1) >= 1),
    
  CONSTRAINT notifications_budget_min_check 
    CHECK (budget_min >= 10000)
) TABLESPACE pg_default;


CREATE TABLE public.newsletter (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  email TEXT,
  funding_guide BOOLEAN DEFAULT FALSE,
  sub_newsletter BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT newsletter_pkey PRIMARY KEY (id),
  CONSTRAINT newsletter_email_key UNIQUE (email)
) TABLESPACE pg_default;
