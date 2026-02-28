
-- Create ads table
CREATE TABLE public.ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slot text NOT NULL DEFAULT 'home_top', -- home_top, home_middle, home_bottom, listing, content
  ad_code text, -- AdSense or custom HTML code
  image_url text,
  link_url text,
  is_active boolean NOT NULL DEFAULT true,
  starts_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Public can read active ads
CREATE POLICY "Public can read active ads"
ON public.ads FOR SELECT
USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Admins full access
CREATE POLICY "Admins can manage ads"
ON public.ads FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_ads_updated_at
BEFORE UPDATE ON public.ads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
