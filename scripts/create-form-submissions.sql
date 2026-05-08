-- Create form_submissions table
CREATE TABLE IF NOT EXISTS public.form_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'contact' NOT NULL, -- 'contact', 'bulk_order', 'service_inquiry'
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'read', 'responded', 'archived'
    metadata JSONB DEFAULT '{}'::jsonb -- For any extra info like category name or product slug
);

-- Enable RLS
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public to insert
CREATE POLICY "Allow public to insert submissions" 
ON public.form_submissions 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view and manage
CREATE POLICY "Allow admins to view all submissions" 
ON public.form_submissions 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Allow admins to update submissions" 
ON public.form_submissions 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);
