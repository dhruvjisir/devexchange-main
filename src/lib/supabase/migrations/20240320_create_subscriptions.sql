-- Create subscriptions table
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  type text check (type in ('basic', 'premium')) not null,
  status text check (status in ('active', 'inactive')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone not null,
  
  constraint subscriptions_user_id_type_key unique (user_id, type)
);

-- Add RLS policies
alter table public.subscriptions enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own subscriptions" on public.subscriptions;
drop policy if exists "Users can create their own subscriptions" on public.subscriptions;

-- Create new policies
create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can create their own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id); 