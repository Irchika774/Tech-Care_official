-- Enable Realtime for messages and notifications tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;
END $$;

-- Ensure RLS Policies exist for messages
-- Policy for inserting messages (Sender can insert)
DROP POLICY IF EXISTS "Users can insert their own messages" ON messages;
create policy "Users can insert their own messages"
on messages for insert
with check ( auth.uid() = sender_id );

-- Policy for viewing messages (Participants can view)
DROP POLICY IF EXISTS "Users can view their own sent messages" ON messages;
create policy "Users can view their own sent messages"
on messages for select
using ( auth.uid() = sender_id );

DROP POLICY IF EXISTS "Users can view messages for their bookings" ON messages;
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
