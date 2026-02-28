# Supabase Database Schema & Configuration

## 📋 جدول المحتويات
- [الأنواع المخصصة (Enums)](#الأنواع-المخصصة)
- [الجداول](#الجداول)
- [سياسات RLS](#سياسات-rls)
- [الدوال (Functions)](#الدوال)
- [المشغلات (Triggers)](#المشغلات)

---

## الأنواع المخصصة

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'writer', 'user');
CREATE TYPE public.content_status AS ENUM ('مسودة', 'قيد المراجعة', 'منشور', 'مرفوض');
CREATE TYPE public.content_type AS ENUM ('مقال', 'قصة', 'رواية');
CREATE TYPE public.report_status AS ENUM ('جديد', 'قيد المراجعة', 'تمت معالجته');
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'rejected');
```

---

## الجداول

### 👤 profiles

```sql
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  gender text,
  nationality text,
  avatar_url text,
  bio text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### 🔑 user_roles

```sql
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_roles_user_id_role_unique UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
```

### 📩 writer_requests

```sql
CREATE TABLE public.writer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  bio text NOT NULL,
  gender text,
  nationality text,
  status request_status NOT NULL DEFAULT 'pending',
  rejection_reason text,
  reviewed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.writer_requests ENABLE ROW LEVEL SECURITY;

-- طلب واحد معلق فقط لكل مستخدم
CREATE UNIQUE INDEX idx_unique_pending_writer_request
ON public.writer_requests (user_id)
WHERE status = 'pending';
```

### 📚 contents

```sql
CREATE TABLE public.contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  writer_id uuid NOT NULL,
  title text NOT NULL,
  summary text,
  body text,
  cover_url text,
  pdf_url text,
  type content_type NOT NULL,
  category text,
  tags text[] DEFAULT '{}',
  status content_status NOT NULL DEFAULT 'قيد المراجعة',
  is_premium boolean NOT NULL DEFAULT false,
  is_complete boolean DEFAULT false,
  views integer NOT NULL DEFAULT 0,
  rejection_reason text,
  reviewed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;
```

### 📖 chapters

```sql
CREATE TABLE public.chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES public.contents(id),
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  chapter_number integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
```

### 💳 subscriptions

```sql
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan text NOT NULL DEFAULT 'شهري',
  status text NOT NULL DEFAULT 'نشط',
  amount numeric NOT NULL DEFAULT 10.00,
  starts_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
```

### 🚨 reports

```sql
CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES public.contents(id),
  reporter_id uuid NOT NULL,
  reason text NOT NULL,
  reporter_note text,
  status report_status NOT NULL DEFAULT 'جديد',
  resolved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
```

### 📢 ads

```sql
CREATE TABLE public.ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  link_url text,
  ad_code text,
  slot text NOT NULL DEFAULT 'home_top',
  is_active boolean NOT NULL DEFAULT true,
  starts_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
```

---

## سياسات RLS

### profiles

```sql
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid());
```

### user_roles

```sql
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (has_role(auth.uid(), 'admin'));
```

### writer_requests

```sql
CREATE POLICY "Users can create own writer request"
ON public.writer_requests FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own writer request"
ON public.writer_requests FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all writer requests"
ON public.writer_requests FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update writer requests"
ON public.writer_requests FOR UPDATE
USING (has_role(auth.uid(), 'admin'));
```

### contents

```sql
CREATE POLICY "Public can read published content"
ON public.contents FOR SELECT
USING (status = 'منشور' AND deleted_at IS NULL);

CREATE POLICY "Writers can view own content"
ON public.contents FOR SELECT
USING (writer_id = auth.uid());

CREATE POLICY "Writers can create content"
ON public.contents FOR INSERT
WITH CHECK (
  writer_id = auth.uid()
  AND (has_role(auth.uid(), 'writer') OR has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Writers can update own content"
ON public.contents FOR UPDATE
USING (
  writer_id = auth.uid()
  AND (has_role(auth.uid(), 'writer') OR has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Writers can delete own content"
ON public.contents FOR DELETE
USING (writer_id = auth.uid());

CREATE POLICY "Admins can view all content"
ON public.contents FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all content"
ON public.contents FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete all content"
ON public.contents FOR DELETE
USING (has_role(auth.uid(), 'admin'));
```

### chapters

```sql
CREATE POLICY "Public can read published chapters"
ON public.chapters FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM contents
    WHERE contents.id = chapters.content_id
    AND contents.status = 'منشور'
    AND contents.deleted_at IS NULL
  )
);

CREATE POLICY "Writers can manage own chapters"
ON public.chapters FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM contents
    WHERE contents.id = chapters.content_id
    AND contents.writer_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all chapters"
ON public.chapters FOR ALL
USING (has_role(auth.uid(), 'admin'));
```

### subscriptions

```sql
CREATE POLICY "Users can view own subscriptions"
ON public.subscriptions FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create own subscription"
ON public.subscriptions FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions"
ON public.subscriptions FOR SELECT
USING (has_role(auth.uid(), 'admin'));
```

### reports

```sql
CREATE POLICY "Users can create reports"
ON public.reports FOR INSERT
WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can view own reports"
ON public.reports FOR SELECT
USING (reporter_id = auth.uid());

CREATE POLICY "Admins can view all reports"
ON public.reports FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reports"
ON public.reports FOR UPDATE
USING (has_role(auth.uid(), 'admin'));
```

### ads

```sql
CREATE POLICY "Public can read active ads"
ON public.ads FOR SELECT
USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Admins can manage ads"
ON public.ads FOR ALL
USING (has_role(auth.uid(), 'admin'));
```

---

## الدوال (Functions)

### has_role — التحقق من دور المستخدم

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

### handle_new_user — إنشاء ملف شخصي وتعيين دور تلقائياً

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

### approve_writer_request — الموافقة الذرية على طلب الكاتب

```sql
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
  SELECT user_id, status INTO v_user_id, v_status
  FROM public.writer_requests
  WHERE id = p_request_id;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Request not found';
  END IF;

  IF v_status != 'pending' THEN
    RAISE EXCEPTION 'Request is not pending';
  END IF;

  IF NOT public.has_role(p_admin_id, 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  UPDATE public.writer_requests
  SET status = 'approved', reviewed_by = p_admin_id, updated_at = now()
  WHERE id = p_request_id;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'writer')
  ON CONFLICT (user_id, role) DO NOTHING;

  UPDATE public.profiles
  SET updated_at = now()
  WHERE id = v_user_id;
END;
$$;
```

### increment_views — زيادة عدد المشاهدات

```sql
CREATE OR REPLACE FUNCTION public.increment_views(p_content_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.contents
  SET views = views + 1
  WHERE id = p_content_id
  AND status = 'منشور'
  AND deleted_at IS NULL;
END;
$$;
```

### has_active_subscription — التحقق من الاشتراك النشط

```sql
CREATE OR REPLACE FUNCTION public.has_active_subscription(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = _user_id
    AND expires_at > now()
    AND status = 'نشط'
  )
$$;
```

### update_updated_at_column — تحديث تلقائي لعمود updated_at

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
```

---

## 🔐 ملخص الأمان

| القاعدة | التنفيذ |
|---|---|
| الأدوار في جدول منفصل | ✅ `user_roles` مع `SECURITY DEFINER` |
| طلب كاتب واحد معلق لكل مستخدم | ✅ `UNIQUE INDEX` على `(user_id) WHERE status = 'pending'` |
| موافقة ذرية على طلب الكاتب | ✅ `approve_writer_request()` دالة واحدة |
| المحتوى المنشور فقط مرئي للعامة | ✅ RLS: `status = 'منشور' AND deleted_at IS NULL` |
| المستخدمون لا يستطيعون تغيير أدوارهم | ✅ لا توجد سياسة INSERT/UPDATE للمستخدمين على `user_roles` |
| حذف ناعم للمحتوى | ✅ عمود `deleted_at` |
