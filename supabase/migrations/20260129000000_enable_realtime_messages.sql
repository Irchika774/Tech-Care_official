-- Enable Realtime for messages table
alter publication supabase_realtime add table messages;

-- Enable Realtime for notifications table
alter publication supabase_realtime add table notifications;

-- Ensure RLS Policies exist for messages
-- Policy for inserting messages (Sender can insert)
create policy "Users can insert their own messages"
on messages for insert
with check ( auth.uid() = sender_id );

-- Policy for viewing messages (Participants can view)
-- Note: This requires a join with bookings or checking sender_id
-- Simple policy: Users can see messages where they are the sender
create policy "Users can view their own sent messages"
on messages for select
using ( auth.uid() = sender_id );

-- Complex policy: Users can see messages for bookings they belong to
-- This is hard to express efficiently in RLS without joining bookings.
-- We'll assume the client filters by booking_id and the policy allows generic access OR 
-- we add a better policy if possible.
-- For now, let's ensure "authenticated" users can read messages if they are linked to the booking.

create policy "Users can view messages for their bookings"
on messages for select
using (
  exists (
    select 1 from bookings
    where bookings.id = messages.booking_id
    and (
      bookings.customer_id in (select id from customers where user_id = auth.uid())
      or
      bookings.technician_id in (select id from technicians where user_id = auth.uid())
    )
  )
);
