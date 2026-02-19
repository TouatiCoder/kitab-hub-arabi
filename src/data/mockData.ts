export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  views: string;
  category: string;
  tags: string[];
  description: string;
  isFree: boolean;
  price?: string;
  pages: number;
}

export const mockBooks: Book[] = [
  {
    id: "1",
    title: "أجنحة الغسق",
    author: "سارة المحمدي",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    rating: 4.8,
    views: "١٢٤K",
    category: "رومانسي",
    tags: ["رومانسي", "درامي"],
    description: "رواية رومانسية تدور أحداثها في مدينة قديمة تحمل أسراراً لا تُعدّ، حيث تلتقي بطلتنا بشابٍ غامض يغيّر مجرى حياتها للأبد.",
    isFree: true,
    pages: 320,
  },
  {
    id: "2",
    title: "مدينة الظلال",
    author: "أحمد الفيصل",
    cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
    rating: 4.6,
    views: "٨٩K",
    category: "خيال علمي",
    tags: ["خيال علمي", "إثارة"],
    description: "في عالم ما بعد الحضارة، يسعى بطلنا لاكتشاف أسرار مدينة دفنتها الرمال منذ مئات السنين.",
    isFree: false,
    price: "٤٩ ريال",
    pages: 450,
  },
  {
    id: "3",
    title: "حكايات البحر",
    author: "نورا الزهراني",
    cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=400&fit=crop",
    rating: 4.9,
    views: "٢٠١K",
    category: "أدب",
    tags: ["أدب", "شعر"],
    description: "مجموعة قصصية تأخذنا في رحلة مع البحر وأسراره، مع شخصيات ثرية تحمل هموم الإنسان وأحلامه.",
    isFree: true,
    pages: 280,
  },
  {
    id: "4",
    title: "لعبة الأقدار",
    author: "خالد المنصور",
    cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop",
    rating: 4.5,
    views: "٦٥K",
    category: "غموض",
    tags: ["غموض", "إثارة"],
    description: "محقق بارع يجد نفسه أمام قضية تجمع خيوطاً من الماضي والحاضر في مدينة تختبئ وراء واجهاتها البراقة أسرار مروعة.",
    isFree: false,
    price: "٣٩ ريال",
    pages: 390,
  },
  {
    id: "5",
    title: "نجوم لا تُحصى",
    author: "ريم العتيبي",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
    rating: 4.7,
    views: "١٥٥K",
    category: "رومانسي",
    tags: ["رومانسي", "مشاعر"],
    description: "قصة حب تتشابك مع خيوط القدر، بين فتاة تحمل وجع الفقد وشاب يبحث عن الأمل في سماء مضطربة.",
    isFree: true,
    pages: 310,
  },
  {
    id: "6",
    title: "الطريق إلى النور",
    author: "محمد السالم",
    cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=400&fit=crop",
    rating: 4.4,
    views: "٤٢K",
    category: "تطوير ذات",
    tags: ["تطوير ذات", "تحفيزي"],
    description: "دليل عملي يأخذ بيدك نحو تحقيق أهدافك وبناء شخصية قوية في عالم يتغير بسرعة مذهلة.",
    isFree: false,
    price: "٢٩ ريال",
    pages: 220,
  },
  {
    id: "7",
    title: "عبر الزمن",
    author: "ليلى الأحمدي",
    cover: "https://images.unsplash.com/photo-1531901599143-df5010ab9438?w=300&h=400&fit=crop",
    rating: 4.8,
    views: "١٧٨K",
    category: "مغامرة",
    tags: ["مغامرة", "خيال"],
    description: "رحلة عبر الزمن تأخذ بطلتنا من القرن الحادي والعشرين إلى أعماق التاريخ حيث تكتشف هويتها الحقيقية.",
    isFree: true,
    pages: 420,
  },
  {
    id: "8",
    title: "أصداء الصمت",
    author: "عبد الله القحطاني",
    cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=400&fit=crop",
    rating: 4.6,
    views: "٩٣K",
    category: "درامي",
    tags: ["درامي", "اجتماعي"],
    description: "رواية اجتماعية تعكس تناقضات المجتمع المعاصر من خلال حكاية عائلة تحمل في طياتها أسراراً جيلاً بعد جيل.",
    isFree: false,
    price: "٤٤ ريال",
    pages: 360,
  },
];

export const categoryColors: Record<string, string> = {
  "رومانسي": "bg-pink-100 text-pink-700",
  "خيال علمي": "bg-blue-100 text-blue-700",
  "أدب": "bg-green-100 text-green-700",
  "غموض": "bg-orange-100 text-orange-700",
  "تطوير ذات": "bg-yellow-100 text-yellow-700",
  "مغامرة": "bg-purple-100 text-purple-700",
  "درامي": "bg-red-100 text-red-700",
  "إثارة": "bg-indigo-100 text-indigo-700",
  "شعر": "bg-teal-100 text-teal-700",
  "مشاعر": "bg-rose-100 text-rose-700",
  "تحفيزي": "bg-amber-100 text-amber-700",
  "خيال": "bg-violet-100 text-violet-700",
  "اجتماعي": "bg-cyan-100 text-cyan-700",
};

export const adminStats = [
  { label: "إجمالي الكتب", value: "٢,٤٨١", icon: "BookOpen", trend: "+١٢%", positive: true },
  { label: "المستخدمون", value: "٨٤,٣٢٠", icon: "Users", trend: "+٢٣%", positive: true },
  { label: "المبيعات", value: "١٢,٧٤٣", icon: "ShoppingCart", trend: "+٧%", positive: true },
  { label: "الإيرادات", value: "٤٢٣,٠٠٠ ر.س", icon: "DollarSign", trend: "+١٨%", positive: true },
  { label: "التقارير", value: "٣٤", icon: "FileText", trend: "-٢", positive: false },
];

export const recentActivity = [
  { id: "1", type: "كتاب جديد", title: "أجنحة الغسق", user: "سارة المحمدي", date: "منذ ساعة", amount: "مجاني" },
  { id: "2", type: "مبيعة", title: "مدينة الظلال", user: "عمر الشريف", date: "منذ ٣ ساعات", amount: "٤٩ ر.س" },
  { id: "3", type: "مستخدم جديد", title: "تسجيل حساب", user: "فاطمة الحسين", date: "منذ ٥ ساعات", amount: "-" },
  { id: "4", type: "مبيعة", title: "لعبة الأقدار", user: "بندر العمر", date: "منذ ٦ ساعات", amount: "٣٩ ر.س" },
  { id: "5", type: "تقرير", title: "محتوى مخالف", user: "مشرف النظام", date: "منذ يوم", amount: "-" },
];
