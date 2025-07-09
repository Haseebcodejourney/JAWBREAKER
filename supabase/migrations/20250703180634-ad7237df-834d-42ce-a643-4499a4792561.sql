
-- Storage bucket for message attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-attachments', 'message-attachments', true);

-- Storage policies for message attachments
CREATE POLICY "Anyone can view message attachments" ON storage.objects
FOR SELECT USING (bucket_id = 'message-attachments');

CREATE POLICY "Authenticated users can upload message attachments" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'message-attachments' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their message attachments" ON storage.objects
FOR UPDATE USING (bucket_id = 'message-attachments' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their message attachments" ON storage.objects
FOR DELETE USING (bucket_id = 'message-attachments' AND auth.role() = 'authenticated');

-- Enable realtime for typing indicators
ALTER TABLE public.typing_indicators REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_indicators;

-- Enable realtime for messages
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Enable realtime for conversations
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
