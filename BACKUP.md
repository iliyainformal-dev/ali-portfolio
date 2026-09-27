# 📋 BACKUP — پروژه alighaemi.art

> این فایل سند کامل پروژه‌ی علی قائمی هست.
> برای شروع چت جدید، این فایل رو به AI بدی تا بفهمه کجاییم.

---

## 🌐 اطلاعات اصلی

| مورد | مقدار |
|---|---|
| دامنه | `alighaemi.art` |
| GitHub | `github.com/iliyainformal-dev/ali-portfolio` |
| D1 Database | `ali-portfolio-db` |
| Database ID | `8b1cd83b-3e47-4ba0-8919-807c8c271d3c` |
| ایمیل | `alighaemi315@gmail.com` |
| اینستاگرام | `iamalighaemi` |
| تلگرام | `AliGhaemi1384` |
| YouTube | `@iliya.informal` |
| تاریخ انقضای دامنه | Sep 21, 2027 |

---

## 🎨 پالت رنگ

```
--bg:        #0a0a0f
--bg-2:      #13131a
--card:      #1a1a22
--line:      #26262e
--text:      #ededf2
--muted:     #8a8a95
--accent:    #e63946   (قرمز شرابی)
--accent-2:  #d4a574   (طلایی مات)
--purple:    #7b2cbf
--radius:    16px
```

**فونت‌ها:** Vazirmatn (اصلی) + Allura (امضا)

---

## 📁 ساختار فایل‌ها

```
ali-portfolio/
├── index.html              (صفحه اصلی + splash)
├── welcome.html            (انتخاب زبان/کشور)
├── about.html              (داستان من)
├── contact.html            (شروع همکاری)
├── works.html              (گالری کامل)
├── profile.html            (پروفایل کاربر)
├── worker.js               (API احراز هویت)
├── wrangler.toml
├── package.json
├── BACKUP.md               (همین فایل)
│
├── css/
│   ├── style.css
│   └── welcome.css
│
├── js/
│   ├── i18n.js             (سیستم چندزبانه)
│   ├── main.js             (اسکریپت اصلی + splash + lightbox)
│   ├── welcome.js          (منطق Welcome + نقشه)
│   ├── works.js            (ساختار آثار)
│   ├── works-page.js       (منطق works)
│   └── profile.js          (منطق پروفایل)
│
├── i18n/
│   ├── fa.json  en.json  ar.json  ru.json  de.json  zh.json  fr.json
│   └── countries-1.json ... countries-4.json
│
├── content/works/
│   └── fa.json             (متن آثار - فارسی)
│
├── images/
│   ├── profile/me.jpg
│   ├── logo/ (portrait.png, line.png, name.png)
│   └── works/ (digital-paintings, paintings, sketch, poster)
│
└── scripts/
    └── translate.js
```

---

## 🗄️ دیتابیس D1

**جدول `users`:**
- id, email, password_hash, name, phone, age, gender, role,
  avatar_url, bio, email_verified, recovery_code, recovery_expires, created_at

**جدول `sessions`:** id, user_id, token, expires_at, created_at

**جدول `email_codes`:** id, email, code, purpose, expires_at, created_at

---

## 🔌 API Endpoints

```
POST /api/signup             → ثبت‌نام
POST /api/login              → ورود
POST /api/logout             → خروج
GET  /api/me                 → اطلاعات کاربر
POST /api/forgot-password    → دریافت کد بازیابی
POST /api/reset-password     → تغییر رمز
POST /api/update-profile     → ویرایش پروفایل
POST /api/update-avatar      → تغییر آواتار
POST /api/delete-account     → حذف حساب
GET  /api/detect-country     → تشخیص IP
```

---

## ✅ کارهای انجام شده

- ✅ دامنه alighaemi.art با SSL
- ✅ سیستم i18n با ۷ زبان
- ✅ صفحه Welcome با نقشه جهان + انتخاب کشور
- ✅ تشخیص IP خودکار (CF-IPCountry)
- ✅ ورود / ثبت‌نام / بازیابی رمز
- ✅ پروفایل کاربر (ویرایش + آواتار + حذف)
- ✅ گالری ۵ دسته + لایت‌باکس + موشن آرت
- ✅ Splash سینمایی (فردوسی + امضا)
- ✅ منوی همبرگری + تغییر زبان
- ✅ آپدیت خودکار GitHub → Cloudflare
- ✅ ۲۱ اثر + ۶ پوستر

---

## ⏳ کارهای باقی‌مانده

### فوری:
1. رفع lang switcher تو RTL/LTR موبایل
2. آپدیت `about.html` با i18n
3. آپدیت `contact.html` با i18n
4. آپدیت `profile.html` با i18n
5. اضافه کردن تنظیمات زبان به profile
6. پر کردن اطلاعات واقعی ۲۱ اثر

### میان‌مدت:
7. اسکریپت ترجمه خودکار (rate limit داره)
8. ترجمه محتوا به ۶ زبان
9. بخش NFT با OpenSea
10. بلاگ / مقالات
11. بخش ویدئو YouTube
12. صفحه نظرات
13. موشن GSAP

### بلندمدت:
14. پورتال هنرمندان
15. فروشگاه آثار

---

## 📤 دستورات پرکاربرد

### آپلود تغییرات:
```bash
cd ~/Desktop/ali-portfolio
git add .
git commit -m "توضیح تغییر"
git push origin main
```
→ ۳۰-۶۰ ثانیه بعد Cloudflare خودکار آپدیت می‌کنه

### سرور محلی:
```bash
cd ~/Desktop/ali-portfolio
python3 -m http.server 8000
```
→ http://localhost:8000/welcome.html

### اگه webhook trigger نشد:
```bash
touch trigger.txt
git add . && git commit -m "Trigger" && git push origin main
```

---

## ⚠️ مشکلات شناخته‌شده

| مشکل | راه‌حل |
|---|---|
| Cloudflare Git خراب | Disconnect + Reconnect |
| force push webhook نمی‌زنه | فایل trigger.txt بساز |
| Google Translate rate limit | ترجمه دستی AI |
| fetch با file:// کار نمی‌کنه | از سرور محلی استفاده کن |

---

## 🎯 نحوه کار با AI

**لحن:** صمیمی، داداش‌گونه، حرفه‌ای
**روش:** قدم به قدم، کد کامل، محل دقیق پیست
**قانون:** هیچ‌وقت «نمیشه» نگو، راه‌حل جایگزین بده
**عکس:** برای دیباگ عکس بگیر

---

## 💬 نمونه پیام برای شروع چت جدید

```
سلام داداش! این سند کامل پروژه‌ی منه: alighaemi.art
با AI قبلی این رو ساختیم. الان می‌خوام [چی می‌خوام] رو انجام بدیم.
لطفاً لحن صمیمی داشته باش و قدم به قدم راهنمایی کن.
```

---

**آخرین آپدیت:** ۲۷ سپتامبر ۲۰۲۵