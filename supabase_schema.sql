-- Create the items table
CREATE TABLE IF NOT EXISTS public.items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Create policies (Public access for this demo)
-- NOTE: In production, you should restrict these to authenticated users.

-- Allow public read access
CREATE POLICY "Allow public read access" 
ON public.items 
FOR SELECT 
USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access" 
ON public.items 
FOR INSERT 
WITH CHECK (true);
