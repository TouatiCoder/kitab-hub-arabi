
## Arabic Online Book Platform — Frontend Plan

A full 5-page modern Arabic RTL web application inspired by Abjjad, Wattpad, and Goodreads — built with React, Tailwind CSS, and a purple gradient brand identity.

---

### 🎨 Design System
- **Direction**: Full RTL layout with Arabic typography
- **Primary palette**: Purple gradient `#4C1D95 → #A855F7`
- **Neutrals**: Soft grays and whites for cards/backgrounds
- **Rounded cards**: 12–16px radius with soft shadows
- **Animations**: Smooth hover effects, fade-ins, skeleton loaders
- **Responsive**: Mobile-first, tablet, and desktop breakpoints

---

### 🏠 Page 1 — Home Page (`/`)
- **Sticky Navbar**: Logo (right), search bar (center), Login button + avatar (left)
- **Hero Section**: Full-width gradient banner with title, subtitle, and CTA button
- **"🔥 جديد ورائج" Section**: Horizontal scroll strip of book cards (cover, title, author, ⭐ rating, 👁 views, tags, Read/Buy button)
- **Recommended Books Section**: 4-column responsive grid
- **Most Popular Section**: Ranked list with covers and stats
- **Mobile Bottom Navigation**: 5 tabs (الرئيسية، الكتب، البحث، مكتبتي، حسابي)

---

### 📖 Page 2 — Book Details + PDF Viewer (`/book/:id`)
- **Book Header**: Large cover (left in RTL), title, author, rating, views, category tags, description
- **Action Buttons**: "اقرأ الآن" (free) or "اشتر الآن" (paid)
- **PDF Viewer Area**: Clean embedded iframe-style reader with previous/next page controls, page counter, and a dark mode toggle for reading comfort
- **Related Books**: Horizontal scroll strip below the viewer

---

### 👑 Page 3 — Admin Dashboard (`/admin/dashboard`)
- **Fixed Sidebar**: Logo, nav links (لوحة التحكم، الكتب، التقارير، المستخدمون، المبيعات، الإعدادات), collapse toggle
- **Topbar**: Admin name, notification bell, logout button
- **Stats Cards Row**: Total Books, Total Users, Total Sales, Revenue, Reports Count — each with icon and trend indicator
- **Charts Section**:
  - Line chart (daily views over time)
  - Pie chart (book categories breakdown)
  - Bar chart (top performing books)
- **Recent Activity Table**: Latest transactions or book additions

---

### 🔐 Page 4 — Admin Login (`/admin/login`)
- Centered card on a soft purple gradient background
- Email + Password fields with validation UI
- "تسجيل الدخول" primary button
- Error message state (red inline alert)
- Clean minimal professional style

---

### 👤 Page 5 — User Login (`/login`)
- Same card layout as Admin Login but with:
  - "تذكرني" checkbox
  - "نسيت كلمة المرور؟" link
  - "ليس لديك حساب؟ سجّل الآن" registration link
- Slightly warmer/softer visual than admin login

---

### 🧱 Shared Components
- **BookCard**: Cover image, title, author, rating stars, view count, tags, action button — used across all listing sections
- **Tag/Badge**: Colored category labels (رومانسي، خيال، دراما...)
- **StatsCard**: Icon + number + label + trend arrow — used in admin dashboard
- **Skeleton Loader**: Animated placeholder cards for loading states
- **Mobile Drawer Menu**: Slide-in navigation for small screens
- **Navigation**: Sticky top navbar + mobile bottom bar

---

### 📋 Sample Arabic Content
All pages will include realistic Arabic mock data — book titles, author names, descriptions, and Arabic UI labels — to make it feel like a real product from day one.
