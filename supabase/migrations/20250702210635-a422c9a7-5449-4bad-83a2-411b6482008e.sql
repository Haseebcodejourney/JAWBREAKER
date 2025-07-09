
-- Enhanced Patient Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS medical_history JSONB DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact JSONB DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS insurance_info JSONB DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS communication_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}';

-- Enhanced Clinic Profiles
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS facilities JSONB DEFAULT '[]';
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]';
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS success_stories JSONB DEFAULT '[]';
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS awards JSONB DEFAULT '[]';
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}';

-- Lead Management System
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  source TEXT, -- 'website', 'referral', 'social', 'advertisement'
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  score INTEGER DEFAULT 0,
  interested_treatments TEXT[],
  budget_range TEXT,
  preferred_date DATE,
  notes TEXT,
  assigned_to UUID REFERENCES public.profiles(id),
  last_contact_date TIMESTAMP WITH TIME ZONE,
  conversion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Lead Activities/Interactions
CREATE TABLE public.lead_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'call', 'email', 'meeting', 'note', 'status_change'
  description TEXT NOT NULL,
  outcome TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Communication Hub - Conversations (already exists, enhance it)
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'));
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.profiles(id);
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS resolution_time INTERVAL;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5);

-- Customer Segmentation
CREATE TABLE public.customer_segments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL, -- JSON criteria for automatic segmentation
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Customer Segment Memberships
CREATE TABLE public.customer_segment_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  segment_id UUID REFERENCES public.customer_segments(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  added_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_automatic BOOLEAN DEFAULT true,
  UNIQUE(segment_id, customer_id)
);

-- Automated Follow-up Sequences
CREATE TABLE public.followup_sequences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_event TEXT NOT NULL, -- 'booking_created', 'treatment_completed', 'inquiry_received'
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.followup_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID REFERENCES public.followup_sequences(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  delay_days INTEGER NOT NULL,
  action_type TEXT NOT NULL, -- 'email', 'sms', 'task', 'call'
  template_id TEXT,
  subject TEXT,
  content TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Customer Journey Tracking
CREATE TABLE public.customer_journeys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stage TEXT NOT NULL, -- 'awareness', 'consideration', 'decision', 'booking', 'treatment', 'recovery', 'follow_up'
  sub_stage TEXT,
  entry_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  exit_date TIMESTAMP WITH TIME ZONE,
  duration INTERVAL,
  notes TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Saved Searches
CREATE TABLE public.saved_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  search_type TEXT NOT NULL, -- 'patients', 'clinics', 'treatments', 'bookings'
  criteria JSONB NOT NULL,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_segment_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followup_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followup_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

-- Leads Policies
CREATE POLICY "Staff can manage leads" ON public.leads
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'clinic_staff'))
  );

CREATE POLICY "Assigned staff can view leads" ON public.leads
  FOR SELECT USING (assigned_to = auth.uid());

-- Lead Activities Policies
CREATE POLICY "Staff can manage lead activities" ON public.lead_activities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'clinic_staff'))
  );

-- Customer Segments Policies
CREATE POLICY "Staff can view customer segments" ON public.customer_segments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'clinic_staff'))
  );

CREATE POLICY "Admins can manage customer segments" ON public.customer_segments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Customer Segment Members Policies
CREATE POLICY "Staff can view segment members" ON public.customer_segment_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'clinic_staff'))
  );

CREATE POLICY "Admins can manage segment members" ON public.customer_segment_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Follow-up Sequences Policies
CREATE POLICY "Staff can view followup sequences" ON public.followup_sequences
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'clinic_staff'))
  );

CREATE POLICY "Admins can manage followup sequences" ON public.followup_sequences
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Follow-up Steps Policies
CREATE POLICY "Staff can view followup steps" ON public.followup_steps
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'clinic_staff'))
  );

CREATE POLICY "Admins can manage followup steps" ON public.followup_steps
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Customer Journey Policies
CREATE POLICY "Customers can view their journey" ON public.customer_journeys
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Staff can manage customer journeys" ON public.customer_journeys
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'clinic_staff'))
  );

-- Saved Searches Policies
CREATE POLICY "Users can manage their saved searches" ON public.saved_searches
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view shared searches" ON public.saved_searches
  FOR SELECT USING (is_shared = true);

-- Indexes for better performance
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_source ON public.leads(source);
CREATE INDEX idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_lead_activities_lead_id ON public.lead_activities(lead_id);
CREATE INDEX idx_lead_activities_activity_type ON public.lead_activities(activity_type);
CREATE INDEX idx_customer_journeys_customer_id ON public.customer_journeys(customer_id);
CREATE INDEX idx_customer_journeys_stage ON public.customer_journeys(stage);
CREATE INDEX idx_conversations_assigned_to ON public.conversations(assigned_to);
CREATE INDEX idx_conversations_priority ON public.conversations(priority);
