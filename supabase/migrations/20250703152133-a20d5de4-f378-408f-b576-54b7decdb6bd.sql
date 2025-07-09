
-- Add sender_type column to messages table to distinguish message types
ALTER TABLE public.messages 
ADD COLUMN sender_type TEXT DEFAULT 'user' CHECK (sender_type IN ('patient', 'clinic', 'admin'));

-- Update existing messages to set sender_type based on user role
UPDATE public.messages 
SET sender_type = (
  SELECT 
    CASE 
      WHEN p.role = 'patient' THEN 'patient'
      WHEN p.role = 'clinic' THEN 'clinic'
      WHEN p.role = 'admin' THEN 'admin'
      ELSE 'user'
    END
  FROM profiles p 
  WHERE p.id = messages.sender_id
);

-- Create function to automatically create conversation when booking is made
CREATE OR REPLACE FUNCTION public.create_conversation_on_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create conversation when booking is created
  INSERT INTO public.conversations (
    patient_id,
    clinic_id,
    booking_id,
    subject,
    status
  ) VALUES (
    NEW.patient_id,
    NEW.clinic_id,
    NEW.id,
    'Booking Discussion - ' || COALESCE((SELECT name FROM treatments WHERE id = NEW.treatment_id), 'Treatment'),
    'active'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create conversation on booking
DROP TRIGGER IF EXISTS create_conversation_trigger ON public.bookings;
CREATE TRIGGER create_conversation_trigger
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.create_conversation_on_booking();

-- Enable realtime for messages table
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.messages;

-- Enable realtime for conversations table
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.conversations;
