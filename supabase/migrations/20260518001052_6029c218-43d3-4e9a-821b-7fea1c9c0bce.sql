CREATE TABLE public.generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_type TEXT,
  brand_voice TEXT,
  mood TEXT,
  platform TEXT,
  user_input TEXT,
  generated_caption TEXT,
  generated_cta TEXT,
  generated_hashtags TEXT[],
  generated_story TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_generations_user_created ON public.generations (user_id, created_at DESC);

ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own generations"
  ON public.generations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own generations"
  ON public.generations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own generations"
  ON public.generations FOR DELETE USING (auth.uid() = user_id);