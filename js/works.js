/* ═══════════════════════════════════════════
   📚 ساختار آثار (بدون متن)
   
   متن‌ها (title, desc) در فایل content/works/*.json هستن
   ═══════════════════════════════════════════ */

const WORKS = [
  /* ===== نقاشی‌های دیجیتال ===== */
  { id: 1,  image: "images/works/digital-paintings/1.jpg", category: "digital", year: "۱۴۰۳", tools: "Photoshop", insta: "" },
  { id: 3,  image: "images/works/digital-paintings/3.jpg", category: "digital", year: "۱۴۰۳", tools: "Photoshop", insta: "" },
  { id: 4,  image: "images/works/digital-paintings/4.jpg", category: "digital", year: "۱۴۰۳", tools: "Krita", insta: "" },
  { id: 9,  image: "images/works/digital-paintings/9.jpg", category: "digital", year: "۱۴۰۲", tools: "Photoshop", insta: "" },
  { id: 10, image: "images/works/digital-paintings/49.jpg", category: "digital", year: "۱۴۰۲", tools: "Photoshop", insta: "" },
  { id: 11, image: "images/works/digital-paintings/110.jpg", category: "digital", year: "۱۴۰۲", tools: "Clip Studio Paint", insta: "" },
  { id: 12, image: "images/works/digital-paintings/111.jpg", category: "digital", year: "۱۴۰۱", tools: "Photoshop", insta: "" },
  { id: 13, image: "images/works/digital-paintings/192.jpg", category: "digital", year: "۱۴۰۱", tools: "Krita", insta: "" },
  { id: 14, image: "images/works/digital-paintings/A.jpg", category: "digital", year: "۱۴۰۱", tools: "Photoshop", insta: "" },
  { id: 15, image: "images/works/digital-paintings/ali.ghaemi78pi.jpg", category: "digital", year: "۱۴۰۰", tools: "Photoshop", insta: "" },
  { id: 16, image: "images/works/digital-paintings/po3.jpg", category: "digital", year: "۱۴۰۰", tools: "Photoshop", insta: "" },
  { id: 17, image: "images/works/digital-paintings/r.jpg", category: "digital", year: "۱۴۰۰", tools: "Clip Studio Paint", insta: "" },

  /* ===== نقاشی‌های سنتی ===== */
  { id: 18, image: "images/works/paintings/1.jpg", category: "traditional", year: "۱۴۰۲", tools: "رنگ روغن", insta: "" },
  { id: 19, image: "images/works/paintings/2.JPG", category: "traditional", year: "۱۴۰۲", tools: "آبرنگ", insta: "" },
  { id: 20, image: "images/works/paintings/3.jpg", category: "traditional", year: "۱۴۰۱", tools: "رنگ روغن", insta: "" },
  { id: 21, image: "images/works/paintings/4.jpg", category: "traditional", year: "۱۴۰۱", tools: "آبرنگ", insta: "" },
  { id: 22, image: "images/works/paintings/5.jpg", category: "traditional", year: "۱۴۰۰", tools: "مداد رنگی", insta: "" },
  { id: 23, image: "images/works/paintings/6.jpg", category: "traditional", year: "۱۴۰۰", tools: "رنگ روغن", insta: "" },

  /* ===== اسکچ‌ها ===== */
  { id: 24, image: "images/works/sketch/1.png", category: "sketch", year: "۱۴۰۳", tools: "مداد", insta: "" },
  { id: 25, image: "images/works/sketch/2.jpg", category: "sketch", year: "۱۴۰۳", tools: "مداد", insta: "" },

  /* ===== پوسترها ===== */
  { id: 26, image: "images/works/poster/1.jpeg", category: "poster", year: "۱۴۰۳", tools: "Photoshop", insta: "" },
  { id: 27, image: "images/works/poster/2.jpeg", category: "poster", year: "۱۴۰۳", tools: "Illustrator", insta: "" },
  { id: 28, image: "images/works/poster/3.jpeg", category: "poster", year: "۱۴۰۲", tools: "Photoshop", insta: "" },
  { id: 29, image: "images/works/poster/4.jpeg", category: "poster", year: "۱۴۰۲", tools: "Photoshop", insta: "" },
  { id: 30, image: "images/works/poster/5.jpeg", category: "poster", year: "۱۴۰۱", tools: "Illustrator", insta: "" },
  { id: 31, image: "images/works/poster/6.jpeg", category: "poster", year: "۱۴۰۱", tools: "Illustrator", insta: "" }
];

/* ===== ترجمه دسته‌بندی‌ها ===== */
function getCategoryLabel(cat, i18n){
  const map = {
    digital:     i18n?.worksPage?.tabs?.digital     || 'نقاشی دیجیتال',
    traditional: i18n?.worksPage?.tabs?.traditional || 'نقاشی سنتی',
    sketch:      i18n?.worksPage?.tabs?.sketch      || 'اسکچ‌ها',
    poster:      i18n?.worksPage?.tabs?.poster      || 'پوسترها',
    photo:       i18n?.worksPage?.tabs?.photo       || 'عکاسی'
  };
  return map[cat] || cat;
}