/* ═══════════════════════════════════════════
   🎬 WELCOME v2 — Cinematic Scroll
   ═══════════════════════════════════════════ */

/* ═══════════════════════════════════════════
   ⚙️ CONFIG — همه چیز از اینجا قابل تنظیمه
   ═══════════════════════════════════════════ */
const WELCOME_CONFIG = {
  particles: {
    enabled: true,
    count: 45,                // تعداد ذرات (کمتر = سبک‌تر)
    color: '#d4a574',         // رنگ طلایی
    sizeMin: 1,
    sizeMax: 2.5,
    speed: 0.25,              // سرعت شنا
    opacityMin: 0.1,
    opacityMax: 0.5,
    connectDistance: 0         // اگه > 0 باشه، ذرات با خط وصل میشن
  },
  parallax: {
    enabled: true,
    mouseStrength: 20,        // حرکت با موس (px)
    scrollStrength: 0.15      // حرکت با اسکرول
  },
  animations: {
    revealOnScroll: true,
    staggerDelay: 120         // ms بین هر آیتم
  }
};

/* ═══════════════════════════════════════════
   🌍 دیتای کشور + زبان
   ═══════════════════════════════════════════ */
const LANG_BY_COUNTRY = {
  IR:'fa',AF:'fa',TJ:'fa',
  SA:'ar',AE:'ar',EG:'ar',DZ:'ar',MA:'ar',IQ:'ar',JO:'ar',KW:'ar',LB:'ar',LY:'ar',
  OM:'ar',PS:'ar',QA:'ar',SD:'ar',SY:'ar',TN:'ar',YE:'ar',BH:'ar',
  RU:'ru',BY:'ru',KZ:'ru',KG:'ru',
  DE:'de',AT:'de',CH:'de',LI:'de',LU:'de',
  CN:'zh',TW:'zh',HK:'zh',MO:'zh',SG:'zh',
  FR:'fr',BE:'fr',MC:'fr',SN:'fr',CI:'fr',
  CA:'en',US:'en',GB:'en',AU:'en',NZ:'en',IE:'en',ZA:'en',IN:'en',PK:'en',NG:'en'
};

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

/* ═══ متن‌های چندزبانه ═══ */
const GREETINGS = {fa:'خوش آمدید',en:'Welcome',ar:'أهلاً وسهلاً',ru:'Добро пожаловать',de:'Willkommen',zh:'欢迎',fr:'Bienvenue'};
const COUNTRY_LABELS = {fa:'کشور شما',en:'Your Country',ar:'بلدك',ru:'Ваша страна',de:'Ihr Land',zh:'您的国家',fr:'Votre pays'};
const LANGUAGE_LABELS = {fa:'زبان شما',en:'Your Language',ar:'لغتك',ru:'Ваш язык',de:'Ihre Sprache',zh:'您的语言',fr:'Votre langue'};
const NEXT_TEXTS = {fa:'ورود به گالری',en:'Enter Gallery',ar:'ادخل المعرض',ru:'Войти в галерею',de:'Galerie betreten',zh:'进入画廊',fr:'Entrer dans la galerie'};
const SELECT_TEXTS = {fa:'— انتخاب کنید —',en:'— Select —',ar:'— اختر —',ru:'— Выберите —',de:'— Auswählen —',zh:'— 选择 —',fr:'— Sélectionner —'};
const SEARCH_PLACEHOLDERS = {fa:'جستجوی کشور...',en:'Search country...',ar:'ابحث عن بلد...',ru:'Поиск страны...',de:'Land suchen...',zh:'搜索国家...',fr:'Rechercher un pays...'};
const MODAL_TITLES = {fa:'🌍 انتخاب کشور',en:'🌍 Select Country',ar:'🌍 اختر البلد',ru:'🌍 Выберите страну',de:'🌍 Land wählen',zh:'🌍 选择国家',fr:'🌍 Choisir un pays'};

/* ═══ وضعیت ═══ */
let COUNTRIES = {};
let selectedCountry = null;
let selectedLanguage = 'en';

/* ═══════════════════════════════════════════
   🚀 INIT
   ═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  initParticles();
  initParallax();
  initScrollReveal();
  initScrollProgress();
  loadWorldMap();
  
  COUNTRIES = await loadCountries();
  renderCountryList();
  setupEvents();
  await detectCountry();
});

/* ═══════════════════════════════════════════
   ✨ PARTICLES — ذرات شناور روی canvas
   ═══════════════════════════════════════════ */
function initParticles(){
  if(!WELCOME_CONFIG.particles.enabled) return;
  
  const canvas = document.getElementById('bgCanvas');
  if(!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0, mouseY = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  
  function resize(){
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
  }
  
  function createParticles(){
    const cfg = WELCOME_CONFIG.particles;
    const count = window.innerWidth < 640 ? Math.floor(cfg.count * 0.5) : cfg.count;
    particles = [];
    for(let i = 0; i < count; i++){
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * cfg.speed,
        vy: (Math.random() - 0.5) * cfg.speed,
        size: cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin),
        opacity: cfg.opacityMin + Math.random() * (cfg.opacityMax - cfg.opacityMin)
      });
    }
  }
  
  function draw(){
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const cfg = WELCOME_CONFIG.particles;
    
    particles.forEach(p => {
      // حرکت
      p.x += p.vx;
      p.y += p.vy;
      
      // واکنش به موس (نرم)
      if(WELCOME_CONFIG.parallax.enabled){
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 150){
          const force = (150 - dist) / 150;
          p.x -= (dx / dist) * force * 0.5;
          p.y -= (dy / dist) * force * 0.5;
        }
      }
      
      // wrap around
      if(p.x < 0) p.x = window.innerWidth;
      if(p.x > window.innerWidth) p.x = 0;
      if(p.y < 0) p.y = window.innerHeight;
      if(p.y > window.innerHeight) p.y = 0;
      
      // رسم
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = cfg.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });
    
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
  
  resize();
  createParticles();
  draw();
}

/* ═══════════════════════════════════════════
   🖱️ PARALLAX — پس‌زمینه با موس و اسکرول
   ═══════════════════════════════════════════ */
function initParallax(){
  if(!WELCOME_CONFIG.parallax.enabled) return;
  
  const glow1 = document.querySelector('.w-bg-glow-1');
  const glow2 = document.querySelector('.w-bg-glow-2');
  const map = document.querySelector('.w-bg-map');
  
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    targetX = x * WELCOME_CONFIG.parallax.mouseStrength;
    targetY = y * WELCOME_CONFIG.parallax.mouseStrength;
  });
  
  function animate(){
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    
    if(glow1) glow1.style.transform = `translate(${currentX * 0.5}px, ${currentY * 0.5}px)`;
    if(glow2) glow2.style.transform = `translate(${-currentX * 0.5}px, ${-currentY * 0.5}px)`;
    if(map) map.style.transform = `translate(${currentX * 0.3}px, ${currentY * 0.3}px)`;
    
    requestAnimationFrame(animate);
  }
  animate();
}

/* ═══════════════════════════════════════════
   📊 SCROLL PROGRESS
   ═══════════════════════════════════════════ */
function initScrollProgress(){
  const bar = document.getElementById('wProgress');
  if(!bar) return;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.height = pct + '%';
  });
}

/* ═══════════════════════════════════════════
   👁️ SCROLL REVEAL
   ═══════════════════════════════════════════ */
function initScrollReveal(){
  if(!WELCOME_CONFIG.animations.revealOnScroll) return;
  
  const items = document.querySelectorAll('.reveal-item');
  if(!items.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if(entry.isIntersecting){
        const delay = i * WELCOME_CONFIG.animations.staggerDelay;
        setTimeout(() => {
          entry.target.classList.add('in');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  
  items.forEach(item => observer.observe(item));
}

/* ═══════════════════════════════════════════
   🌍 COUNTRIES
   ═══════════════════════════════════════════ */
async function loadCountries(){
  try{
    const [c1, c2, c3, c4] = await Promise.all([
      fetch('i18n/countries-1.json').then(r => r.json()),
      fetch('i18n/countries-2.json').then(r => r.json()),
      fetch('i18n/countries-3.json').then(r => r.json()),
      fetch('i18n/countries-4.json').then(r => r.json())
    ]);
    return { ...c1, ...c2, ...c3, ...c4 };
  }catch(err){
    console.error('خطا در لود کشورها:', err);
    return {};
  }
}

/* ═══ رندر لیست کشورها ═══ */
function renderCountryList(filter = ''){
  const list = document.getElementById('countryList');
  if(!list) return;
  
  const search = filter.trim().toLowerCase();
  
  const sorted = Object.entries(COUNTRIES).sort((a, b) => a[1].localeCompare(b[1]));
  
  const filtered = sorted.filter(([code, name]) => {
    if(!search) return true;
    const flag = FLAGS[code] || '';
    if(code === 'IR') return name.toLowerCase().includes(search) || 'ایران'.includes(search);
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
  
  list.querySelectorAll('.country-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      selectCountry(item.dataset.code);
    });
  });
}

/* ═══ انتخاب کشور ═══ */
function selectCountry(code){
  selectedCountry = code;
  const countryName = COUNTRIES[code];
  const flag = FLAGS[code] || '🌍';
  
  const pickerFlag = document.getElementById('pickerFlag');
  const pickerName = document.getElementById('pickerName');
  
  if(pickerFlag) pickerFlag.textContent = flag;
  if(pickerName){
    pickerName.textContent = (code === 'IR') ? 'ایران — Iran' : countryName;
  }
  
  const suggestedLang = LANG_BY_COUNTRY[code] || 'en';
  selectedLanguage = suggestedLang;
  const langSelect = document.getElementById('languageSelect');
  if(langSelect) langSelect.value = suggestedLang;
  
  updateTexts(suggestedLang);
  
  if(typeof highlightCountry === 'function') highlightCountry(code);
  
  closeCountryModal();
  
  const searchVal = document.getElementById('countrySearch')?.value || '';
  renderCountryList(searchVal);
}

/* ═══ Events ═══ */
function setupEvents(){
  const pickerBtn = document.getElementById('countryPickerBtn');
  const modalOverlay = document.getElementById('countryModalOverlay');
  const modalClose = document.getElementById('countryModalClose');
  const search = document.getElementById('countrySearch');
  const languageSelect = document.getElementById('languageSelect');
  const nextBtn = document.getElementById('nextBtn');
  
  pickerBtn?.addEventListener('click', openCountryModal);
  modalClose?.addEventListener('click', closeCountryModal);
  
  modalOverlay?.addEventListener('click', (e) => {
    if(e.target === modalOverlay) closeCountryModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && modalOverlay?.classList.contains('open')){
      closeCountryModal();
    }
  });
  
  search?.addEventListener('input', (e) => {
    renderCountryList(e.target.value);
  });
  
  languageSelect?.addEventListener('change', (e) => {
    selectedLanguage = e.target.value;
    updateTexts(e.target.value);
  });
  
  nextBtn?.addEventListener('click', () => {
    if(!selectedCountry){
      // shake button
      nextBtn.animate([
        {transform:'translateX(0)'},
        {transform:'translateX(-8px)'},
        {transform:'translateX(8px)'},
        {transform:'translateX(-6px)'},
        {transform:'translateX(6px)'},
        {transform:'translateX(0)'}
      ], {duration: 400, easing: 'ease-out'});
      return;
    }
    
    localStorage.setItem('selectedLanguage', selectedLanguage);
    localStorage.setItem('selectedCountry', selectedCountry);
    sessionStorage.setItem('fromWelcome', '1');
    
    // fade out
    document.body.style.transition = 'opacity .6s ease';
    document.body.style.opacity = '0';
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 600);
  });
}

/* ═══ Open/Close Modal ═══ */
function openCountryModal(){
  const overlay = document.getElementById('countryModalOverlay');
  const search = document.getElementById('countrySearch');
  if(!overlay) return;
  
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  if(search){
    search.value = '';
    setTimeout(() => search.focus(), 250);
  }
  renderCountryList('');
}

function closeCountryModal(){
  const overlay = document.getElementById('countryModalOverlay');
  if(!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ═══ آپدیت متن‌ها ═══ */
function updateTexts(lang){
  const greeting = document.getElementById('greeting');
  const countryLabel = document.getElementById('countryLabel');
  const languageLabel = document.getElementById('languageLabel');
  const nextBtnText = document.getElementById('nextBtnText');
  const search = document.getElementById('countrySearch');
  const modalTitle = document.getElementById('countryModalTitle');
  
  if(greeting) greeting.classList.add('changing');
  
  setTimeout(() => {
    if(greeting) greeting.textContent = GREETINGS[lang] || GREETINGS.en;
    if(countryLabel) countryLabel.textContent = COUNTRY_LABELS[lang] || COUNTRY_LABELS.en;
    if(languageLabel) languageLabel.textContent = LANGUAGE_LABELS[lang] || LANGUAGE_LABELS.en;
    if(nextBtnText) nextBtnText.textContent = NEXT_TEXTS[lang] || NEXT_TEXTS.en;
    if(search) search.placeholder = SEARCH_PLACEHOLDERS[lang] || SEARCH_PLACEHOLDERS.en;
    if(modalTitle) modalTitle.textContent = MODAL_TITLES[lang] || MODAL_TITLES.en;
    
    if(!selectedCountry){
      const pickerName = document.getElementById('pickerName');
      if(pickerName) pickerName.textContent = SELECT_TEXTS[lang] || SELECT_TEXTS.en;
    }
    
    document.documentElement.dir = (lang === 'fa' || lang === 'ar') ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    if(greeting) greeting.classList.remove('changing');
  }, 200);
}

/* ═══ تشخیص IP ═══ */
async function detectCountry(){
  try{
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
    }else{
      updateTexts('en');
    }
  }catch(err){
    console.warn('IP detection failed:', err);
    updateTexts('en');
  }
}

/* ═══ نقشه پس‌زمینه ═══ */
async function loadWorldMap(){
  const mapWrap = document.getElementById('bgMap');
  if(!mapWrap) return;
  
  try{
    const res = await fetch('https://cdn.jsdelivr.net/npm/@svg-maps/world@1.0.1/world.svg');
    if(!res.ok) throw new Error('Map not found');
    const svgText = await res.text();
    mapWrap.innerHTML = svgText;
    
    const svg = mapWrap.querySelector('svg');
    if(svg){
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    }
  }catch(err){
    console.warn('نقشه لود نشد:', err);
  }
}

/* ═══ Highlight کشور (اگه بعداً خواستی) ═══ */
function highlightCountry(code){
  // فعلاً نقشه پس‌زمینه س، highlight لازم نیست
}