// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Skill bars animation
const skillIo = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const fill = e.target.querySelector('.skill-fill');
      if(fill) fill.style.width = fill.dataset.pct + '%';
      skillIo.unobserve(e.target);
    }
  });
},{threshold:.3});
document.querySelectorAll('.skill').forEach(el=>skillIo.observe(el));

// Gallery tabs
const tabs = document.querySelectorAll('.tab');
const galleries = document.querySelectorAll('.gallery');

tabs.forEach(tab=>{
  tab.addEventListener('click', ()=>{
    tabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.target;
    galleries.forEach(g=>{
      g.classList.toggle('hidden', g.dataset.gallery !== target);
    });
  });
});
/* ===== LIGHTBOX ===== */
(function(){
  const lightbox    = document.getElementById('lightbox');
   if(!lightbox) return;   /* ⬅️ این خط اضافه شه */
  const bg          = document.getElementById('lightboxBg');
  const img         = document.getElementById('lightboxImg');
  const title       = document.getElementById('lightboxTitle');
  const desc        = document.getElementById('lightboxDesc');
  const meta        = document.getElementById('lightboxMeta');
  const links       = document.getElementById('lightboxLinks');
  const storyboard  = document.getElementById('lightboxStoryboard');
  const hint        = document.getElementById('lightboxHint');
  const closeBtn    = document.getElementById('lightboxClose');
  
  window.openLightbox = function(card){
    const data = card.dataset;
    
    img.src = card.querySelector('img').src;
    img.alt = data.title || '';
    
    bg.style.backgroundImage = `url('${card.querySelector('img').src}')`;
    
    title.textContent = data.title || 'بدون عنوان';
    desc.textContent  = data.desc  || '';
    
    let metaHTML = '';
    if(data.category) metaHTML += `<span>🎨 ${data.category}</span>`;
    if(data.year)     metaHTML += `<span>📅 ${data.year}</span>`;
    if(data.tools)    metaHTML += `<span>🛠️ ${data.tools}</span>`;
    meta.innerHTML = metaHTML;
    
    let linksHTML = '';
    if(data.insta){
      linksHTML += `<a href="${data.insta}" target="_blank">📷 مشاهده در اینستاگرام</a>`;
    }
    linksHTML += `<button onclick="copyLink('${location.origin}${location.pathname}#${data.slug||''}')">🔗 کپی لینک</button>`;
    links.innerHTML = linksHTML;
    
    const sb = data.storyboard;
    if(sb && sb.trim()){
      const items = sb.split(',').map(s=>s.trim()).filter(Boolean);
      storyboard.innerHTML = `
        <div class="storyboard-label">استوری‌برد</div>
        <div class="storyboard-grid">
          ${items.map(src=>`<img src="${src}" alt="storyboard" />`).join('')}
        </div>`;
    } else {
      storyboard.innerHTML = `<div class="storyboard-empty">این اثر استوری‌برد نداره — به جاش یه حال و هوای موشن ببین ✨</div>`;
    }
    
   lightbox.classList.add('open', 'motion-on');
document.body.style.overflow = 'hidden';
lightbox.classList.remove('storyboard-on');
  }
  
  window.closeLightbox = function(){
    lightbox.classList.remove('open','storyboard-on','motion-on');
    document.body.style.overflow = '';
  }
  
  
  
  closeBtn.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape') closeLightbox();
  });
  
  document.querySelectorAll('.art').forEach(card=>{
    card.addEventListener('click', ()=>openLightbox(card));
  });
})();

function copyLink(url){
  navigator.clipboard.writeText(url).then(()=>{
    alert('✅ لینک کپی شد!');
  });
}
/* ===== منوی همبرگری ===== */
const menuToggle = document.getElementById('menuToggle');
const mainMenu = document.getElementById('mainMenu');

if(menuToggle && mainMenu){
  menuToggle.addEventListener('click', ()=>{
    mainMenu.classList.toggle('open');
    menuToggle.textContent = mainMenu.classList.contains('open') ? '×' : '☰';
  });
  
  mainMenu.querySelectorAll('a').forEach(link=>{
    link.addEventListener('click', ()=>{
      mainMenu.classList.remove('open');
      menuToggle.textContent = '☰';
    });
  });
}
/* ═══════════════════════════════════════════
   🎨 رندر گالری صفحه اصلی (۴ اثر منتخب)
   ═══════════════════════════════════════════ */
function renderFeaturedGallery(){
  if(typeof WORKS === 'undefined'){
    console.error('❌ works.js لود نشده!');
    return;
  }
  
  const grid = document.getElementById('featuredGallery');
  if(!grid) return;
  
  // چک کردن متن‌های لود شده
  const contentData = window.__worksContent || {};
  
  const picks = [];
  const digital = WORKS.filter(w => w.category === 'digital');
  const traditional = WORKS.filter(w => w.category === 'traditional');
  const sketch = WORKS.filter(w => w.category === 'sketch');
  
  if(digital[0]) picks.push(digital[0]);
  if(traditional[0]) picks.push(traditional[0]);
  if(sketch[0]) picks.push(sketch[0]);
  if(digital[1]) picks.push(digital[1]);
  
  grid.innerHTML = picks.map(w => {
    const text = contentData[w.id] || {};
    const title = text.title || `اثر ${w.id}`;
    const desc = text.desc || '';
    const catLabel = typeof getCategoryLabel === 'function' 
      ? getCategoryLabel(w.category, window.i18n?.translations)
      : (window.i18n?.t('works.defaultCategory') || 'نقاشی دیجیتال');
    
    return `
      <div class="art"
           data-title="${title}"
           data-desc="${desc}"
           data-category="${catLabel}"
           data-year="${w.year}"
           data-tools="${w.tools}"
           data-insta="${w.insta || ''}">
        <img src="${w.image}" alt="${title}" loading="lazy" />
        <div class="cap">${title}<small>${catLabel} · ${w.year}</small></div>
      </div>
    `;
  }).join('');
  
  // اتصال لایت‌باکس
  if(typeof window.openLightbox === 'function'){
    document.querySelectorAll('#featuredGallery .art').forEach(card=>{
      card.addEventListener('click', function(){
        window.openLightbox(this);
      });
    });
  }
  
  // انیمیشن
  setTimeout(()=>{
    document.querySelectorAll('#featuredGallery .art').forEach((card, i)=>{
      setTimeout(()=>{
        card.style.opacity = '1';
        card.style.transform = 'none';
      }, i * 80);
    });
  }, 100);
}

/* ─── لود کردن محتوای آثار ─── */
async function loadFeaturedContent(){
  const lang = (window.i18n?.getCurrentLang)() || 'fa';
  try {
    const res = await fetch(`content/works/${lang}.json`);
    if(res.ok){
      window.__worksContent = await res.json();
    }
  } catch(err){
    console.warn('⚠️ محتوای آثار لود نشد، از فارسی استفاده می‌شود');
    if(lang !== 'fa'){
      try {
        const res = await fetch('content/works/fa.json');
        window.__worksContent = await res.json();
      } catch(e){}
    }
  }
}

document.addEventListener('DOMContentLoaded', async ()=>{
  await loadFeaturedContent();
  renderFeaturedGallery();
});

// اگه زبان عوض شد، دوباره لود کن
document.addEventListener('languageChanged', async ()=>{
  await loadFeaturedContent();
  renderFeaturedGallery();
});

document.addEventListener('DOMContentLoaded', renderFeaturedGallery);
/* ═══════════════════════════════════════════
   🎬 SPLASH SCREEN — زمان‌بندی جدید
   ═══════════════════════════════════════════ */
(function(){
  const splash = document.getElementById('splash');
  const poemBlock = document.getElementById('splashPoem');
  const logoBlock = document.getElementById('splashLogo');
  
  if(!splash){
    document.body.classList.add('loaded');
    return;
  }
  
  // اگه قبلاً تو این session دیده شده
  if(sessionStorage.getItem('splashShown') === 'yes'){
    splash.remove();
    document.body.classList.add('loaded');
    return;
  }
  
  /* ⏱️ زمان‌بندی:
     0-4.5s:   بیت فردوسی
     4.5s:     محو شدن بیت شعر
     5.2s:     ظاهر شدن لوگو (شروع انیمیشن)
     5.4s:     عکس پروفایل
     6.8s:     خط امضا کشیده میشه
     8.6s:     نوشته ظاهر میشه
     10s:      درخشش نهایی
     11s:      محو شدن کل splash
     12.2s:    سایت کامل ظاهر میشه
  */
  
  // ۴.۵ ثانیه: محو شدن بیت شعر
  setTimeout(()=>{
    if(poemBlock) poemBlock.classList.add('fade-out');
  }, 4500);
  
  // ۵.۲ ثانیه: ظاهر شدن لوگو
  setTimeout(()=>{
    if(logoBlock) logoBlock.classList.add('show');
  }, 5200);
  
  // ۱۱ ثانیه: محو شدن کل splash
  setTimeout(()=>{
    splash.classList.add('hidden');
    sessionStorage.setItem('splashShown', 'yes');
    
    setTimeout(()=>{
      splash.remove();
      document.body.classList.add('loaded');
    }, 1200);
  }, 11000);
})();
/* ═══════════════════════════════════════════
   🔐 سیستم ورود/ثبت‌نام
   ═══════════════════════════════════════════ */
(function(){
  const signupModal = document.getElementById('signupModal');
  const loginModal  = document.getElementById('loginModal');
  const forgotModal = document.getElementById('forgotModal');
  const signupBtn   = document.getElementById('signupBtn');
  const loginBtn    = document.getElementById('loginBtn');
  
  if(!signupModal || !loginModal) return;
  
  /* ===== باز و بسته کردن Modal ===== */
  function openModal(modal){
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(modal){
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // پاک کردن پیام‌ها
    const msg = modal.querySelector('.form-message');
    if(msg){ msg.textContent=''; msg.className='form-message'; }
  }
  
  signupBtn?.addEventListener('click', ()=>openModal(signupModal));
  loginBtn?.addEventListener('click', ()=>openModal(loginModal));
  
  // بستن با ضربدر
  document.querySelectorAll('[data-close]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      closeModal(btn.closest('.modal-overlay'));
    });
  });
  
  // بستن با کلیک روی پس‌زمینه
  [signupModal, loginModal, forgotModal].forEach(modal=>{
    modal.addEventListener('click', (e)=>{
      if(e.target === modal) closeModal(modal);
    });
  });
  
  // بستن با Esc
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
  closeModal(signupModal);
  closeModal(loginModal);
  closeModal(forgotModal);
}
  });
  
  // سوئیچ بین دو Modal
  document.getElementById('switchToLogin')?.addEventListener('click', ()=>{
    closeModal(signupModal);
    openModal(loginModal);
  });
  document.getElementById('switchToSignup')?.addEventListener('click', ()=>{
    closeModal(loginModal);
    openModal(signupModal);
  });
    // دکمه فراموشی رمز
  document.getElementById('forgotPasswordBtn')?.addEventListener('click', ()=>{
    closeModal(loginModal);
    openModal(forgotModal);
  });
  
  document.getElementById('backToLoginFromForgot')?.addEventListener('click', ()=>{
    closeModal(forgotModal);
    openModal(loginModal);
  });
  
  /* ===== ثبت‌نام ===== */
  const signupForm = document.getElementById('signupForm');
  const signupMessage = document.getElementById('signupMessage');
  
  signupForm?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const formData = new FormData(signupForm);
    const data = Object.fromEntries(formData.entries());
    
    // اعتبارسنجی نقش
if(!data.role){
  showMessage(signupMessage, 'لطفاً نقش خودت رو انتخاب کن', 'error');
  return;
}
    
    // غیرفعال کردن دکمه
    const submitBtn = signupForm.querySelector('.modal-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>در حال ثبت‌نام...</span>';
    
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      
      if(!res.ok){
        showMessage(signupMessage, result.error || 'خطا در ثبت‌نام', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>ساخت حساب</span>';
        return;
      }
      
      // ذخیره توکن و کاربر
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      
      showMessage(signupMessage, '✅ حساب ساخته شد! در حال انتقال...', 'success');
      setTimeout(()=>{
        closeModal(signupModal);
        updateAuthUI();
        signupForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>ساخت حساب</span>';
      }, 1000);
      
    } catch(err){
      showMessage(signupMessage, 'خطای شبکه. دوباره تلاش کن.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>ساخت حساب</span>';
    }
  });
  
  /* ===== ورود ===== */
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');
  
  loginForm?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());
    
    const submitBtn = loginForm.querySelector('.modal-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>در حال ورود...</span>';
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      
      if(!res.ok){
        showMessage(loginMessage, result.error || 'ایمیل یا پسورد اشتباهه', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>ورود به حساب</span>';
        return;
      }
      
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      
      showMessage(loginMessage, '✅ خوش آمدی! در حال انتقال...', 'success');
      setTimeout(()=>{
        closeModal(loginModal);
        updateAuthUI();
        loginForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>ورود به حساب</span>';
      }, 1000);
      
    } catch(err){
      showMessage(loginMessage, 'خطای شبکه. دوباره تلاش کن.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>ورود به حساب</span>';
    }
  });
  
  /* ===== نمایش پیام ===== */
  function showMessage(el, text, type){
    if(!el) return;
    el.textContent = text;
    el.className = 'form-message ' + type;
  }
  
  /* ===== آپدیت UI بعد از ورود ===== */
  function updateAuthUI(){
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const authButtons = document.querySelector('.auth-buttons');
    
    if(!authButtons) return;
    
    if(user){
      // کاربر لاگین شده
      authButtons.innerHTML = `
        <div class="user-menu show">
          <span class="user-greeting">سلام، <strong>${user.name.split(' ')[0]}</strong> 👋</span>
          <div class="user-avatar" id="userAvatar" title="پروفایل">${user.name.charAt(0).toUpperCase()}</div>
          <button class="auth-btn" id="logoutBtn">خروج</button>
        </div>
      `;
      
      document.getElementById('logoutBtn')?.addEventListener('click', logout);
     document.getElementById('userAvatar')?.addEventListener('click', ()=>{
  window.location.href = 'profile.html';
});
      // کاربر مهمان
      authButtons.innerHTML = `
        <button class="auth-btn" id="loginBtn">ورود</button>
        <button class="auth-btn auth-btn-primary" id="signupBtn">ثبت‌نام</button>
      `;
      
      document.getElementById('loginBtn')?.addEventListener('click', ()=>openModal(loginModal));
      document.getElementById('signupBtn')?.addEventListener('click', ()=>openModal(signupModal));
    }
  }
  
  /* ===== خروج ===== */
  async function logout(){
    const token = localStorage.getItem('authToken');
    if(token){
      try {
        await fetch('/api/logout', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token }
        });
      } catch(err){}
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    updateAuthUI();
  }
  
  /* ===== بررسی ورود در بارگذاری ===== */
  async function checkAuth(){
    const token = localStorage.getItem('authToken');
    if(!token){ updateAuthUI(); return; }
    
    try {
      const res = await fetch('/api/me', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if(res.ok){
        const data = await res.json();
        localStorage.setItem('currentUser', JSON.stringify(data.user));
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
      }
    } catch(err){}
    
    updateAuthUI();
  }
  
  // اجرای اولیه
  checkAuth();
})();
/* ===== درخواست بازیابی رمز ===== */
const forgotForm = document.getElementById('forgotForm');
const forgotMessage = document.getElementById('forgotMessage');
const resetForm = document.getElementById('resetForm');
const resetMessage = document.getElementById('resetMessage');

let recoveryData = { email: '', phone: '' };

forgotForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(forgotForm).entries());
  
  const submitBtn = forgotForm.querySelector('.modal-submit');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>در حال بررسی...</span>';
  
  try {
    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    
    if(!res.ok){
      showMessage(forgotMessage, result.error || 'خطا در بررسی', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>دریافت کد بازیابی</span>';
      return;
    }
    
    // ذخیره اطلاعات برای مرحله بعد
    recoveryData = { email: data.email, phone: data.phone };
    
    showMessage(forgotMessage, 
      `✅ کد بازیابی تو: <strong style="font-size:1.4rem;letter-spacing:6px;display:block;margin-top:8px;color:#fff">${result.code}</strong>`, 
      'success');
    
    // بعد از ۲ ثانیه، برو به فرم تغییر رمز
    setTimeout(()=>{
      forgotForm.style.display = 'none';
      resetForm.style.display = 'flex';
      // پر کردن خودکار فیلدهای مخفی
      resetForm.dataset.email = data.email;
      resetForm.dataset.phone = data.phone;
    }, 2500);
    
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>دریافت کد بازیابی</span>';
    
  } catch(err){
    showMessage(forgotMessage, 'خطای شبکه. دوباره تلاش کن.', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>دریافت کد بازیابی</span>';
  }
});

/* ===== تغییر رمز ===== */
resetForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const formData = new FormData(resetForm);
  const data = Object.fromEntries(formData.entries());
  
  if(data.newPassword !== data.confirmPassword){
    showMessage(resetMessage, 'رمزها با هم یکسان نیستن', 'error');
    return;
  }
  
  const submitBtn = resetForm.querySelector('.modal-submit');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>در حال تغییر...</span>';
  
  try {
    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: resetForm.dataset.email,
        phone: resetForm.dataset.phone,
        code: data.code,
        newPassword: data.newPassword
      })
    });
    const result = await res.json();
    
    if(!res.ok){
      showMessage(resetMessage, result.error || 'خطا در تغییر رمز', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>تغییر رمز</span>';
      return;
    }
    
    showMessage(resetMessage, '✅ رمز با موفقیت تغییر کرد!', 'success');
    
    setTimeout(()=>{
      closeModal(forgotModal);
      openModal(loginModal);
      // ریست فرم‌ها
      forgotForm.style.display = 'flex';
      resetForm.style.display = 'none';
      forgotForm.reset();
      resetForm.reset();
      showMessage(forgotMessage, '', '');
      showMessage(resetMessage, '', '');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>تغییر رمز</span>';
    }, 1500);
    
  } catch(err){
    showMessage(resetMessage, 'خطای شبکه. دوباره تلاش کن.', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>تغییر رمز</span>';
  }
});