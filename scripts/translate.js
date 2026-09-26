/* ═══════════════════════════════════════════
   🌍 اسکریپت ترجمه خودکار سایت
   از i18n/fa.json می‌خونه و ۶ زبان می‌سازه
   ═══════════════════════════════════════════ */
import { translate } from '@vitalets/google-translate-api';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const I18N_DIR = path.join(__dirname, '..', 'i18n');

const SOURCE_LANG = 'fa';
const TARGET_LANGS = ['en', 'ar', 'ru', 'de', 'zh', 'fr'];

const LANG_NAMES = {
  en: 'انگلیسی',
  ar: 'عربی',
  ru: 'روسی',
  de: 'آلمانی',
  zh: 'چینی',
  fr: 'فرانسوی'
};

/* ─── ترجمه با retry ─── */
async function translateWithRetry(text, targetLang, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await translate(text, { from: SOURCE_LANG, to: targetLang });
      await new Promise(r => setTimeout(r, 1500));
      return result.text;
    } catch (err) {
      const isRateLimit = err.message && err.message.includes('Too Many Requests');
      if (isRateLimit && attempt < maxRetries) {
        const waitTime = attempt * 3000;
        console.log(`   ⏳ محدودیت سرعت، صبر ${waitTime/1000}s (${attempt}/${maxRetries})...`);
        await new Promise(r => setTimeout(r, waitTime));
      } else {
        throw err;
      }
    }
  }
}

/* ─── ترجمه بازگشتی ─── */
async function translateValue(value, targetLang) {
  if (typeof value === 'string') {
    if (!value.trim()) return value;
    try {
      return await translateWithRetry(value, targetLang);
    } catch (err) {
      console.error(`   ❌ خطا: "${value}" → ${targetLang}: ${err.message}`);
      return value;
    }
  }
  
  if (Array.isArray(value)) {
    const arr = [];
    for (const item of value) {
      arr.push(await translateValue(item, targetLang));
    }
    return arr;
  }
  
  if (value && typeof value === 'object') {
    const obj = {};
    for (const [key, val] of Object.entries(value)) {
      obj[key] = await translateValue(val, targetLang);
    }
    return obj;
  }
  
  return value;
}

/* ─── تابع اصلی ─── */
async function main() {
  console.log('🌍 شروع ترجمه خودکار...\n');
  
  const faPath = path.join(I18N_DIR, `${SOURCE_LANG}.json`);
  
  let faContent;
  try {
    faContent = await fs.readFile(faPath, 'utf-8');
  } catch (err) {
    console.error(`❌ فایل ${faPath} پیدا نشد!`);
    process.exit(1);
  }
  
  const faData = JSON.parse(faContent);
  console.log(`📖 فایل fa.json خونده شد`);
  console.log(`🌐 ترجمه به ${TARGET_LANGS.length} زبان\n`);
  
  for (const lang of TARGET_LANGS) {
    console.log(`🔄 در حال ترجمه به ${LANG_NAMES[lang]} (${lang})...`);
    const startTime = Date.now();
    
    const translated = await translateValue(faData, lang);
    
    const outPath = path.join(I18N_DIR, `${lang}.json`);
    await fs.writeFile(outPath, JSON.stringify(translated, null, 2), 'utf-8');
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`   ✅ ${lang}.json ساخته شد (${duration}s)\n`);
  }
  
  console.log('🎉 تمام! همه فایل‌های ترجمه ساخته شدن.');
}

main().catch(err => {
  console.error('❌ خطای کلی:', err);
  process.exit(1);
});