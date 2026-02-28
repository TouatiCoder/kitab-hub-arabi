
-- 1. Add paypal_subscription_id to subscriptions table
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS paypal_subscription_id text UNIQUE;

-- 2. Drop existing RLS policies on contents that handle SELECT
-- We need to replace them with premium-aware policies
DROP POLICY IF EXISTS "Public can read published content" ON public.contents;

-- 3. Create policy: everyone can read FREE published content
CREATE POLICY "Public can read free published content"
ON public.contents FOR SELECT
USING (
  is_premium = false
  AND status = 'منشور'
  AND deleted_at IS NULL
);

-- 4. Create policy: active subscribers can read PREMIUM published content
CREATE POLICY "Subscribers can read premium content"
ON public.contents FOR SELECT
USING (
  is_premium = true
  AND status = 'منشور'
  AND deleted_at IS NULL
  AND EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE subscriptions.user_id = auth.uid()
    AND subscriptions.status = 'نشط'
    AND subscriptions.expires_at > now()
  )
);

-- 5. Create function to handle PayPal subscription activation/renewal
CREATE OR REPLACE FUNCTION public.upsert_paypal_subscription(
  p_user_id uuid,
  p_paypal_subscription_id text,
  p_status text DEFAULT 'نشط',
  p_plan text DEFAULT 'شهري',
  p_amount numeric DEFAULT 10.00
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, paypal_subscription_id, status, plan, amount, expires_at)
  VALUES (p_user_id, p_paypal_subscription_id, p_status, p_plan, p_amount, now() + interval '30 days')
  ON CONFLICT (paypal_subscription_id) DO UPDATE
  SET status = p_status,
      expires_at = CASE
        WHEN p_status = 'نشط' THEN GREATEST(subscriptions.expires_at, now()) + interval '30 days'
        ELSE subscriptions.expires_at
      END;
END;
$$;

-- 6. Create function to cancel/expire PayPal subscription
CREATE OR REPLACE FUNCTION public.cancel_paypal_subscription(
  p_paypal_subscription_id text,
  p_new_status text DEFAULT 'cancelled'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.subscriptions
  SET status = p_new_status
  WHERE paypal_subscription_id = p_paypal_subscription_id;
END;
$$;
