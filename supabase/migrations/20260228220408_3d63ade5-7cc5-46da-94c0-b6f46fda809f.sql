
-- =====================================================
-- PHASE 1: ENUMS
-- =====================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'writer', 'user');
CREATE TYPE public.content_type AS ENUM ('مقال', 'قصة', 'رواية');
CREATE TYPE public.content_status AS ENUM ('مسودة', 'قيد المراجعة', 'منشور', 'مرفوض');
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.report_status AS ENUM ('جديد', 'قيد المراجعة', 'تمت معالجته');

-- =====================================================
-- PHASE 2: TABLES
-- =====================================================

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  gender TEXT,
  nationality TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (SEPARATE from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Writer requests
CREATE TABLE public.writer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  gender TEXT,
  nationality TEXT,
  email TEXT NOT NULL,
  bio TEXT NOT NULL,
  status request_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contents table
CREATE TABLE public.contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  writer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  summary TEXT,
  cover_url TEXT,
  type content_type NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  status content_status NOT NULL DEFAULT 'قيد المراجعة',
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  is_complete BOOLEAN DEFAULT FALSE,
  pdf_url TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Chapters table (for chapter-by-chapter content)
CREATE TABLE public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(content_id, chapter_number)
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'شهري',
  amount NUMERIC(10,2) NOT NULL DEFAULT 10.00,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'نشط',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  reporter_note TEXT,
  status report_status NOT NULL DEFAULT 'جديد',
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- PHASE 3: INDEXES
-- =====================================================
CREATE INDEX idx_contents_writer ON public.contents(writer_id);
CREATE INDEX idx_contents_type ON public.contents(type);
CREATE INDEX idx_contents_status ON public.contents(status);
CREATE INDEX idx_contents_created ON public.contents(created_at DESC);
CREATE INDEX idx_chapters_content ON public.chapters(content_id);
CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_expires ON public.subscriptions(expires_at);
CREATE INDEX idx_reports_content ON public.reports(content_id);
CREATE INDEX idx_writer_requests_status ON public.writer_requests(status);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);

-- =====================================================
-- PHASE 4: SECURITY DEFINER FUNCTIONS
-- =====================================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Check if user has active subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = _user_id
    AND expires_at > now()
    AND status = 'نشط'
  )
$$;

-- Increment views atomically
CREATE OR REPLACE FUNCTION public.increment_views(p_content_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.contents
  SET views = views + 1
  WHERE id = p_content_id
  AND status = 'منشور'
  AND deleted_at IS NULL;
END;
$$;

-- Update updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- =====================================================
-- PHASE 5: TRIGGERS
-- =====================================================

-- Auto-create profile on auth signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contents_updated_at
  BEFORE UPDATE ON public.contents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON public.chapters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_writer_requests_updated_at
  BEFORE UPDATE ON public.writer_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- PHASE 6: ENABLE RLS ON ALL TABLES
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PHASE 7: RLS POLICIES
-- =====================================================

-- ---- PROFILES ----
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- ---- USER ROLES ----
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ---- WRITER REQUESTS ----
CREATE POLICY "Users can create own writer request"
  ON public.writer_requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own writer request"
  ON public.writer_requests FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all writer requests"
  ON public.writer_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update writer requests"
  ON public.writer_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ---- CONTENTS ----
-- Anyone can read published, non-deleted content
CREATE POLICY "Public can read published content"
  ON public.contents FOR SELECT
  USING (
    status = 'منشور'
    AND deleted_at IS NULL
  );

-- Writers can view their own content (any status)
CREATE POLICY "Writers can view own content"
  ON public.contents FOR SELECT
  TO authenticated
  USING (writer_id = auth.uid());

-- Admins can view all content
CREATE POLICY "Admins can view all content"
  ON public.contents FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Writers can insert content
CREATE POLICY "Writers can create content"
  ON public.contents FOR INSERT
  TO authenticated
  WITH CHECK (
    writer_id = auth.uid()
    AND (public.has_role(auth.uid(), 'writer') OR public.has_role(auth.uid(), 'admin'))
  );

-- Writers can update own content
CREATE POLICY "Writers can update own content"
  ON public.contents FOR UPDATE
  TO authenticated
  USING (
    writer_id = auth.uid()
    AND (public.has_role(auth.uid(), 'writer') OR public.has_role(auth.uid(), 'admin'))
  );

-- Admins can update all content
CREATE POLICY "Admins can update all content"
  ON public.contents FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Writers can soft-delete own content
CREATE POLICY "Writers can delete own content"
  ON public.contents FOR DELETE
  TO authenticated
  USING (writer_id = auth.uid());

-- Admins can delete any content
CREATE POLICY "Admins can delete all content"
  ON public.contents FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ---- CHAPTERS ----
-- Anyone can read chapters of published content
CREATE POLICY "Public can read published chapters"
  ON public.chapters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contents
      WHERE contents.id = chapters.content_id
      AND contents.status = 'منشور'
      AND contents.deleted_at IS NULL
    )
  );

-- Writers can manage own chapters
CREATE POLICY "Writers can manage own chapters"
  ON public.chapters FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.contents
      WHERE contents.id = chapters.content_id
      AND contents.writer_id = auth.uid()
    )
  );

-- Admins can manage all chapters
CREATE POLICY "Admins can manage all chapters"
  ON public.chapters FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ---- SUBSCRIPTIONS ----
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create own subscription"
  ON public.subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ---- REPORTS ----
CREATE POLICY "Users can create reports"
  ON public.reports FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can view own reports"
  ON public.reports FOR SELECT
  TO authenticated
  USING (reporter_id = auth.uid());

CREATE POLICY "Admins can view all reports"
  ON public.reports FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reports"
  ON public.reports FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
