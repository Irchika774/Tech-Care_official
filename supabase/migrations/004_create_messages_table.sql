-- Create messages table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid references public.bookings(id) on delete cascade not null,
  sender_id uuid references auth.users(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_read boolean default false
);

-- Enable RLS
alter table public.messages enable row level security;

-- Policies
create policy "Users can view messages for their bookings"
  on public.messages for select
  using (
    exists (
      select 1 from public.bookings b
      where b.id = messages.booking_id
      and (b.customer_id in (select id from customers where user_id = auth.uid()) 
           or b.technician_id in (select id from technicians where user_id = auth.uid()))
    )
  );

create policy "Users can insert messages for their bookings"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
      and (b.customer_id in (select id from customers where user_id = auth.uid()) 
           or b.technician_id in (select id from technicians where user_id = auth.uid()))
    )
  );

-- Realtime
alter publication supabase_realtime add table public.messages;
