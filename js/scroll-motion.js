/* ═══════════════════════════════════════════
   🎞️ scroll-motion.js — حرکت آرام با اسکرول، مثل قدم زدن در گالری
   - بخش‌ها نرم ظاهر می‌شن، قاب‌ها «آویزون» می‌شن و جا می‌افتن
   - خط‌های طلایی کشیده می‌شن، جمله‌ی بیانیه کلمه‌به‌کلمه روشن می‌شه
   - با دور شدن از دیوار ورودی، نور کم می‌شه؛ تالارها پارالاکس دارن
   برای کسانی که «کاهش حرکت» رو در سیستم روشن کردن، هیچ حرکتی اجرا نمی‌شه.
   ═══════════════════════════════════════════ */
(function(){
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!document.body || !document.body.classList.contains('pg-classic')) return;
  const root = document.documentElement;
  root.classList.add('motion');

  /* ── برچسب‌گذاری خودکار عناصر صفحه‌ی اصلی و آثار ── */
  const AUTO = [
    ['.works-hero .section-head, .tabs', 'rv'],
    ['.cl-ornament', 'rv-line'],
    ['.cl-section .cl-lead', 'rv-words'],
    ['.cl-salon, .cl-about .cl-frame', 'rv-hang'],
    ['.art', 'rv']
  ];
  function tag(){
    AUTO.forEach(([sel, cls]) => document.querySelectorAll(sel).forEach(el => {
      if (el.dataset.mtag) return;
      el.dataset.mtag = '1';
      el.classList.add(cls);
      io.observe(el);
    }));
    document.querySelectorAll('.rv, .rv-hang, .rv-line, .rv-words').forEach(el => {
      if (!el.dataset.mobs){ el.dataset.mobs = '1'; io.observe(el); }
    });
    // تأخیر پلکانی برای گروه‌ها (تالارها، آثار، فصل‌ها)
    stagger('.cl-salons > .cl-salon', 120);
    stagger('.pp-cards > .pp-card', 110);
    document.querySelectorAll('.gallery').forEach(g => stagger(g.querySelectorAll(':scope > .art'), 60));
  }
  function stagger(list, ms){
    (typeof list === 'string' ? document.querySelectorAll(list) : list)
      .forEach((el, i) => el.style.setProperty('--d', (Math.min(i, 8) * ms) + 'ms'));
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: .18, rootMargin: '0px 0px -6% 0px' });

  /* ── جمله‌ی بیانیه: کلمه‌به‌کلمه ── */
  function splitWords(){
    document.querySelectorAll('.rv-words').forEach(el => {
      const text = el.textContent.trim();
      if (!text || el.dataset.split === text) return;
      el.innerHTML = text.split(/(\s+)/).map((w, i) =>
        /\s+/.test(w) ? w : `<span class="w" style="--i:${i >> 1}">${w.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</span>`
      ).join('');
      el.dataset.split = el.textContent.trim();
    });
  }

  /* ── عمق و پارالاکس (یک بار در هر فریم) ── */
  const wall = document.querySelector('.gallery-wall-section.gw-first');
  let ticking = false;
  function frame(){
    ticking = false;
    const vh = innerHeight;
    if (wall){
      const r = wall.getBoundingClientRect();
      const away = Math.min(Math.max(-r.top / r.height, 0), 1);
      wall.style.setProperty('--away', away.toFixed(3));
    }
    document.querySelectorAll('.cl-salon').forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const off = (r.top + r.height / 2 - vh / 2) / vh;      // −۱ تا +۱
      el.style.setProperty('--par', (off * (i % 2 ? -18 : 18)).toFixed(1));
    });
  }
  addEventListener('scroll', () => { if (!ticking){ ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  addEventListener('resize', frame);

  /* ── اجرا: بعد از لود، بعد از هر تغییر زبان، و وقتی گالری رندر می‌شه ── */
  function refresh(){ splitWords(); tag(); frame(); }
  document.addEventListener('languageChanged', () => setTimeout(refresh, 0));
  new MutationObserver(() => { clearTimeout(refresh.t); refresh.t = setTimeout(refresh, 60); })
    .observe(document.body, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh); else refresh();
})();
