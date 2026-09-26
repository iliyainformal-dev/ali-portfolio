/* ═══════════════════════════════════════════
   🌍 منطق صفحه انتخاب زبان
   ═══════════════════════════════════════════ */

// نقشه زبان‌ها به کشور (برای پیشنهاد)
const LANG_BY_COUNTRY = {
  IR: 'fa', AF: 'fa', TJ: 'fa',
  SA: 'ar', AE: 'ar', EG: 'ar', DZ: 'ar', MA: 'ar',
  IQ: 'ar', JO: 'ar', KW: 'ar', LB: 'ar', LY: 'ar',
  OM: 'ar', PS: 'ar', QA: 'ar', SD: 'ar', SY: 'ar',
  TN: 'ar', YE: 'ar', BH: 'ar',
  RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru',
  DE: 'de', AT: 'de', CH: 'de', LI: 'de', LU: 'de',
  CN: 'zh', TW: 'zh', HK: 'zh', MO: 'zh', SG: 'zh',
  FR: 'fr', BE: 'fr', MC: 'fr', SN: 'fr', CI: 'fr',
  CA: 'en', US: 'en', GB: 'en', AU: 'en', NZ: 'en',
  IE: 'en', ZA: 'en', IN: 'en', PK: 'en', NG: 'en'
};

// پرچم‌ها
const FLAGS = {
  IR:'🇮🇷',US:'🇺🇸',GB:'🇬🇧',DE:'🇩🇪',FR:'🇫🇷',RU:'🇷🇺',CN:'🇨🇳',JP:'🇯🇵',KR:'🇰🇷',
  SA:'🇸🇦',AE:'🇦🇪',EG:'🇪🇬',IQ:'🇮🇶',TR:'🇹🇷',IN:'🇮🇳',PK:'🇵🇰',CA:'🇨🇦',AU:'🇦🇺',
  NZ:'🇳🇿',IT:'🇮🇹',ES:'🇪🇸',NL:'🇳🇱',BE:'🇧🇪',CH:'🇨🇭',AT:'🇦🇹',SE:'🇸🇪',NO:'🇳🇴',
  DK:'🇩🇰',FI:'🇫🇮',PL:'🇵🇱',PT:'🇵🇹',GR:'🇬🇷',IE:'🇮🇪',IL:'🇮🇱',AR:'🇦🇷',BR:'🇧🇷',
  MX:'🇲🇽',ZA:'🇿🇦',NG:'🇳🇬',KE:'🇰🇪',MA:'🇲🇦',DZ:'🇩🇿',TN:'🇹🇳',LY:'🇱🇾',SD:'🇸🇩',
  JO:'🇯🇴',LB:'🇱🇧',SY:'🇸🇾',YE:'🇾🇪',OM:'🇴🇲',QA:'🇶🇦',KW:'🇰🇼',BH:'🇧🇭',PS:'🇵🇸',
  AF:'🇦🇫',TJ:'🇹🇯',UZ:'🇺🇿',KZ:'🇰🇿',TM:'🇹🇲',KG:'🇰🇬',AZ:'🇦🇿',AM:'🇦🇲',GE:'🇬🇪',
  UA:'🇺🇦',BY:'🇧🇾',ID:'🇮🇩',MY:'🇲🇾',TH:'🇹🇭',VN:'🇻🇳',PH:'🇵🇭',HK:'🇭🇰',TW:'🇨🇳'
};

// پیام‌های چند زبانه
const GREETINGS = {
  fa:'خوش آمدید', en:'Welcome', ar:'أهلاً وسهلاً',
  ru:'Добро пожаловать', de:'Willkommen', zh:'欢迎', fr:'Bienvenue'
};
const TITLES = { ...GREETINGS };
const SUBTITLES = {
  fa:'کشور و زبان خود را انتخاب کنید',
  en:'Choose your country and language',
  ar:'اختر بلدك ولغتك',
  ru:'Выберите страну и язык',
  de:'Wählen Sie Land und Sprache',
  zh:'选择您的国家和语言',
  fr:'Choisissez votre pays et langue'
};
const NEXT_TEXTS = {
  fa:'بعدی', en:'Next', ar:'التالي',
  ru:'Далее', de:'Weiter', zh:'下一步', fr:'Suivant'
};
const COUNTRY_LABELS = {
  fa:'کشور شما', en:'Your Country', ar:'بلدك',
  ru:'Ваша страна', de:'Ihr Land', zh:'您的国家', fr:'Votre pays'
};
const LANGUAGE_LABELS = {
  fa:'زبان شما', en:'Your Language', ar:'لغتك',
  ru:'Ваш язык', de:'Ihre Sprache', zh:'您的语言', fr:'Votre langue'
};
const SEARCH_PLACEHOLDERS = {
  fa:'جستجوی کشور...', en:'Search country...', ar:'ابحث عن بلد...',
  ru:'Поиск страны...', de:'Land suchen...', zh:'搜索国家...', fr:'Rechercher un pays...'
};
const SELECT_TEXTS = {
  fa:'— انتخاب کنید —', en:'— Select —', ar:'— اختر —',
  ru:'— Выберите —', de:'— Auswählen —', zh:'— 选择 —', fr:'— Sélectionner —'
};

// وضعیت
let COUNTRIES = {};
let selectedCountry = null;
let selectedLanguage = 'en';

/* ─── شروع ─── */
document.addEventListener('DOMContentLoaded', async () => {
  createStars();
  loadWorldMap();
  COUNTRIES = await loadCountries();
  renderCountryList();
  setupEvents();
  await detectCountry();
});

/* ─── ستاره‌ها ─── */
function createStars(){
  const container = document.getElementById('stars');
  if(!container) return;
  for(let i = 0; i < 60; i++){
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.opacity = Math.random() * 0.5 + 0.2;
    container.appendChild(star);
  }
}

/* ─── لود کشورها ─── */
async function loadCountries(){
  try {
    const [c1, c2, c3, c4] = await Promise.all([
      fetch('i18n/countries-1.json').then(r => r.json()),
      fetch('i18n/countries-2.json').then(r => r.json()),
      fetch('i18n/countries-3.json').then(r => r.json()),
      fetch('i18n/countries-4.json').then(r => r.json())
    ]);
    return { ...c1, ...c2, ...c3, ...c4 };
  } catch(err){
    console.error('خطا در لود کشورها:', err);
    return {};
  }
}

/* ─── رندر لیست کشورها ─── */
function renderCountryList(filter = ''){
  const list = document.getElementById('countryList');
  if(!list) return;
  
  const search = filter.trim().toLowerCase();
  
  // مرتب‌سازی الفبایی
  const sorted = Object.entries(COUNTRIES).sort((a, b) => 
    a[1].localeCompare(b[1])
  );
  
  // فیلتر
  const filtered = sorted.filter(([code, name]) => {
    if(!search) return true;
    const flag = FLAGS[code] || '';
    if(code === 'IR'){
      return name.toLowerCase().includes(search) || 'ایران'.includes(search);
    }
    return name.toLowerCase().includes(search) || flag.includes(search);
  });
  
  if(filtered.length === 0){
    list.innerHTML = `<div class="country-empty">کشوری پیدا نشد</div>`;
    return;
  }
  
  list.innerHTML = filtered.map(([code, name]) => {
    const flag = FLAGS[code] || '🌍';
    const isSelected = selectedCountry === code;
    const displayName = (code === 'IR') ? `ایران — Iran` : name;
    return `
      <div class="country-item ${isSelected ? 'selected' : ''}" data-code="${code}">
        <span class="c-flag">${flag}</span>
        <span class="c-name">${displayName}</span>
        <span class="c-check">✓</span>
      </div>
    `;
  }).join('');
  
  // کلیک روی هر کشور
  list.querySelectorAll('.country-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    selectCountry(item.dataset.code);
  });
});
}

/* ─── انتخاب کشور ─── */
function selectCountry(code){
  selectedCountry = code;
  const countryName = COUNTRIES[code];
  const flag = FLAGS[code] || '🌍';
  
  // آپدیت دکمه
  const btnText = document.getElementById('selectedCountryText');
  if(btnText){
    btnText.textContent = `${flag} ${code === 'IR' ? 'ایران — Iran' : countryName}`;
  }
  
  // پیشنهاد زبان
  const suggestedLang = LANG_BY_COUNTRY[code] || 'en';
  selectedLanguage = suggestedLang;
  document.getElementById('languageSelect').value = suggestedLang;
  
  updateTexts(suggestedLang);
    // Highlight کردن کشور روی نقشه
  if(typeof highlightCountry === 'function'){
    highlightCountry(code);
  }
  
  
  // بستن dropdown
  document.getElementById('countryDropdown').classList.remove('open');
  document.getElementById('dropdownBackdrop').classList.remove('show');
  
  // آپدیت لیست (برای نمایش ✓)
  renderCountryList(document.getElementById('countrySearch').value);
}

/* ─── Event Listeners ─── */
function setupEvents(){
  const search = document.getElementById('countrySearch');
  const toggle = document.getElementById('countryToggle');
  const dropdown = document.getElementById('countryDropdown');
  const languageSelect = document.getElementById('languageSelect');
  const nextBtn = document.getElementById('nextBtn');
  
  // باز/بسته کردن dropdown
  toggle?.addEventListener('click', () => {
  const isOpen = dropdown.classList.toggle('open');
  document.getElementById('dropdownBackdrop').classList.toggle('show', isOpen);
  if(isOpen){
    setTimeout(() => search.focus(), 100);
  }
});
  
  // سرچ
  search?.addEventListener('input', (e) => {
    renderCountryList(e.target.value);
  });
  
  // بستن با کلیک بیرون
  document.addEventListener('click', (e) => {
  if(!e.target.closest('.country-picker')){
    dropdown?.classList.remove('open');
    document.getElementById('dropdownBackdrop')?.classList.remove('show');
  }
});
  
  // تغییر زبان
  languageSelect?.addEventListener('change', (e) => {
    selectedLanguage = e.target.value;
    updateTexts(e.target.value);
  });
  
  // دکمه Next
  nextBtn?.addEventListener('click', () => {
    if(!selectedCountry){
      alert('لطفاً کشور خود را انتخاب کنید');
      return;
    }
    
    localStorage.setItem('selectedLanguage', selectedLanguage);
    localStorage.setItem('selectedCountry', selectedCountry);
    
    sessionStorage.setItem('fromWelcome', '1');
window.location.href = 'index.html';
  });
}

/* ─── آپدیت متن‌ها ─── */
function updateTexts(lang){
  const greeting = document.getElementById('greeting');
  const mainTitle = document.getElementById('mainTitle');
  const subTitle = document.getElementById('subTitle');
  const countryLabel = document.getElementById('countryLabel');
  const languageLabel = document.getElementById('languageLabel');
  const nextBtnText = document.getElementById('nextBtnText');
  const search = document.getElementById('countrySearch');
  
  if(greeting) greeting.classList.add('changing');
  
  setTimeout(() => {
    if(greeting) greeting.textContent = GREETINGS[lang] || GREETINGS.en;
    if(mainTitle) mainTitle.textContent = TITLES[lang] || TITLES.en;
    if(subTitle) subTitle.textContent = SUBTITLES[lang] || SUBTITLES.en;
    if(countryLabel) countryLabel.textContent = COUNTRY_LABELS[lang] || COUNTRY_LABELS.en;
    if(languageLabel) languageLabel.textContent = LANGUAGE_LABELS[lang] || LANGUAGE_LABELS.en;
    if(nextBtnText) nextBtnText.textContent = NEXT_TEXTS[lang] || NEXT_TEXTS.en;
    if(search) search.placeholder = SEARCH_PLACEHOLDERS[lang] || SEARCH_PLACEHOLDERS.en;
    
    // دکمه انتخاب کشور
    if(!selectedCountry){
      const btnText = document.getElementById('selectedCountryText');
      if(btnText) btnText.textContent = SELECT_TEXTS[lang] || SELECT_TEXTS.en;
    }
    
    // RTL/LTR
    document.documentElement.dir = (lang === 'fa' || lang === 'ar') ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    if(greeting) greeting.classList.remove('changing');
  }, 200);
}

/* ─── تشخیص IP ─── */
async function detectCountry(){
  try {
    const saved = localStorage.getItem('selectedCountry');
    const savedLang = localStorage.getItem('selectedLanguage');
    
    if(saved && savedLang){
      selectCountry(saved);
      return;
    }
    
    const res = await fetch('/api/detect-country');
    const data = await res.json();
    
    if(data.country && COUNTRIES[data.country]){
      selectCountry(data.country);
    } else {
      updateTexts('en');
    }
  } catch(err){
    console.warn('IP detection failed:', err);
    updateTexts('en');
  }
}
/* ═══════════════════════════════════════════
   🗺️ لود کردن نقشه جهان
   ═══════════════════════════════════════════ */
async function loadWorldMap(){
  const wrap = document.getElementById('worldMapWrap');
  if(!wrap) return;
  
  try {
    const res = await fetch('https://cdn.jsdelivr.net/npm/@svg-maps/world@1.0.1/world.svg');
    if(!res.ok) throw new Error('Map not found');
    
    const svgText = await res.text();
    
    // جایگزینی placeholder با SVG
    wrap.innerHTML = svgText;
    
    // تنظیمات SVG
    const svg = wrap.querySelector('svg');
    if(svg){
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.setAttribute('viewBox', svg.getAttribute('viewBox') || '0 0 2000 1000');
    }
    
    // اگه کشور از قبل انتخاب شده، highlight کن
    if(selectedCountry){
      highlightCountry(selectedCountry);
    }
    
    console.log('✅ نقشه جهان لود شد');
  } catch(err){
    console.warn('⚠️ نقشه لود نشد:', err);
    // placeholder می‌مونه
  }
}

/* ─── Highlight کشور انتخابی ─── */
function highlightCountry(code){
  const wrap = document.getElementById('worldMapWrap');
  if(!wrap) return;
  
  const paths = wrap.querySelectorAll('svg path');
  let found = false;
  
  paths.forEach(p => {
    const id = p.id || p.getAttribute('data-id') || p.getAttribute('data-code');
    const match = id && (id === code || id === code.toUpperCase() || id === code.toLowerCase());
    
    p.classList.toggle('highlighted', match);
    if(match) found = true;
  });
  
  if(!found){
    console.warn(`⚠️ کشور ${code} توی نقشه پیدا نشد`);
  }
}