# 📋 BACKUP — پروژه alighaemi.art
# بخش ۱: اطلاعات پایه

> آخرین آپدیت: ۲۷ سپتامبر ۲۰۲۵
> این سند کامل پروژه‌ی علی قائمی هست.
> برای شروع چت جدید، این فایل رو به AI بده.

---

## 🌐 اطلاعات اصلی

| مورد | مقدار |
|---|---|
| نام صاحب سایت | علی قائمی (Ali Ghaemi) |
| دامنه | `alighaemi.art` |
| GitHub | `github.com/iliyainformal-dev/ali-portfolio` |
| Hosting | Cloudflare Workers |
| Database | Cloudflare D1 |
| Database نام | `ali-portfolio-db` |
| Database ID | `8b1cd83b-3e47-4ba0-8919-807c8c271d3c` |
| ایمیل | `alighaemi315@gmail.com` |
| تاریخ ثبت دامنه | Sep 21, 2026 |
| تاریخ انقضا | Sep 21, 2027 |
| Registrar | Iran Server |

---

## 📱 شبکه‌های اجتماعی

| پلتفرم | آیدی |
|---|---|
| Instagram | `iamalighaemi` |
| Telegram | `AliGhaemi1384` |
| YouTube | `@iliya.informal` |
| Email | `alighaemi315@gmail.com` |

---

## 🎨 پالت رنگ (کامل)

```css
:root{
  /* پس‌زمینه */
  --bg:        #0a0a0f;   /* مشکی عمیق اصلی */
  --bg-2:      #13131a;   /* مشکی دوم (بخش‌های alt) */
  --card:      #1a1a22;   /* کارت‌ها */
  --line:      #26262e;   /* خطوط جداکننده */

  /* متن */
  --text:      #ededf2;   /* متن اصلی */
  --muted:     #8a8a95;   /* متن کم‌رنگ */

  /* اکسنت */
  --accent:    #e63946;   /* قرمز شرابی (اصلی) */
  --accent-2:  #d4a574;   /* طلایی مات (دوم) */
  --purple:    #7b2cbf;   /* بنفش (لهجه) */

  /* ابعاد */
  --radius:    16px;
}
```

---

## 🔤 فونت‌ها

| کاربرد | فونت | منبع |
|---|---|---|
| اصلی (فارسی) | Vazirmatn | CDN jsdelivr |
| امضا | Allura | Google Fonts |
| نقشه | SVG | CDN svg-maps |

**لینک CDNها:**
```html
<!-- Vazirmatn -->
<link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" />

<!-- Allura -->
<link href="https://fonts.googleapis.com/css2?family=Allura&display=swap" rel="stylesheet" />

<!-- Map SVG -->
https://cdn.jsdelivr.net/npm/@svg-maps/world@1.0.1/world.svg
```

---

## 🎯 خلاصه پروژه

**چی هست؟**
یه سایت پورتفولیوی چندزبانه حرفه‌ای برای علی قائمی (طراح گرافیک، هنرمند، عکاس).

**ویژگی‌های اصلی:**
- ۷ زبان (فارسی، انگلیسی، عربی، روسی، آلمانی، چینی، فرانسوی)
- صفحه انتخاب زبان/کشور با نقشه جهان
- سیستم احراز هویت (ثبت‌نام، ورود، بازیابی رمز)
- پروفایل کاربر (ویرایش، آواتار، حذف حساب)
- گالری با ۵ دسته (دیجیتال، سنتی، اسکچ، پوستر، عکاسی)
- Splash سینمایی با بیت فردوسی + امضای انیمیشنی
- آپدیت خودکار از GitHub

**لحن کار:**
صمیمی، داداش‌گونه، قدم به قدم، حرفه‌ای.

---

## ⚠️ نکات مهم

1. **Cloudflare از ایران بدون VPN کار می‌کنه** ✅
2. **Supabase/Firebase/Auth0 نیاز به VPN دارن** ❌
3. **دامنه مال خودت، کسی نمی‌تونه بگیره**
4. **node_modules تو .gitignore هست** (آپلود نمیشه)
5. **هر تغییر → git push → Cloudflare خودکار آپدیت**
6. **برای تست محلی: python3 -m http.server 8000** (چون fetch با file:// کار نمی‌کنه)

---

**پایان بخش ۱**
# 📋 BACKUP — پروژه alighaemi.art
# بخش ۲: ساختار و کد

---

## 📁 ساختار کامل فایل‌ها

```
ali-portfolio/
│
├── index.html              (صفحه اصلی + splash سینمایی)
├── welcome.html            (انتخاب زبان/کشور با نقشه)
├── about.html              (داستان من)
├── contact.html            (شروع همکاری / نامه دعوت)
├── works.html              (گالری کامل با ۵ تب)
├── profile.html            (پروفایل کاربر)
│
├── worker.js               (API احراز هویت - Cloudflare Worker)
├── wrangler.toml           (تنظیمات Cloudflare)
├── package.json            (تنظیمات Node.js)
├── package-lock.json
├── .gitignore              (node_modules, .DS_Store)
├── BACKUP.md               (همین فایل)
│
├── css/
│   ├── style.css           (همه استایل‌های اصلی)
│   └── welcome.css         (استایل Welcome + نقشه)
│
├── js/
│   ├── i18n.js             (سیستم چندزبانه)
│   ├── main.js             (splash + lightbox + featured gallery)
│   ├── welcome.js          (منطق Welcome + نقشه + سرچ کشور)
│   ├── works.js            (ساختار آثار - بدون متن)
│   ├── works-page.js       (منطق works + لود content)
│   └── profile.js          (منطق پروفایل کاربر)
│
├── i18n/
│   ├── fa.json             (فارسی - زبان اصلی)
│   ├── en.json             (انگلیسی)
│   ├── ar.json             (عربی)
│   ├── ru.json             (روسی)
│   ├── de.json             (آلمانی)
│   ├── zh.json             (چینی)
│   ├── fr.json             (فرانسوی)
│   ├── countries-1.json    (کشورهای A-C)
│   ├── countries-2.json    (کشورهای D-I)
│   ├── countries-3.json    (کشورهای J-R)
│   └── countries-4.json    (کشورهای S-Z)
│
├── content/
│   └── works/
│       └── fa.json         (متن آثار - فقط فارسی)
│
├── images/
│   ├── profile/
│   │   └── me.jpg          (عکس پروفایل اصلی)
│   ├── logo/
│   │   ├── portrait.png    (عکس پروفایل - لوگو)
│   │   ├── line.png        (خط امضا)
│   │   └── name.png        (نوشته Ali.Ghaemi)
│   └── works/
│       ├── digital-paintings/  (۱۳ اثر - jpg/jpeg)
│       ├── paintings/          (۶ اثر - jpg)
│       ├── sketch/             (۲ اثر - png/jpg)
│       └── poster/             (۶ پوستر - jpeg)
│
└── scripts/
    └── translate.js        (اسکریپت ترجمه خودکار - نیمه‌کاره)
```

---

## 🗄️ دیتابیس D1 (کامل)

### جدول `users`

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,       -- PBKDF2: salt:hash
  name TEXT NOT NULL,
  phone TEXT,                        -- برای بازیابی رمز
  age INTEGER,
  gender TEXT,                       -- male | female
  role TEXT NOT NULL,                -- artist|student|lover|gallery|buyer|other
  avatar_url TEXT,                   -- base64 یا preset:1-8
  bio TEXT,
  email_verified INTEGER DEFAULT 0,
  recovery_code TEXT,                -- کد ۶ رقمی موقت
  recovery_expires INTEGER,          -- timestamp
  created_at INTEGER DEFAULT (unixepoch())
);
```

### جدول `sessions`

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at INTEGER NOT NULL,       -- ۳۰ روز
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### جدول `email_codes`

```sql
CREATE TABLE email_codes (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  purpose TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
);
```

---

## 🔌 API Endpoints (worker.js)

| Method | Endpoint | توضیح | Body |
|---|---|---|---|
| POST | `/api/signup` | ثبت‌نام | email, password, name, phone, age, gender, role |
| POST | `/api/login` | ورود | email, password |
| POST | `/api/logout` | خروج | (headers: Authorization) |
| GET | `/api/me` | اطلاعات کاربر | (headers: Authorization) |
| POST | `/api/forgot-password` | دریافت کد بازیابی | email, phone |
| POST | `/api/reset-password` | تغییر رمز | email, phone, code, newPassword |
| POST | `/api/update-profile` | ویرایش پروفایل | name, age, gender, role, bio |
| POST | `/api/update-avatar` | تغییر آواتار | avatar_url (base64 یا preset:N) |
| POST | `/api/delete-account` | حذف حساب | password |
| GET | `/api/detect-country` | تشخیص IP | (header: CF-IPCountry) |

**نکته:** همه endpointها CORS headers دارن + `charset=utf-8`.

---

## 🌍 سیستم i18n

### چطوری کار می‌کنه:

1. **`js/i18n.js`** ساخته شده با توابع:
   - `t(key, fallback)` — گرفتن متن
   - `loadLanguage(lang)` — لود زبان
   - `changeLanguage(lang)` — تغییر زبان
   - `applyTranslations()` — اعمال به HTML
   - `getCurrentLang()` — گرفتن زبان فعلی

2. **HTML از `data-i18n` استفاده می‌کنه:**
```html
<div data-i18n="hero.title1">سلام، من علی قائمی هستم.</div>
<input data-i18n-placeholder="auth.email" />
<a data-i18n-title="tooltip.key">...</a>
<button data-i18n-aria="label.key">...</button>
```

3. **ذخیره در localStorage** با کلید `selectedLanguage`.

4. **تغییر RTL/LTR خودکار** با `document.documentElement.dir`.

5. **Event `languageChanged`** برای آپدیت componentها.

### ساختار `i18n/fa.json`:

```json
{
  "site": { "title": "...", "footer": "..." },
  "nav": { "logo", "about", "works", "story", "contact", "login", "signup", "logout", "greeting" },
  "splash": { "bismillah", "poem1", "poem2", "author" },
  "welcome": { "title", "subtitle", "countryLabel", "languageLabel", "searchPlaceholder", "notFound", "selectPlaceholder", "next" },
  "hero": { "tag", "title1", "title2", "desc", "viewWorks", "startCollab" },
  "about": { "num", "title", "p1", "p2", "skillsTitle", "viewMore", "skills", "levels" },
  "works": { "num", "title", "desc", "viewAll", "defaultTitle", "defaultCategory" },
  "worksPage": { "num", "title", "desc", "tabs", "empty", "emptySoon", "backToHome" },
  "contact": { "num", "title", "desc", "letter*", "methods*", "email", "telegram", "instagram", "youtube", "closing*", "backToHome" },
  "aboutPage": { "title", "subtitle", "s1*", "s2*", "s3*", "skillsTitle", "backLink" },
  "auth": { "login*", "signup*", "email", "password", "name", "phone", "age", "gender", "role", "roles", "forgot*", "code", "newPassword", "confirmPassword", "changePassword", "remembered", "error*", "success*" },
  "profile": { "title", "edit*", "avatar*", "info*", "email", "phone", "age", "gender", "role", "joined", "yearsOld", "about*", "bio*", "danger*", "delete*", "settings*", "countryField", "languageField", "saveSettings" },
  "lightbox": { "hint", "copyLink", "copied", "viewInsta", "close", "noStoryboard", "storyboardLabel" },
  "languages": { "fa", "en", "ar", "ru", "de", "zh", "fr" }
}
```

---

## 📚 سیستم محتوای آثار

### `js/works.js` (فقط ساختار):

```javascript
const WORKS = [
  { id: 1, image: "images/works/digital-paintings/1.jpg", category: "digital", year: "۱۴۰۳", tools: "Photoshop", insta: "" },
  // ...
];

function getCategoryLabel(cat, i18n){ ... }
```

### `content/works/fa.json` (فقط متن):

```json
{
  "1": { "title": "نام اثر ۱", "desc": "توضیحات..." },
  "3": { "title": "نام اثر ۳", "desc": "..." }
}
```

### چطوری اثر جدید اضافه کنی:

1. **عکس** رو بذار تو `images/works/[category]/`
2. **`js/works.js`** یه بلوک اضافه کن:
```javascript
{ id: 40, image: "images/works/digital-paintings/40.jpg", category: "digital", year: "۱۴۰۴", tools: "Photoshop", insta: "" }
```
3. **`content/works/fa.json`** اضافه کن:
```json
"40": { "title": "اسم اثر", "desc": "توضیحات" }
```
4. **آپلود** با git push.

---

**پایان بخش ۲**
# 📋 BACKUP — پروژه alighaemi.art
# بخش ۳: کارها، دستورات، راهنما

---

## ✅ کارهای انجام شده (کامل)

### زیرساخت:
- ✅ دامنه alighaemi.art ثبت شد (Iran Server)
- ✅ مخزن GitHub ساخته شد
- ✅ Cloudflare Workers راه‌اندازی شد
- ✅ D1 Database با ۳ جدول
- ✅ اتصال GitHub ↔ Cloudflare (آپدیت خودکار)
- ✅ SSL/HTTPS فعال

### طراحی:
- ✅ پالت رنگ دارک (قرمز شرابی + طلایی)
- ✅ فونت Vazirmatn + Allura
- ✅ Splash سینمایی با بیت فردوسی + امضا انیمیشن
- ✅ نقشه جهان SVG (به جای لوگو)
- ✅ منوی همبرگری موبایل
- ✅ لینک فعال هوشمند
- ✅ انیمیشن‌های scroll (reveal)

### صفحات:
- ✅ `welcome.html` — انتخاب زبان/کشور + نقشه
- ✅ `index.html` — صفحه اصلی + splash + hero + about + gallery
- ✅ `about.html` — داستان من + ۸ مهارت
- ✅ `contact.html` — نامه دعوت + ۴ راه تماس
- ✅ `works.html` — گالری ۵ تب
- ✅ `profile.html` — پروفایل کاربر

### سیستم‌ها:
- ✅ i18n (۷ زبان)
- ✅ Auth (ثبت‌نام + ورود + بازیابی رمز)
- ✅ Profile (ویرایش + آواتار + حذف)
- ✅ Gallery (لود از content + lightbox)
- ✅ Countries (۲۰۵ کشور با سرچ)
- ✅ IP Detection (CF-IPCountry)

### محتوا:
- ✅ ۲۱ اثر اصلی (۱۳ دیجیتال + ۶ سنتی + ۲ اسکچ)
- ✅ ۶ پوستر
- ✅ عکس پروفایل + لوگو

---

## ⏳ کارهای باقی‌مانده

### 🔴 فوری (این هفته):
1. **رفع lang switcher تو RTL/LTR موبایل**
   - الان تو LTR از کادر بیرون میزنه
   - راه‌حل: `html[dir="rtl"]` و `html[dir="ltr"]`
2. **آپدیت `about.html` با i18n کامل**
   - متن‌ها با `data-i18n`
3. **آپدیت `contact.html` با i18n کامل**
   - نامه + راه‌های تماس
4. **آپدیت `profile.html` با i18n**
   - همه متن‌ها
5. **اضافه کردن تنظیمات زبان به profile**
   - کاربر بتونه زبانش رو عوض کنه
6. **پر کردن اطلاعات واقعی ۲۱ اثر**
   - فعلاً placeholder هستن

### 🟡 میان‌مدت:
7. **اسکریپت ترجمه خودکار**
   - Google Translate با rate limit
   - یا Cloudflare AI
8. **ترجمه محتوا به ۶ زبان**
   - `content/works/en.json`, etc
9. **بخش NFT با OpenSea**
   - کارت NFT + لینک OpenSea
10. **بلاگ / مقالات**
    - صفحه + ساختار
11. **بخش ویدئو YouTube**
    - امبد یا لینک
12. **صفحه نظرات و انتقادات**
    - با Formspree یا Web3Forms
13. **موشن گرافیک GSAP**
    - انیمیشن‌های پیشرفته

### 🟢 بلندمدت:
14. **پورتال هنرمندان**
    - ثبت‌نام هنرمند + آپلود آثار
15. **فروشگاه آثار**
    - درگاه پرداخت ایرانی

---

## 📤 دستورات پرکاربرد

### آپلود تغییرات به GitHub:

```bash
cd ~/Desktop/ali-portfolio
git add .
git commit -m "توضیح تغییر"
git push origin main
```

**⚠️ نکته:**
- هیچ‌وقت `--force` نزن (مگر ضروری)
- بعد از push، ۳۰-۶۰ ثانیه صبر کن → Cloudflare خودکار آپدیت می‌کنه

### اگه Cloudflare webhook trigger نشد:

```bash
cd ~/Desktop/ali-portfolio
touch trigger.txt
git add .
git commit -m "Trigger rebuild"
git push origin main
```

### سرور محلی (برای تست):

```bash
cd ~/Desktop/ali-portfolio
python3 -m http.server 8000
```

برو به: `http://localhost:8000/welcome.html`

### پاک کردن کش مرورگر:
- macOS Safari/Chrome: `Cmd + Shift + R`
- حالت Private: `Cmd + Shift + N`

### نصب Node.js dependencies (اگه package.json عوض شد):

```bash
cd ~/Desktop/ali-portfolio
npm install
```

---

## ⚠️ مشکلات شناخته‌شده + راه‌حل

| مشکل | علت | راه‌حل |
|---|---|---|
| **Cloudflare Git خراب** | مشکل داخلی Cloudflare | Disconnect + Reconnect در Settings |
| **force push webhook نمی‌زنه** | Cloudflare فقط commit جدید رو می‌بینه | فایل trigger.txt بساز و push کن |
| **Google Translate rate limit** | IP محدود شده | ۱۵ دقیقه صبر یا ترجمه دستی |
| **fetch با file:// کار نمی‌کنه** | CORS restriction | از سرور محلی استفاده کن |
| **lang switcher از کادر بیرون میزنه** | RTL/LTR تداخل | `html[dir="rtl"]` و `html[dir="ltr"]` |
| **عکس‌های حجیم آپلود نمیشن** | GitHub UI محدودیت | از git CLI استفاده کن |

---

## 🎯 راهنمای شروع چت جدید

### پیام ۱ (اول اینو بفرست):

```
سلام داداش! این سند کامل پروژه‌ی منه.
می‌خوام ادامه بدیم.

لطفاً لحن صادقانه و صمیمی داشته باش.
قدم به قدم راهنمایی کن.
کد کامل بده با محل دقیق پیست.

[اینجا سند BACKUP رو پیست کن]
```

### پیام ۲ (بعدش اینو):

```
قبلاً این کارا رو کردیم: [لیست]
الان می‌خوام این کار رو بکنیم: [مشکل جدید]
عکس ضمیمه: [عکس مشکل]
```

---

## 📞 راه‌های تماس

- **ایمیل:** alighaemi315@gmail.com
- **اینستاگرام:** iamalighaemi
- **تلگرام:** AliGhaemi1384
- **YouTube:** @iliya.informal

---

## 🎨 فلسفه طراحی

- **مینیمال، دارک، هنری**
- فضای منفی زیاد
- انیمیشن‌های ملایم (نه شلوغ)
- تمرکز روی آثار هنری
- حس گالری حرفه‌ای

**الهام‌بخش:** Sotheby's, Saatchi Art, هنرمندان top 1% بین‌المللی

---

## 📚 تاریخچه تصمیمات مهم

| تصمیم | چرا |
|---|---|
| Cloudflare (نه Vercel/Netlify) | از ایران بدون VPN کار می‌کنه |
| D1 (نه Supabase) | رایگان + داخل Cloudflare |
| ۷ زبان (نه کمتر) | بین‌المللی بودن |
| صفحه Welcome جدا | تشخیص خودکار زبان |
| content/ جدا از works.js | مدیریت آسون‌تر |
| i18n با data-* attribute | استاندارد صنعتی |
| نقشه جهان (نه لوگو) | حس جهانی |
| Splash سینمایی | تجربه حرفه‌ای |

---

## 🎯 نکات طلایی

1. **هر بار تغییر دادی → git push**
2. **بعد از push → ۳۰ ثانیه صبر**
3. **مشکل جدید → عکس بگیر**
4. **چت جدید → BACKUP پیست کن**
5. **Cloudflare مشکل داشت → Disconnect + Reconnect**
6. **لامپ Cloudflare تو صفحه Deployments → آخرین وضعیت**

---

## 💬 لحن کار با AI

- **صمیمی:** «داداش»، «عشقم»
- **قدم به قدم:** هر مرحله جدا
- **کد کامل:** آماده کپی-پیست
- **محل دقیق:** «تو فایل X، خط Y، این رو پیست کن»
- **عکس‌گرفتن:** برای دیباگ
- **هیچ‌وقت «نمیشه»:** راه‌حل جایگزین

---

## ✅ چک‌لیست شروع کار جدید

- [ ] سند BACKUP رو به AI بده
- [ ] بگو مشکل چیه یا چی می‌خوای
- [ ] عکس مشکل رو بگیر و ضمیمه کن
- [ ] صبر کن AI راهنمایی کنه
- [ ] تغییرات رو تو VS Code بزن
- [ ] git push کن
- [ ] ۳۰ ثانیه صبر کن
- [ ] سایت رو رفرش کن و تست کن

---

## 🎉 نتیجه

**این سند شامل:**
- ✅ همه اطلاعات فنی
- ✅ همه دستورات پرکاربرد
- ✅ همه مشکلات و راه‌حل
- ✅ همه تصمیمات مهم
- ✅ راهنمای کامل شروع

**هیچ چیزی گم نمیشه.** 💪

---

**آخرین آپدیت:** ۲۷ سپتامبر ۲۰۲۵

**پایان بخش ۳**