export type ContentType = "مقال" | "قصة" | "رواية";
export type ContentStatus = "منشور" | "قيد المراجعة" | "مرفوض" | "مسودة";

export interface ContentItem {
  id: string;
  title: string;
  author: string;
  authorId: string;
  cover: string;
  views: string;
  type: ContentType;
  category: string;
  tags: string[];
  description: string;
  chapters?: number;
  isComplete?: boolean;
  isExclusive?: boolean;
  status: ContentStatus;
  createdAt: string;
}

export const mockContent: ContentItem[] = [
  {
    id: "1",
    title: "في ظلال الحكمة",
    author: "سارة المحمدي",
    authorId: "w1",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    views: "١٢٤K",
    type: "مقال",
    category: "فكري",
    tags: ["فكري", "فلسفة", "تأمل"],
    description: "مقال فكري يتناول أبعاد الحكمة في الحياة المعاصرة ويستعرض كيف يمكن للفرد أن يجد طريقه في عالم مليء بالتشتت.",
    status: "منشور",
    createdAt: "٢٠٢٥-٠١-١٥",
  },
  {
    id: "2",
    title: "وراء الأبواب المغلقة",
    author: "أحمد الفيصل",
    authorId: "w2",
    cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
    views: "٨٩K",
    type: "رواية",
    category: "إثارة",
    tags: ["إثارة", "غموض", "تشويق"],
    description: "رواية تتابع قصة صحفي يكتشف شبكة أسرار تمتد عبر أجيال في مدينة عربية قديمة.",
    chapters: 24,
    isComplete: false,
    status: "منشور",
    createdAt: "٢٠٢٥-٠٢-١٠",
  },
  {
    id: "3",
    title: "حكايات من الحارة",
    author: "نورا الزهراني",
    authorId: "w3",
    cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=400&fit=crop",
    views: "٢٠١K",
    type: "قصة",
    category: "اجتماعي",
    tags: ["اجتماعي", "واقعي", "إنساني"],
    description: "مجموعة قصصية تروي حكايات أهل الحارة القديمة بأسلوب سردي شيق ومؤثر.",
    status: "منشور",
    createdAt: "٢٠٢٥-٠١-٢٠",
  },
  {
    id: "4",
    title: "رحلة الذات",
    author: "خالد المنصور",
    authorId: "w4",
    cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop",
    views: "٦٥K",
    type: "مقال",
    category: "رأي",
    tags: ["رأي", "تطوير", "ذات"],
    description: "مقال رأي حول رحلة اكتشاف الذات وكيفية بناء حياة ذات معنى في العصر الحديث.",
    status: "منشور",
    createdAt: "٢٠٢٥-٠٣-٠٥",
  },
  {
    id: "5",
    title: "نجوم الصحراء",
    author: "ريم العتيبي",
    authorId: "w5",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
    views: "١٥٥K",
    type: "رواية",
    category: "رومانسي",
    tags: ["رومانسي", "صحراء", "مشاعر"],
    description: "رواية رومانسية تدور أحداثها في قلب الصحراء حيث تتشابك المصائر وتولد قصص الحب.",
    chapters: 32,
    isComplete: true,
    isExclusive: true,
    status: "منشور",
    createdAt: "٢٠٢٤-١٢-٠١",
  },
  {
    id: "6",
    title: "أفكار على الهامش",
    author: "محمد السالم",
    authorId: "w6",
    cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=400&fit=crop",
    views: "٤٢K",
    type: "مقال",
    category: "أدبي",
    tags: ["أدبي", "نقد", "ثقافة"],
    description: "مقال أدبي يناقش تحولات الكتابة العربية المعاصرة وتأثير العولمة على الهوية الثقافية.",
    status: "قيد المراجعة",
    createdAt: "٢٠٢٥-٠٣-١٠",
  },
  {
    id: "7",
    title: "عبر الزمن",
    author: "ليلى الأحمدي",
    authorId: "w7",
    cover: "https://images.unsplash.com/photo-1531901599143-df5010ab9438?w=300&h=400&fit=crop",
    views: "١٧٨K",
    type: "قصة",
    category: "خيال",
    tags: ["خيال", "مغامرة", "تاريخ"],
    description: "قصة خيالية تأخذ بطلتها في رحلة عبر الزمن لاكتشاف أسرار مدينة مفقودة.",
    status: "منشور",
    createdAt: "٢٠٢٥-٠٢-٢٨",
  },
  {
    id: "8",
    title: "أصداء الصمت",
    author: "عبد الله القحطاني",
    authorId: "w8",
    cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=400&fit=crop",
    views: "٩٣K",
    type: "رواية",
    category: "درامي",
    tags: ["درامي", "اجتماعي", "عائلي"],
    description: "رواية درامية تعكس تناقضات المجتمع من خلال حكاية عائلة تحمل أسراراً عبر الأجيال.",
    chapters: 18,
    isComplete: true,
    status: "منشور",
    createdAt: "٢٠٢٥-٠١-٠٨",
  },
];

export const categoryColors: Record<string, string> = {
  "فكري": "bg-amber-100 text-amber-700",
  "رأي": "bg-orange-100 text-orange-700",
  "أدبي": "bg-emerald-100 text-emerald-700",
  "قصصي": "bg-sky-100 text-sky-700",
  "إثارة": "bg-red-100 text-red-700",
  "اجتماعي": "bg-cyan-100 text-cyan-700",
  "رومانسي": "bg-pink-100 text-pink-700",
  "خيال": "bg-violet-100 text-violet-700",
  "غموض": "bg-slate-100 text-slate-700",
  "درامي": "bg-rose-100 text-rose-700",
  "مغامرة": "bg-indigo-100 text-indigo-700",
  "تاريخي": "bg-yellow-100 text-yellow-700",
  "نقد": "bg-teal-100 text-teal-700",
  "ثقافة": "bg-lime-100 text-lime-700",
};

export const typeColors: Record<string, string> = {
  "مقال": "bg-amber-100 text-amber-700",
  "قصة": "bg-sky-100 text-sky-700",
  "رواية": "bg-rose-100 text-rose-700",
};

export const adminStats = [
  { label: "إجمالي الزيارات", value: "٣٤٥,٢١٠", icon: "Eye", trend: "+١٥%", positive: true },
  { label: "المقالات", value: "٤٨١", icon: "FileText", trend: "+١٢", positive: true },
  { label: "القصص", value: "٣٢٤", icon: "BookOpen", trend: "+٨", positive: true },
  { label: "الروايات", value: "١٨٧", icon: "Book", trend: "+٣", positive: true },
  { label: "المجموع", value: "٩٩٢", icon: "Layers", trend: "+٢٣", positive: true },
  { label: "قيد المراجعة", value: "٣٤", icon: "Clock", trend: "+٧", positive: false },
  { label: "الكتّاب", value: "٢٤٨", icon: "Users", trend: "+١٨", positive: true },
  { label: "طلبات الانضمام", value: "١٢", icon: "UserPlus", trend: "جديد", positive: false },
  { label: "التبليغات", value: "٨", icon: "AlertTriangle", trend: "-٣", positive: true },
  { label: "إعلانات قريبة الانتهاء", value: "٥", icon: "Bell", trend: "تنبيه", positive: false },
];

export const recentActivity = [
  { id: "1", type: "مقال جديد", title: "في ظلال الحكمة", user: "سارة المحمدي", date: "منذ ساعة", status: "قيد المراجعة" },
  { id: "2", type: "طلب انضمام", title: "طلب كاتب جديد", user: "عمر الشريف", date: "منذ ٣ ساعات", status: "جديد" },
  { id: "3", type: "رواية جديدة", title: "أصداء الصمت", user: "عبد الله القحطاني", date: "منذ ٥ ساعات", status: "منشور" },
  { id: "4", type: "تبليغ", title: "محتوى مخالف", user: "مشرف النظام", date: "منذ يوم", status: "قيد المراجعة" },
  { id: "5", type: "قصة جديدة", title: "حكايات من الحارة", user: "نورا الزهراني", date: "منذ يومين", status: "منشور" },
];

export const mockWriters = [
  { id: "w1", name: "سارة المحمدي", nationality: "سعودية", email: "sara@example.com", articles: 12, stories: 3, novels: 0, total: 15, status: "نشط" },
  { id: "w2", name: "أحمد الفيصل", nationality: "إماراتي", email: "ahmed@example.com", articles: 5, stories: 2, novels: 3, total: 10, status: "نشط" },
  { id: "w3", name: "نورا الزهراني", nationality: "سعودية", email: "noura@example.com", articles: 8, stories: 15, novels: 1, total: 24, status: "نشط" },
  { id: "w4", name: "خالد المنصور", nationality: "كويتي", email: "khaled@example.com", articles: 3, stories: 1, novels: 1, total: 5, status: "إيقاف" },
  { id: "w5", name: "ريم العتيبي", nationality: "سعودية", email: "reem@example.com", articles: 2, stories: 5, novels: 10, total: 17, status: "نشط" },
  { id: "w6", name: "محمد السالم", nationality: "أردني", email: "mohammed@example.com", articles: 3, stories: 0, novels: 0, total: 3, status: "نشط" },
  { id: "w7", name: "ليلى الأحمدي", nationality: "مصرية", email: "layla@example.com", articles: 7, stories: 14, novels: 4, total: 25, status: "نشط" },
  { id: "w8", name: "عبد الله القحطاني", nationality: "سعودي", email: "abdullah@example.com", articles: 1, stories: 2, novels: 6, total: 9, status: "إيقاف" },
];

export const joinRequests = [
  { id: "jr1", name: "فاطمة الحسين", gender: "أنثى", nationality: "عراقية", email: "fatma@example.com", bio: "كاتبة مهتمة بالأدب العربي المعاصر والنقد الثقافي", date: "منذ يوم", status: "جديد" },
  { id: "jr2", name: "عمر الشريف", gender: "ذكر", nationality: "مصري", email: "omar@example.com", bio: "صحفي وكاتب محتوى متخصص في القضايا الاجتماعية", date: "منذ ٣ أيام", status: "جديد" },
  { id: "jr3", name: "هند المطيري", gender: "أنثى", nationality: "سعودية", email: "hind@example.com", bio: "روائية ناشئة شغوفة بالخيال العلمي والمغامرة", date: "منذ أسبوع", status: "جديد" },
];

export const reportItems = [
  { id: "r1", title: "مقال مثير للجدل", author: "محمد السالم", reason: "محتوى مخالف للسياسات", status: "جديد", reporterEmail: "user1@example.com", reporterNote: "المقال يحتوي على آراء تحريضية", otherReports: 3 },
  { id: "r2", title: "وراء الأبواب المغلقة", author: "أحمد الفيصل", reason: "انتحال أدبي مشتبه", status: "قيد المراجعة", reporterEmail: "user2@example.com", reporterNote: "نص مشابه لرواية منشورة سابقاً", otherReports: 1 },
  { id: "r3", title: "حكايات من الحارة", author: "نورا الزهراني", reason: "محتوى غير لائق", status: "تمت معالجته", reporterEmail: "user3@example.com", reporterNote: "فصل يحتوي على ألفاظ غير مناسبة", otherReports: 0 },
];

export const articleCategories = ["فكري/رأي", "قصصي", "أدبي", "اجتماعي", "تاريخي", "علمي", "ثقافي", "نقدي"];
export const novelCategories = ["إثارة", "رومانسي", "خيال", "غموض", "درامي", "اجتماعي", "تاريخي", "مغامرة"];
export const storyCategories = ["اجتماعي", "خيال", "رومانسي", "واقعي", "كوميدي", "درامي", "رعب", "مغامرة"];
