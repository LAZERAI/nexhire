-- Enable the pgvector extension to work with embeddings
create extension if not exists vector;

-- Create Roles Enum
create type user_role as enum ('candidate', 'recruiter');

-- Create Job Types Enum
create type job_type_category as enum ('full-time', 'part-time', 'contract');

-- Create Experience Level Enum
create type experience_level_category as enum ('entry', 'mid', 'senior');

-- Create Work Mode Enum
create type work_mode_category as enum ('remote', 'hybrid', 'onsite');

-- 1. PROFILES TABLE
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role user_role default 'candidate',
  full_name text,
  avatar_url text,
  headline text,
  bio text,
  location text,
  experience_years integer,
  skills text[] default '{}',
  resume_url text,
  resume_embedding vector(384),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. COMPANIES TABLE
create table public.companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  logo_url text,
  website text,
  description text,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. JOBS TABLE
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  location text,
  salary_range text,
  job_type job_type_category default 'full-time',
  experience_level experience_level_category default 'mid',
  work_mode work_mode_category default 'onsite',
  skills_required text[] default '{}',
  company_id uuid references public.companies(id) on delete cascade not null,
  embedding vector(384),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. APPLICATIONS TABLE
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) on delete cascade not null,
  candidate_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'pending' check (status in ('pending', 'interviewing', 'rejected', 'hired')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(job_id, candidate_id) -- Prevent double application
);

-- 5. POSTS TABLE (Community Feed)
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  media_url text,
  helpful_count integer default 0,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES

-- Profiles: Anyone can view profiles, users can only update their own
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Companies: Anyone can view, only owners can manage
alter table public.companies enable row level security;
create policy "Companies are viewable by everyone." on public.companies for select using (true);
create policy "Owners can manage their companies." on public.companies for all using (auth.uid() = owner_id);

-- Jobs: Anyone can view, only recruiters can manage
alter table public.jobs enable row level security;
create policy "Jobs are viewable by everyone." on public.jobs for select using (true);
create policy "Recruiters can manage jobs." on public.jobs for all 
  using (exists (select 1 from public.companies where id = company_id and owner_id = auth.uid()));

-- Applications: Candidates see their own, Recruiters see theirs
alter table public.applications enable row level security;
create policy "Candidates can see own applications." on public.applications for select using (auth.uid() = candidate_id);
create policy "Recruiters can see applications for their jobs." on public.applications for select
  using (exists (
    select 1 from public.jobs j
    join public.companies c on j.company_id = c.id
    where j.id = job_id and c.owner_id = auth.uid()
  ));
create policy "Candidates can apply to jobs." on public.applications for insert with check (auth.uid() = candidate_id);

-- Posts: Anyone can view, authors can manage
alter table public.posts enable row level security;
create policy "Posts are viewable by everyone." on public.posts for select using (true);
create policy "Authors can manage their posts." on public.posts for all using (auth.uid() = author_id);

-- AI MATCHING RPC FUNCTIONS

-- Function to match jobs for a candidate vector
create or replace function match_jobs (
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  description text,
  location text,
  salary_range text,
  job_type text,
  experience_level text,
  work_mode text,
  skills_required text[],
  company_id uuid,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    j.id,
    j.title,
    j.description,
    j.location,
    j.salary_range,
    j.job_type::text,
    j.experience_level::text,
    j.work_mode::text,
    j.skills_required,
    j.company_id,
    1 - (j.embedding <=> query_embedding) as similarity
  from public.jobs j
  where 1 - (j.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;

-- Function to match candidates for a job vector
create or replace function match_candidates (
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  full_name text,
  headline text,
  bio text,
  location text,
  experience_years int,
  skills text[],
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    p.id,
    p.full_name,
    p.headline,
    p.bio,
    p.location,
    p.experience_years,
    p.skills,
    1 - (p.resume_embedding <=> query_embedding) as similarity
  from public.profiles p
  where p.role = 'candidate' 
    and 1 - (p.resume_embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
