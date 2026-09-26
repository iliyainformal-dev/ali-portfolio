/* ═══════════════════════════════════════════
   🌍 سیستم چندزبانه (i18n)
   ═══════════════════════════════════════════ */

const SUPPORTED_LANGS = ['fa', 'en', 'ar', 'ru', 'de', 'zh', 'fr'];
const RTL_LANGS = ['fa', 'ar'];
const DEFAULT_LANG = 'en';

let currentLang = DEFAULT_LANG;
let translations = {};

/* ─── لود زبان ─── */
async function loadLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) {
    lang = DEFAULT_LANG;
  }
  
  try {
    const res = await fetch(`i18n/${lang}.json`);
    if (!res.ok) throw new Error('Not found');
    translations = await res.json();
    currentLang = lang;
    
    localStorage.setItem('selectedLanguage', lang);
    
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';
    
    applyTranslations();
    
    document.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { lang } 
    }));
    
    return true;
  } catch (err) {
    console.error(`خطا در لود ${lang}.json:`, err);
    if (lang !== DEFAULT_LANG) {
      return loadLanguage(DEFAULT_LANG);
    }
    return false;
  }
}

/* ─── گرفتن یه متن ─── */
function t(key, fallback = '') {
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return fallback || key;
    }
  }
  
  return value || fallback || key;
}

/* ─── اعمال ترجمه به HTML ─── */
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const translation = t(key);
    
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = translation;
    } else if (el.tagName === 'BUTTON') {
      const span = el.querySelector('span:not([data-i18n])');
      if (span) {
        span.textContent = translation;
      } else {
        el.textContent = translation;
      }
    } else {
      el.innerHTML = translation;
    }
  });
  
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
  
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
}

/* ─── تغییر زبان ─── */
async function changeLanguage(lang) {
  if (lang === currentLang) return true;
  return await loadLanguage(lang);
}

/* ─── گرفتن زبان فعلی ─── */
function getCurrentLang() {
  return currentLang;
}

/* ─── شروع خودکار ─── */
document.addEventListener('DOMContentLoaded', async () => {
  const saved = localStorage.getItem('selectedLanguage');
  const lang = saved && SUPPORTED_LANGS.includes(saved) ? saved : DEFAULT_LANG;
  await loadLanguage(lang);
});

/* ─── دسترسی از بیرون ─── */
window.i18n = {
  t,
  changeLanguage,
  getCurrentLang,
  loadLanguage,
  supportedLangs: SUPPORTED_LANGS
};
/* ═══════════════════════════════════════════
   🌍 Language Switcher (دکمه تغییر زبان)
   ═══════════════════════════════════════════ */
const LANG_FLAGS = {
  fa: '🇮🇷', en: '🇬🇧', ar: '🇸🇦',
  ru: '🇷🇺', de: '🇩🇪', zh: '🇨🇳', fr: '🇫🇷'
};

const LANG_CODES = {
  fa: 'FA', en: 'EN', ar: 'AR',
  ru: 'RU', de: 'DE', zh: 'ZH', fr: 'FR'
};

function initLangSwitcher(){
  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');
  const langFlag = document.getElementById('langFlag');
  const langCode = document.getElementById('langCode');
  
  if(!langBtn || !langDropdown) return;
  
  function updateSwitcher(lang){
    if(langFlag) langFlag.textContent = LANG_FLAGS[lang] || '🌍';
    if(langCode) langCode.textContent = LANG_CODES[lang] || lang.toUpperCase();
    
    langDropdown.querySelectorAll('button').forEach(btn=>{
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }
  
  langBtn.addEventListener('click', (e)=>{
    e.stopPropagation();
    langDropdown.classList.toggle('open');
  });
  
  langDropdown.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const lang = btn.dataset.lang;
      await changeLanguage(lang);
      langDropdown.classList.remove('open');
      updateSwitcher(lang);
    });
  });
  
  document.addEventListener('click', ()=>{
    langDropdown.classList.remove('open');
  });
  
  document.addEventListener('languageChanged', (e)=>{
    updateSwitcher(e.detail.lang);
  });
  
  updateSwitcher(getCurrentLang());
}

document.addEventListener('DOMContentLoaded', initLangSwitcher);