
-- Add notification preferences to user_preferences table
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS message_notifications JSONB DEFAULT '{"email": true, "push": true, "sound": true}'::jsonb;

-- Create message_attachments table for file/image sharing
CREATE TABLE IF NOT EXISTS public.message_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for message_attachments
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view attachments in their conversations" 
  ON public.message_attachments 
  FOR SELECT 
  USING (
    message_id IN (
      SELECT m.id 
      FROM messages m 
      JOIN conversations c ON m.conversation_id = c.id 
      WHERE c.patient_id = auth.uid() 
         OR c.clinic_id IN (SELECT id FROM clinics WHERE owner_id = auth.uid())
    )
  );

CREATE POLICY "Users can create attachments for their messages" 
  ON public.message_attachments 
  FOR INSERT 
  WITH CHECK (
    message_id IN (
      SELECT m.id 
      FROM messages m 
      JOIN conversations c ON m.conversation_id = c.id 
      WHERE c.patient_id = auth.uid() 
         OR c.clinic_id IN (SELECT id FROM clinics WHERE owner_id = auth.uid())
    )
  );

-- Create typing_indicators table for real-time typing status
CREATE TABLE IF NOT EXISTS public.typing_indicators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_typing BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

-- Add RLS policies for typing_indicators
ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage typing indicators in their conversations" 
  ON public.typing_indicators 
  FOR ALL 
  USING (
    conversation_id IN (
      SELECT c.id 
      FROM conversations c 
      WHERE c.patient_id = auth.uid() 
         OR c.clinic_id IN (SELECT id FROM clinics WHERE owner_id = auth.uid())
    )
  );

-- Add conversation priority and tags
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.profiles(id);

-- Create function to update conversation last_message_at
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.conversations 
  SET 
    last_message_at = NEW.created_at,
    updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update conversation timestamp on new message
DROP TRIGGER IF EXISTS update_conversation_last_message_trigger ON public.messages;
CREATE TRIGGER update_conversation_last_message_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_last_message();

-- Enable realtime for new tables
ALTER TABLE public.message_attachments REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.message_attachments;

ALTER TABLE public.typing_indicators REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.typing_indicators;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_status_priority ON public.conversations(status, priority);
