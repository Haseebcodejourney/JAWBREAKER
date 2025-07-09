
-- Enhanced booking system with payment tracking
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced messaging system
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  subject TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced messages table
DROP TABLE IF EXISTS public.messages;
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  attachments JSONB DEFAULT '[]'::jsonb,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notification system
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced reviews system
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS response_from_clinic TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS response_date TIMESTAMPTZ;

-- Review helpfulness votes
CREATE TABLE IF NOT EXISTS public.review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('helpful', 'not_helpful')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- Analytics and tracking
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Search and filter preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_language TEXT DEFAULT 'tr',
  preferred_currency TEXT DEFAULT 'USD',
  notification_settings JSONB DEFAULT '{
    "email_booking_updates": true,
    "email_promotions": false,
    "push_notifications": true
  }'::jsonb,
  search_preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Saved treatments/favorites
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  treatment_id UUID REFERENCES public.treatments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, treatment_id)
);

-- Enhanced clinic features
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS response_time_hours INTEGER DEFAULT 24;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS total_patients INTEGER DEFAULT 0;
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS specialties TEXT[] DEFAULT '{}';

-- RLS Policies
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Payment transactions policies
CREATE POLICY "Users can view their payment transactions"
ON public.payment_transactions FOR SELECT
USING (
  booking_id IN (
    SELECT id FROM public.bookings 
    WHERE patient_id = auth.uid()
  )
);

-- Conversations policies
CREATE POLICY "Users can view their conversations"
ON public.conversations FOR SELECT
USING (
  patient_id = auth.uid() OR 
  clinic_id IN (SELECT id FROM public.clinics WHERE owner_id = auth.uid())
);

CREATE POLICY "Users can create conversations"
ON public.conversations FOR INSERT
WITH CHECK (patient_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view conversation messages"
ON public.messages FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM public.conversations 
    WHERE patient_id = auth.uid() OR 
          clinic_id IN (SELECT id FROM public.clinics WHERE owner_id = auth.uid())
  )
);

CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (sender_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

-- Review votes policies
CREATE POLICY "Users can manage their review votes"
ON public.review_votes FOR ALL
USING (user_id = auth.uid());

-- User activities policies
CREATE POLICY "Users can view their activities"
ON public.user_activities FOR SELECT
USING (user_id = auth.uid());

-- User preferences policies
CREATE POLICY "Users can manage their preferences"
ON public.user_preferences FOR ALL
USING (user_id = auth.uid());

-- User favorites policies  
CREATE POLICY "Users can manage their favorites"
ON public.user_favorites FOR ALL
USING (user_id = auth.uid());

-- Admin policies for all tables
CREATE POLICY "Admins can manage payment transactions"
ON public.payment_transactions FOR ALL
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage conversations"
ON public.conversations FOR ALL
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage messages"
ON public.messages FOR ALL
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage notifications"
ON public.notifications FOR ALL
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can view all activities"
ON public.user_activities FOR ALL
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_transactions_booking_id ON public.payment_transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_conversations_patient_id ON public.conversations(patient_id);
CREATE INDEX IF NOT EXISTS idx_conversations_clinic_id ON public.conversations(clinic_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);

-- Functions for analytics
CREATE OR REPLACE FUNCTION public.track_user_activity(
  activity_type TEXT,
  entity_type TEXT DEFAULT NULL,
  entity_id UUID DEFAULT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_activities (
    user_id, activity_type, entity_type, entity_id, metadata
  ) VALUES (
    auth.uid(), activity_type, entity_type, entity_id, metadata
  );
END;
$$;

-- Function to update review helpfulness
CREATE OR REPLACE FUNCTION public.update_review_helpfulness()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.reviews 
  SET helpful_count = (
    SELECT COUNT(*) 
    FROM public.review_votes 
    WHERE review_id = NEW.review_id AND vote_type = 'helpful'
  )
  WHERE id = NEW.review_id;
  
  RETURN NEW;
END;
$$;

-- Trigger for review helpfulness
DROP TRIGGER IF EXISTS update_review_helpfulness_trigger ON public.review_votes;
CREATE TRIGGER update_review_helpfulness_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.review_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_review_helpfulness();
