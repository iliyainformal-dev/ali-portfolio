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
const GREETINGS = {fa:'خوش آمدید',en:'Welcome',ar:'أهلاً وسهلاً',ru:'Добро пожаловать',de:'Willkommen',zh:'欢迎',fr:'Bienvenue'};
const TITLES = { ...GREETINGS };
const SUBTITLES = {fa:'کشور و زبان خود را انتخاب کنید',en:'Choose your country and language',ar:'اختر بلدك ولغتك',ru:'Выберите страну и язык',de:'Wählen Sie Land und Sprache',zh:'选择您的国家和语言',fr:'Choisissez votre pays et langue'};
const NEXT_TEXTS = {fa:'بعدی',en:'Next',ar:'التالي',ru:'Далее',de:'Weiter',zh:'下一步',fr:'Suivant'};
const COUNTRY_LABELS = {fa:'کشور شما',en:'Your Country',ar:'بلدك',ru:'Ваша страна',de:'Ihr Land',zh:'您的国家',fr:'Votre pays'};
const LANGUAGE_LABELS = {fa:'زبان شما',en:'Your Language',ar:'لغتك',ru:'Ваш язык',de:'Ihre Sprache',zh:'您的语言',fr:'Votre langue'};
const SEARCH_PLACEHOLDERS = {fa:'جستجوی کشور...',en:'Search country...',ar:'ابحث عن بلد...',ru:'Поиск страны...',de:'Land suchen...',zh:'搜索国家...',fr:'Rechercher un pays...'};
const SELECT_TEXTS = {fa:'— انتخاب کنید —',en:'— Select —',ar:'— اختر —',ru:'— Выберите —',de:'— Auswählen —',zh:'— 选择 —',fr:'— Sélectionner —'};
const MODAL_TITLES = {fa:'🌍 انتخاب کشور',en:'🌍 Select Country',ar:'🌍 اختر البلد',ru:'🌍 Выберите страну',de:'🌍 Land wählen',zh:'🌍 选择国家',fr:'🌍 Choisir un pays'};

let COUNTRIES = {};
let selectedCountry = null;
let selectedLanguage = 'en';

document.addEventListener('DOMContentLoaded', async () => {
  createStars();
  loadWorldMap();
  COUNTRIES = await loadCountries();
  renderCountryList();
  setupEvents();
  await detectCountry();
});

function createStars(){
  const container = document.getElementById('stars');
  if(!container) return;
  for(let i=0;i<60;i++){
    const star=document.createElement('div');
    star.className='star';
    star.style.left=Math.random()*100+'%';
    star.style.top=Math.random()*100+'%';
    star.style.animationDelay=Math.random()*3+'s';
    star.style.opacity=Math.random()*0.5+0.2;
    container.appendChild(star);
  }
}

async function loadCountries(){
  try{
    const [c1,c2,c3,c4] = await Promise.all([
      fetch('i18n/countries-1.json').then(r=>r.json()),
      fetch('i18n/countries-2.json').then(r=>r.json()),
      fetch('i18n/countries-3.json').then(r=>r.json()),
      fetch('i18n/countries-4.json').then(r=>r.json())
    ]);
    return {...c1,...c2,...c3,...c4};
  }catch(err){
    console.error('خطا در لود کشورها:',err);
    return {};
  }
}

function renderCountryList(filter=''){
  const list = document.getElementById('countryList');
  if(!list) return;
  const search = filter.trim().toLowerCase();
  const sorted = Object.entries(COUNTRIES).sort((a,b)=>a[1].localeCompare(b[1]));
  const filtered = sorted.filter(([code,name])=>{
    if(!search) return true;
    const flag = FLAGS[code]||'';
    if(code==='IR') return name.toLowerCase().includes(search)||'ایران'.includes(search);
    return name.toLowerCase().includes(search)||flag.includes(search);
  });
  if(filtered.length===0){
    list.innerHTML = `<div class="country-empty">کشوری پیدا نشد</div>`;
    return;
  }
  list.innerHTML = filtered.map(([code,name])=>{
    const flag = FLAGS[code]||'🌍';
    const isSelected = selectedCountry===code;
    const displayName = (code==='IR')?'ایران — Iran':name;
    return `<div class="country-item ${isSelected?'selected':''}" data-code="${code}"><span class="c-flag">${flag}</span><span class="c-name">${displayName}</span><span class="c-check">✓</span></div>`;
  }).join('');
  list.querySelectorAll('.country-item').forEach(item=>{
    item.addEventListener('click',(e)=>{
      e.stopPropagation();
      selectCountry(item.dataset.code);
    });
  });
}

function selectCountry(code){
  selectedCountry = code;
  const countryName = COUNTRIES[code];
  const flag = FLAGS[code]||'🌍';
  const pickerFlag = document.getElementById('pickerFlag');
  const pickerName = document.getElementById('pickerName');
  if(pickerFlag) pickerFlag.textContent = flag;
  if(pickerName) pickerName.textContent = (code==='IR')?'ایران — Iran':countryName;
  const suggestedLang = LANG_BY_COUNTRY[code]||'en';
  selectedLanguage = suggestedLang;
  const langSelect = document.getElementById('languageSelect');
  if(langSelect) langSelect.value = suggestedLang;
  updateTexts(suggestedLang);
  if(typeof highlightCountry==='function') highlightCountry(code);
  closeCountryModal();
  const searchVal = document.getElementById('countrySearch')?.value||'';
  renderCountryList(searchVal);
}

function setupEvents(){
  const pickerBtn = document.getElementById('countryPickerBtn');
  const modalOverlay = document.getElementById('countryModalOverlay');
  const modalClose = document.getElementById('countryModalClose');
  const search = document.getElementById('countrySearch');
  const languageSelect = document.getElementById('languageSelect');
  const nextBtn = document.getElementById('nextBtn');
  pickerBtn?.addEventListener('click', openCountryModal);
  modalClose?.addEventListener('click', closeCountryModal);
  modalOverlay?.addEventListener('click',(e)=>{if(e.target===modalOverlay) closeCountryModal();});
  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape'&&modalOverlay?.classList.contains('open')) closeCountryModal();
  });
  search?.addEventListener('input',(e)=>renderCountryList(e.target.value));
  languageSelect?.addEventListener('change',(e)=>{
    selectedLanguage = e.target.value;
    updateTexts(e.target.value);
  });
  nextBtn?.addEventListener('click',()=>{
    if(!selectedCountry){
      alert('لطفاً کشور خود را انتخاب کنید');
      return;
    }
    localStorage.setItem('selectedLanguage', selectedLanguage);
    localStorage.setItem('selectedCountry', selectedCountry);
    sessionStorage.setItem('fromWelcome','1');
    window.location.href = 'index.html';
  });
}

function openCountryModal(){
  const overlay = document.getElementById('countryModalOverlay');
  const search = document.getElementById('countrySearch');
  if(!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  if(search){ search.value=''; setTimeout(()=>search.focus(),250); }
  renderCountryList('');
}

function closeCountryModal(){
  const overlay = document.getElementById('countryModalOverlay');
  if(!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function updateTexts(lang){
  const greeting = document.getElementById('greeting');
  const mainTitle = document.getElementById('mainTitle');
  const subTitle = document.getElementById('subTitle');
  const countryLabel = document.getElementById('countryLabel');
  const languageLabel = document.getElementById('languageLabel');
  const nextBtnText = document.getElementById('nextBtnText');
  const search = document.getElementById('countrySearch');
  const modalTitle = document.getElementById('countryModalTitle');
  if(greeting) greeting.classList.add('changing');
  setTimeout(()=>{
    if(greeting) greeting.textContent = GREETINGS[lang]||GREETINGS.en;
    if(mainTitle) mainTitle.textContent = TITLES[lang]||TITLES.en;
    if(subTitle) subTitle.textContent = SUBTITLES[lang]||SUBTITLES.en;
    if(countryLabel) countryLabel.textContent = COUNTRY_LABELS[lang]||COUNTRY_LABELS.en;
    if(languageLabel) languageLabel.textContent = LANGUAGE_LABELS[lang]||LANGUAGE_LABELS.en;
    if(nextBtnText) nextBtnText.textContent = NEXT_TEXTS[lang]||NEXT_TEXTS.en;
    if(search) search.placeholder = SEARCH_PLACEHOLDERS[lang]||SEARCH_PLACEHOLDERS.en;
    if(modalTitle) modalTitle.textContent = MODAL_TITLES[lang]||MODAL_TITLES.en;
    if(!selectedCountry){
      const pickerName = document.getElementById('pickerName');
      if(pickerName) pickerName.textContent = SELECT_TEXTS[lang]||SELECT_TEXTS.en;
    }
    document.documentElement.dir = (lang==='fa'||lang==='ar')?'rtl':'ltr';
    document.documentElement.lang = lang;
    if(greeting) greeting.classList.remove('changing');
  },200);
}

async function detectCountry(){
  try{
    const saved = localStorage.getItem('selectedCountry');
    const savedLang = localStorage.getItem('selectedLanguage');
    if(saved&&savedLang){ selectCountry(saved); return; }
    const res = await fetch('/api/detect-country');
    const data = await res.json();
    if(data.country&&COUNTRIES[data.country]) selectCountry(data.country);
    else updateTexts('en');
  }catch(err){
    console.warn('IP detection failed:',err);
    updateTexts('en');
  }
}

async function loadWorldMap(){
  const wrap = document.getElementById('worldMapWrap');
  if(!wrap) return;
  try{
    const res = await fetch('https://cdn.jsdelivr.net/npm/@svg-maps/world@1.0.1/world.svg');
    if(!res.ok) throw new Error('Map not found');
    const svgText = await res.text();
    wrap.innerHTML = svgText;
    const svg = wrap.querySelector('svg');
    if(svg){
      svg.style.width='100%';
      svg.style.height='100%';
      svg.setAttribute('preserveAspectRatio','xMidYMid meet');
      svg.setAttribute('viewBox',svg.getAttribute('viewBox')||'0 0 2000 1000');
    }
    if(selectedCountry) highlightCountry(selectedCountry);
  }catch(err){
    console.warn('⚠️ نقشه لود نشد:',err);
  }
}

function highlightCountry(code){
  const wrap = document.getElementById('worldMapWrap');
  if(!wrap) return;
  const paths = wrap.querySelectorAll('svg path');
  let found = false;
  paths.forEach(p=>{
    const id = p.id||p.getAttribute('data-id')||p.getAttribute('data-code');
    const match = id&&(id===code||id===code.toUpperCase()||id===code.toLowerCase());
    p.classList.toggle('highlighted',match);
    if(match) found = true;
  });
  if(!found) console.warn(`⚠️ کشور ${code} توی نقشه پیدا نشد`);
}