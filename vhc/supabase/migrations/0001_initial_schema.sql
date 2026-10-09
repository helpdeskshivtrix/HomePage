-- BharatConnect initial schema. Apply in Supabase SQL Editor after creating a project.
-- This schema is a starting point, not a substitute for a security review before production.
create extension if not exists pgcrypto;

create type public.app_role as enum ('customer','provider','job_seeker','employer','freelancer','client','admin');
create type public.verification_status as enum ('not_started','pending','approved','rejected','needs_correction');
create type public.booking_status as enum ('requested','accepted','rejected','reschedule_requested','cancelled','completed','disputed');
create type public.job_type as enum ('full_time','part_time','contract','remote','temporary','freelance');
create type public.application_status as enum ('submitted','reviewing','shortlisted','rejected','withdrawn','hired');
create type public.project_status as enum ('open','in_progress','submitted','completed','cancelled','disputed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 100),
  city text,
  locality text,
  pin_code text check (pin_code is null or pin_code ~ '^[0-9]{6}$'),
  bio text check (bio is null or char_length(bio) <= 2000),
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  primary key(user_id, role)
);
create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.provider_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  business_name text not null,
  category_id uuid references public.service_categories(id),
  skills text[] not null default '{}',
  experience_years integer not null default 0 check (experience_years between 0 and 70),
  service_city text,
  service_pin_codes text[] not null default '{}',
  indicative_price numeric(12,2) check (indicative_price is null or indicative_price >= 0),
  portfolio_paths text[] not null default '{}',
  business_verification public.verification_status not null default 'not_started',
  professional_verification public.verification_status not null default 'not_started',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.provider_availability (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.provider_profiles(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at),
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  provider_id uuid not null references public.provider_profiles(id),
  service_category_id uuid references public.service_categories(id),
  requested_at timestamptz,
  address_text text,
  customer_note text check (customer_note is null or char_length(customer_note) <= 2000),
  agreed_price numeric(12,2) check (agreed_price is null or agreed_price >= 0),
  status public.booking_status not null default 'requested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.booking_events (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  previous_status public.booking_status,
  new_status public.booking_status not null,
  note text,
  created_at timestamptz not null default now()
);
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id),
  name text not null,
  description text,
  website text,
  city text,
  pin_code text check (pin_code is null or pin_code ~ '^[0-9]{6}$'),
  verification public.verification_status not null default 'not_started',
  created_at timestamptz not null default now()
);
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  created_by uuid not null references public.profiles(id),
  title text not null check (char_length(title) between 3 and 180),
  description text not null check (char_length(description) between 20 and 12000),
  location text,
  pin_code text check (pin_code is null or pin_code ~ '^[0-9]{6}$'),
  job_type public.job_type not null,
  salary_min numeric(12,2) check (salary_min is null or salary_min >= 0),
  salary_max numeric(12,2) check (salary_max is null or salary_max >= salary_min),
  skills text[] not null default '{}',
  status text not null default 'published' check (status in ('draft','published','paused','expired','closed')),
  expires_at timestamptz,
  promoted_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.candidate_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  headline text,
  skills text[] not null default '{}',
  experience_years numeric(4,1) check (experience_years is null or experience_years between 0 and 70),
  resume_path text,
  resume_visibility text not null default 'private' check (resume_visibility in ('private','application_only')),
  updated_at timestamptz not null default now()
);
create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  candidate_id uuid not null references public.profiles(id) on delete cascade,
  cover_note text check (cover_note is null or char_length(cover_note) <= 5000),
  status public.application_status not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(job_id, candidate_id)
);
create table public.freelancer_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  headline text,
  skills text[] not null default '{}',
  portfolio jsonb not null default '[]'::jsonb,
  hourly_rate numeric(12,2) check (hourly_rate is null or hourly_rate >= 0),
  updated_at timestamptz not null default now()
);
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id),
  title text not null check (char_length(title) between 3 and 180),
  brief text not null check (char_length(brief) between 20 and 12000),
  category text,
  budget_min numeric(12,2) check (budget_min is null or budget_min >= 0),
  budget_max numeric(12,2) check (budget_max is null or budget_max >= budget_min),
  deadline timestamptz,
  status public.project_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  freelancer_id uuid not null references public.profiles(id),
  cover_note text not null check (char_length(cover_note) between 20 and 5000),
  proposed_amount numeric(12,2) not null check (proposed_amount >= 0),
  delivery_days integer check (delivery_days is null or delivery_days > 0),
  status text not null default 'submitted' check (status in ('submitted','shortlisted','accepted','rejected','withdrawn')),
  created_at timestamptz not null default now(),
  unique(project_id, freelancer_id)
);
create table public.project_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now()
);
create table public.work_submissions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  submitted_by uuid not null references public.profiles(id),
  note text,
  file_paths text[] not null default '{}',
  created_at timestamptz not null default now()
);
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id),
  target_user_id uuid not null references public.profiles(id),
  booking_id uuid references public.bookings(id),
  project_id uuid references public.projects(id),
  rating integer not null check (rating between 1 and 5),
  comment text check (comment is null or char_length(comment) <= 2000),
  moderation_status text not null default 'pending' check (moderation_status in ('pending','published','hidden')),
  created_at timestamptz not null default now(),
  check ((booking_id is not null)::integer + (project_id is not null)::integer = 1)
);
create table public.verification_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  verification_type text not null check (verification_type in ('email','phone','identity','business','professional')),
  status public.verification_status not null default 'not_started',
  reviewer_id uuid references public.profiles(id),
  provider_reference text,
  consent_at timestamptz,
  reviewed_at timestamptz,
  correction_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id),
  target_type text not null check (target_type in ('user','provider','job','project','review','message')),
  target_id uuid not null,
  reason text not null check (char_length(reason) between 3 and 2000),
  status text not null default 'open' check (status in ('open','investigating','resolved','dismissed')),
  moderator_id uuid references public.profiles(id),
  resolution_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  link_path text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create table public.advertisements (
  id uuid primary key default gen_random_uuid(),
  business_owner_id uuid not null references public.profiles(id),
  title text not null,
  target_city text,
  target_pin_codes text[] not null default '{}',
  destination_url text,
  budget_limit numeric(12,2) not null check (budget_limit >= 0),
  spent_amount numeric(12,2) not null default 0 check (spent_amount >= 0 and spent_amount <= budget_limit),
  starts_at timestamptz,
  ends_at timestamptz,
  status text not null default 'draft' check (status in ('draft','pending_review','active','paused','ended','rejected')),
  created_at timestamptz not null default now()
);

create index idx_provider_city on public.provider_profiles(service_city, is_published);
create index idx_provider_category on public.provider_profiles(category_id);
create index idx_booking_customer on public.bookings(customer_id, created_at desc);
create index idx_booking_provider on public.bookings(provider_id, created_at desc);
create index idx_jobs_location_status on public.jobs(location, status, created_at desc);
create index idx_jobs_expiry on public.jobs(expires_at) where status = 'published';
create index idx_applications_candidate on public.job_applications(candidate_id, created_at desc);
create index idx_applications_job on public.job_applications(job_id, status);
create index idx_projects_status on public.projects(status, created_at desc);
create index idx_proposals_project on public.proposals(project_id, status);
create index idx_notifications_user on public.notifications(user_id, created_at desc);
create index idx_reports_status on public.reports(status, created_at desc);

-- Enable RLS everywhere before granting user-facing access.
do $$ declare t text; begin
  foreach t in array array['profiles','user_roles','service_categories','provider_profiles','provider_availability','bookings','booking_events','companies','jobs','candidate_profiles','job_applications','freelancer_profiles','projects','proposals','project_messages','work_submissions','reviews','verification_records','reports','notifications','advertisements']
  loop execute format('alter table public.%I enable row level security', t); end loop;
end $$;

-- Safe initial policies: public can read only published provider/job/project rows.
-- More granular write policies must be added after deciding the exact role and workflow model.
create policy "profiles_read_self" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles_insert_self" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles_update_self" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "roles_read_self" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "categories_read_active" on public.service_categories for select to anon, authenticated using (active = true);
create policy "providers_read_published" on public.provider_profiles for select to anon, authenticated using (is_published = true or user_id = auth.uid());
create policy "jobs_read_published" on public.jobs for select to anon, authenticated using (status = 'published');
create policy "projects_read_open" on public.projects for select to anon, authenticated using (status = 'open');
create policy "candidate_self_read" on public.candidate_profiles for select to authenticated using (user_id = auth.uid());
create policy "candidate_self_write" on public.candidate_profiles for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "freelancer_self_read" on public.freelancer_profiles for select to authenticated using (user_id = auth.uid());
create policy "freelancer_self_write" on public.freelancer_profiles for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notifications_self" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "notifications_update_self" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- IMPORTANT: user_roles has no client write policy by design. Role assignment must be performed
-- by a trusted admin workflow / server-side function, never by an editable profile field.
-- Add and test role-specific RLS policies before enabling booking/application/proposal writes.
