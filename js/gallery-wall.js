/* ═══════════════════════════════════════════
   🖼️ Gallery Wall — نمایشگاه دیواری سه‌بعدی
   ═══════════════════════════════════════════ */
(function(){
  function init(){
    if(typeof WORKS === 'undefined'){
      console.warn('gallery-wall: works.js لود نشده');
      return;
    }
    const stage = document.getElementById('gwStage');
    if(!stage || stage.dataset.built === '1') return;
    stage.dataset.built = '1';

    const section = document.querySelector('.gallery-wall-section');
    const root = section || document.documentElement;
    const $ = id => document.getElementById(id);
    const fa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── داده از WORKS ── */
    const ITEMS = WORKS.map(w => ({
      src: w.image,
      year: w.year,
      category: w.category,
      id: w.id
    }));

    const CATEGORY_LABEL = {
      digital:     'نقاشی دیجیتال',
      traditional: 'نقاشی',
      sketch:      'اتود',
      poster:      'پوستر',
      photo:       'عکاسی'
    };

    const N = ITEMS.length;
    if(N === 0) return;

    /* ── تنظیمات ── */
    const DWELL = 3000;   // مدت هر اثر (میلی‌ثانیه)
    const MAT = .09;      // پهنای پاسپارتو
    const BORDER = 8;     // ضخامت قاب
    const GAP = .09;      // فاصله بین قاب‌ها

    const ratio = ITEMS.map(() => .8);
    const wid = ITEMS.map(() => 0);

    /* ── ساخت فریم‌ها ── */
    const frames = ITEMS.map((it, i) => {
      const f = document.createElement('figure');
      f.className = 'gw-frame';
      f.innerHTML = '<div class="gw-mat"><div class="gw-in"><img alt="" decoding="async"></div></div>';
      f.querySelector('.gw-in').style.setProperty('--h', i * 360 / N);
      const img = f.querySelector('img');
      img.alt = 'اثر ' + fa(i + 1);
      img.draggable = false;
      img.onload = () => {
        ratio[i] = img.naturalWidth / img.naturalHeight;
        fit(i);
        dirty = true;
      };
      img.onerror = () => img.remove();
      img.src = it.src;
      stage.appendChild(f);
      return f;
    });

    /* ── نقطه‌ها ── */
    const dotsWrap = $('gwDots');
    const dots = ITEMS.map((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'اثر ' + (i + 1));
      b.onclick = () => go(i);
      if(dotsWrap) dotsWrap.appendChild(b);
      return b;
    });

    /* ── عنوان‌های واقعی ── */
    let titles = {};
    fetch('content/works/fa.json')
      .then(r => r.json())
      .then(d => { titles = d || {}; active = -1; })
      .catch(() => {});

    let maxW = 300, maxH = 375, gap = 360, dirty = true, lastPos = -99;

    function fit(i){
      const r = ratio[i], k = MAT * Math.min(r, 1);
      const s = Math.min((maxW - 2 * BORDER) / (r + 2 * k), (maxH - 2 * BORDER) / (1 + 2 * k));
      const w = s * r, h = s, p = s * k;
      const mat = frames[i].firstChild;
      const box = mat.firstChild;
      mat.style.padding = p + 'px';
      box.style.width = w + 'px';
      box.style.height = h + 'px';
      wid[i] = w + 2 * p + 2 * BORDER;
      gap = wid.reduce((a, b) => a + b, 0) / N + maxH * GAP;
    }

    function size(){
      maxH = Math.min(innerHeight * .5, innerWidth * .9);
      maxW = Math.min(maxH * 1.45, innerWidth * .78);
      root.style.setProperty('--W', maxW + 'px');
      root.style.setProperty('--H', maxH + 'px');
      root.style.setProperty('--B', BORDER + 'px');
      frames.forEach((_, i) => fit(i));
      dirty = true;
    }
    size();
    addEventListener('resize', size);

    /* ── وضعیت ── */
    let pos = 0, target = 0, elapsed = 0;
    let dragging = false, paused = false, active = -1;
    let moved = 0, lastX = 0;
    let last = performance.now();

    const wrap = x => ((x + N / 2) % N + N) % N - N / 2;
    const mod = x => ((x % N) + N) % N;

    function go(i){
      const base = Math.round(target);
      target = base + wrap(i - base);
      elapsed = 0;
    }
    function step(d){
      target = Math.round(target) + d;
      elapsed = 0;
    }

    $('gwNext').onclick = () => step(1);
    $('gwPrev').onclick = () => step(-1);

    addEventListener('keydown', e => {
      if(e.key === 'ArrowRight') step(1);
      else if(e.key === 'ArrowLeft') step(-1);
      else if(e.key === 'Escape') closeZoom();
    });

    let wheelLock = 0;
    addEventListener('wheel', e => {
      const now = Date.now();
      if(now - wheelLock < 600 || Math.abs(e.deltaY + e.deltaX) < 8) return;
      wheelLock = now;
      step((e.deltaY + e.deltaX) > 0 ? 1 : -1);
    }, { passive: true });

    /* ── درگ و لمس ── */
    stage.addEventListener('pointerdown', e => {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      stage.classList.add('drag');
    });
    addEventListener('pointermove', e => {
      if(!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      moved += Math.abs(dx);
      target -= dx / gap;
      pos = target;
      elapsed = 0;
    });
    addEventListener('pointerup', () => {
      if(!dragging) return;
      dragging = false;
      stage.classList.remove('drag');
      target = Math.round(target);
    });

    /* ── کلیک روی فریم ── */
    frames.forEach((f, i) => f.addEventListener('click', () => {
      if(moved > 6) return;
      if(i === mod(Math.round(pos))) openZoom(i);
      else go(i);
    }));

    /* ── pause روی هاور ── */
    stage.addEventListener('mouseenter', () => paused = true);
    stage.addEventListener('mouseleave', () => paused = false);

    /* ── Zoom ── */
    function openZoom(i){
      const z = $('gwZoom');
      const img = z.querySelector('img');
      img.src = ITEMS[i].src;
      z.classList.add('open');
      paused = true;
    }
    function closeZoom(){
      const z = $('gwZoom');
      z.classList.remove('open');
      paused = false;
    }
    $('gwZoom').onclick = closeZoom;

    /* ── پلاک ── */
    function setPlaque(i){
      const item = ITEMS[i];
      const t = (titles[item.id] && titles[item.id].title) || ('اثر ' + fa(i + 1));
      const h = $('gwTitle');
      const m = $('gwMeta');
      h.classList.add('gw-sw');
      m.classList.add('gw-sw');
      setTimeout(() => {
        h.textContent = t;
        m.textContent = (CATEGORY_LABEL[item.category] || item.category) + ' · ' + item.year;
        h.classList.remove('gw-sw');
        m.classList.remove('gw-sw');
      }, 220);
      $('gwLot').textContent = 'LOT ' + fa(String(i + 1).padStart(2, '0'));
      frames.forEach((f, k) => f.classList.toggle('on', k === i));
      dots.forEach((d, k) => d.classList.toggle('on', k === i));
    }

    /* ── لوپ ── */
    (function loop(now){
      requestAnimationFrame(loop);
      const dt = Math.min(now - last, 60);
      last = now;

      if(!paused && !dragging && !reduce){
        elapsed += dt;
        if(elapsed >= DWELL){
          target = Math.round(target) + 1;
          elapsed = 0;
        }
      }

      if(!dragging) pos += (target - pos) * (1 - Math.exp(-dt / 150));
      const bar = $('gwBar');
      if(bar) bar.style.width = (reduce ? 0 : elapsed / DWELL * 100) + '%';

      if(dirty || Math.abs(pos - lastPos) > 1e-4){
        const p0 = Math.floor(pos);
        const fr = pos - p0;
        const m = maxH * GAP;
        const off = {};
        off[0] = 0;
        for(let j = 1; j <= 5; j++) off[j] = off[j - 1] + (wid[mod(p0 + j - 1)] + wid[mod(p0 + j)]) / 2 + m;
        for(let j = -1; j >= -5; j--) off[j] = off[j + 1] - (wid[mod(p0 + j)] + wid[mod(p0 + j + 1)]) / 2 - m;

        frames.forEach((f, i) => {
          const j = ((i - p0 + N / 2) % N + N) % N - N / 2;
          const d = j - fr;
          const a = Math.abs(d);
          if(a > 3.7){ f.style.visibility = 'hidden'; return; }
          f.style.visibility = 'visible';
          const x = off[j] - fr * off[1];
          const z = -Math.min(a, 3) * 150;
          const ry = -Math.max(-2, Math.min(2, d)) * 17;
          const s = 1 - Math.min(a, 2) * .15;
          f.style.transform = `translate(-50%,-50%) translate3d(${x}px,0,${z}px) rotateY(${ry}deg) scale(${s})`;
          f.style.opacity = a < 2.5 ? 1 : Math.max(0, 1 - (a - 2.5) / 1.2);
          f.style.filter = `brightness(${1 - Math.min(a, 1) * .55})`;
          f.style.zIndex = 100 - Math.round(a * 10);
        });
        lastPos = pos;
        dirty = false;
      }

      const idx = mod(Math.round(pos));
      if(idx !== active){
        active = idx;
        setPlaque(idx);
      }
    })(performance.now());
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 200));
  } else {
    setTimeout(init, 200);
  }
})();