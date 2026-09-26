/* ═══════════════════════════════════════════
   🎨 منطق صفحه گالری کامل (works.html)
   ═══════════════════════════════════════════ */
(function(){
  if(typeof WORKS === 'undefined'){
    console.error('❌ works.js لود نشده!');
    return;
  }
  
  const categories = ['digital', 'traditional', 'sketch', 'poster', 'photo'];
  let contentData = {}; // متن‌های اثر (از content/works/{lang}.json)
  
  /* ===== لود متن‌های آثار ===== */
  async function loadContent(lang){
    try {
      const res = await fetch(`content/works/${lang}.json`);
      if(!res.ok) throw new Error('not found');
      contentData = await res.json();
      return contentData;
    } catch(err){
      console.warn(`⚠️ content/works/${lang}.json پیدا نشد، از فارسی استفاده می‌شود`);
      // fallback به فارسی
      if(lang !== 'fa'){
        try {
          const res = await fetch('content/works/fa.json');
          contentData = await res.json();
          return contentData;
        } catch(e){}
      }
      contentData = {};
      return {};
    }
  }
  
  /* ===== رندر همه گالری‌ها ===== */
  function renderAllGalleries(){
    categories.forEach(cat=>{
      const grid = document.querySelector(`.gallery[data-gallery="${cat}"]`);
      if(!grid) return;
      
      const works = WORKS.filter(w => w.category === cat);
      
      // اگه دسته خالیه (مثل عکاسی)
      if(works.length === 0){
        grid.innerHTML = `
          <div class="empty-category">
            <div class="empty-icon">📷</div>
            <div class="empty-text">${i18n?.t('worksPage.empty') || 'هنوز اثری تو این دسته اضافه نشده'}</div>
            <div class="empty-sub">${i18n?.t('worksPage.emptySoon') || 'به‌زودی...'}</div>
          </div>
        `;
        return;
      }
      
      // رندر کارت‌ها با متن از content
      grid.innerHTML = works.map(w => {
        const text = contentData[w.id] || {};
        const title = text.title || `اثر ${w.id}`;
        const desc = text.desc || '';
        const catLabel = getCategoryLabel(w.category);
        
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
    });
    
    // اتصال لایت‌باکس
    if(typeof window.openLightbox === 'function'){
      document.querySelectorAll('.art').forEach(card=>{
        card.addEventListener('click', function(){
          window.openLightbox(this);
        });
      });
    }
    
    // انیمیشن ظاهری
    setTimeout(()=>{
      document.querySelectorAll('.art').forEach((card, i)=>{
        setTimeout(()=>{
          card.style.opacity = '1';
          card.style.transform = 'none';
        }, i * 30);
      });
    }, 100);
  }
  
  /* ===== تب‌ها ===== */
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
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  
  /* ===== شروع ===== */
  async function init(){
    const lang = (window.i18n?.getCurrentLang)() || 'fa';
    await loadContent(lang);
    renderAllGalleries();
  }
  
  document.addEventListener('DOMContentLoaded', init);
  
  // اگه زبان عوض شد، دوباره رندر کن
  document.addEventListener('languageChanged', async (e)=>{
    await loadContent(e.detail.lang);
    renderAllGalleries();
  });
})();