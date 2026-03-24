alter table public.profiles
add column if not exists phone text,
add column if not exists linkedin_url text,
add column if not exists github_url text,
add column if not exists current_company text,
add column if not exists current_role text;
