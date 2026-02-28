
-- 1. Atomic function: approve writer request + assign writer role
CREATE OR REPLACE FUNCTION public.approve_writer_request(p_request_id uuid, p_admin_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid;
  v_status request_status;
BEGIN
  -- Get the request
  SELECT user_id, status INTO v_user_id, v_status
  FROM public.writer_requests
  WHERE id = p_request_id;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Request not found';
  END IF;

  IF v_status != 'pending' THEN
    RAISE EXCEPTION 'Request is not pending';
  END IF;

  -- Verify caller is admin
  IF NOT public.has_role(p_admin_id, 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  -- Update request status
  UPDATE public.writer_requests
  SET status = 'approved', reviewed_by = p_admin_id, updated_at = now()
  WHERE id = p_request_id;

  -- Add writer role (ignore if already exists)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'writer')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Update profile
  UPDATE public.profiles
  SET updated_at = now()
  WHERE id = v_user_id;
END;
$$;

-- 2. Unique constraint: only one pending request per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_pending_writer_request
ON public.writer_requests (user_id)
WHERE status = 'pending';

-- 3. Ensure user_roles has unique constraint for ON CONFLICT
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'user_roles_user_id_role_key'
  ) THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_unique UNIQUE (user_id, role);
  END IF;
EXCEPTION WHEN duplicate_table THEN
  NULL;
END $$;
