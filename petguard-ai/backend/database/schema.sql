-- Pets Table
CREATE TABLE IF NOT EXISTS public.pets (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER,
    breed TEXT,
    history TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SOS Emergency Table
CREATE TABLE IF NOT EXISTS public.sos (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    issue TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Grants (required when tables are created via SQL)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.pets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.sos TO authenticated;

-- RLS Policies
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own pets
CREATE POLICY "Users can insert their own pets" ON public.pets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can select their own pets" ON public.pets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own pets" ON public.pets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pets" ON public.pets FOR DELETE USING (auth.uid() = user_id);

-- SOS feed (Dashboard)
CREATE POLICY "Authenticated users can select all sos" ON public.sos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert sos" ON public.sos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Enable realtime on SOS
ALTER PUBLICATION supabase_realtime ADD TABLE public.sos;
