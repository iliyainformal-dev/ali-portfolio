/* ═══════════════════════════════════════════
   📚 ساختار آثار (بدون متن)
   
   متن‌ها (title, desc) در فایل content/works/*.json هستن
   ═══════════════════════════════════════════ */

const WORKS = [
  /* ===== نقاشی‌های دیجیتال (۱۶ اثر) ===== */
  { id: 1,  image: "images/works/digital-paintings/1.jpg",  category: "digital", year: "۱۴۰۳", tools: "", insta: "" },
  { id: 2,  image: "images/works/digital-paintings/2.jpeg", category: "digital", year: "۱۴۰۳", tools: "", insta: "" },
  { id: 3,  image: "images/works/digital-paintings/3.jpg",  category: "digital", year: "۱۴۰۳", tools: "", insta: "" },
  { id: 4,  image: "images/works/digital-paintings/4.png",  category: "digital", year: "۱۴۰۳", tools: "", insta: "" },
  { id: 5,  image: "images/works/digital-paintings/5.jpeg", category: "digital", year: "۱۴۰۲", tools: "", insta: "" },
  { id: 6,  image: "images/works/digital-paintings/6.jpg",  category: "digital", year: "۱۴۰۲", tools: "", insta: "" },
  { id: 7,  image: "images/works/digital-paintings/7.jpg",  category: "digital", year: "۱۴۰۲", tools: "", insta: "" },
  { id: 8,  image: "images/works/digital-paintings/8.jpg",  category: "digital", year: "۱۴۰۲", tools: "", insta: "" },
  { id: 9,  image: "images/works/digital-paintings/9.jpg",  category: "digital", year: "۱۴۰۱", tools: "", insta: "" },
  { id: 10, image: "images/works/digital-paintings/10.jpg", category: "digital", year: "۱۴۰۱", tools: "", insta: "" },
  { id: 11, image: "images/works/digital-paintings/11.jpg", category: "digital", year: "۱۴۰۱", tools: "", insta: "" },
  { id: 12, image: "images/works/digital-paintings/12.jpg", category: "digital", year: "۱۴۰۱", tools: "", insta: "" },
  { id: 13, image: "images/works/digital-paintings/13.jpg", category: "digital", year: "۱۴۰۰", tools: "", insta: "" },
  { id: 14, image: "images/works/digital-paintings/14.jpg", category: "digital", year: "۱۴۰۰", tools: "", insta: "" },
  { id: 15, image: "images/works/digital-paintings/15.jpg", category: "digital", year: "۱۴۰۰", tools: "", insta: "" },
  { id: 16, image: "images/works/digital-paintings/16.jpg", category: "digital", year: "۱۴۰۰", tools: "", insta: "" },

  /* ===== نقاشی‌های سنتی (۸ اثر) ===== */
  { id: 17, image: "images/works/paintings/1.jpg", category: "traditional", year: "۱۴۰۲", tools: "", insta: "" },
  { id: 18, image: "images/works/paintings/2.jpg", category: "traditional", year: "۱۴۰۲", tools: "", insta: "" },
  { id: 19, image: "images/works/paintings/3.jpg", category: "traditional", year: "۱۴۰۲", tools: "", insta: "" },
  { id: 20, image: "images/works/paintings/4.jpg", category: "traditional", year: "۱۴۰۱", tools: "", insta: "" },
  { id: 21, image: "images/works/paintings/5.jpg", category: "traditional", year: "۱۴۰۱", tools: "", insta: "" },
  { id: 22, image: "images/works/paintings/6.jpg", category: "traditional", year: "۱۴۰۰", tools: "", insta: "" },
  { id: 23, image: "images/works/paintings/7.jpg", category: "traditional", year: "۱۴۰۰", tools: "", insta: "" },
  { id: 24, image: "images/works/paintings/8.jpg", category: "traditional", year: "۱۴۰۰", tools: "", insta: "" },

  /* ===== اتودها (۲ اثر) ===== */
  { id: 25, image: "images/works/sketch/1.jpeg", category: "sketch", year: "۱۴۰۳", tools: "", insta: "" },
  { id: 26, image: "images/works/sketch/2.jpeg", category: "sketch", year: "۱۴۰۳", tools: "", insta: "" },

  /* ===== پوسترها (۷ اثر) ===== */
  { id: 27, image: "images/works/poster/1.jpeg", category: "poster", year: "۱۴۰۳", tools: "", insta: "" },
  { id: 28, image: "images/works/poster/2.jpg",  category: "poster", year: "۱۴۰۳", tools: "", insta: "" },
  { id: 29, image: "images/works/poster/3.jpeg", category: "poster", year: "۱۴۰۲", tools: "", insta: "" },
  { id: 30, image: "images/works/poster/4.jpeg", category: "poster", year: "۱۴۰۲", tools: "", insta: "" },
  { id: 31, image: "images/works/poster/5.jpeg", category: "poster", year: "۱۴۰۲", tools: "", insta: "" },
  { id: 32, image: "images/works/poster/6.jpeg", category: "poster", year: "۱۴۰۱", tools: "", insta: "" },
  { id: 33, image: "images/works/poster/7.jpeg", category: "poster", year: "۱۴۰۱", tools: "", insta: "" },

  /* ===== عکاسی (۴ اثر) ===== */
  { id: 34, image: "images/works/photos/1.jpeg", category: "photo", year: "۱۴۰۳", tools: "", insta: "" },
  { id: 35, image: "images/works/photos/2.jpeg", category: "photo", year: "۱۴۰۳", tools: "", insta: "" },
  { id: 36, image: "images/works/photos/3.jpeg", category: "photo", year: "۱۴۰۳", tools: "", insta: "" },
  { id: 37, image: "images/works/photos/4.jpeg", category: "photo", year: "۱۴۰۳", tools: "", insta: "" }
];

/* ===== ترجمه دسته‌بندی‌ها ===== */
function getCategoryLabel(cat, i18n){
  const map = {
    digital:     i18n?.worksPage?.tabs?.digital     || 'نقاشی دیجیتال',
    traditional: i18n?.worksPage?.tabs?.traditional || 'نقاشی',
    sketch:      i18n?.worksPage?.tabs?.sketch      || 'اتود',
    poster:      i18n?.worksPage?.tabs?.poster      || 'پوستر',
    photo:       i18n?.worksPage?.tabs?.photo       || 'عکاسی'
  };
  return map[cat] || cat;
}