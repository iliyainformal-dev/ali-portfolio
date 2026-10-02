/* ═══════════════════════════════════════════
   🎡 Featured Ring Gallery
   ═══════════════════════════════════════════ */
(function(){
  function init(){
    if(typeof WORKS === 'undefined'){
      console.warn('featured-ring: works.js لود نشده');
      return;
    }
    const stage = document.getElementById('frStage');
    const ring  = document.getElementById('frRing');
    const countEl = document.getElementById('frCount');
    if(!stage || !ring) return;
    if(ring.dataset.built === '1') return;
    ring.dataset.built = '1';

    const FEATURED_COUNT = 12;
    const groups = {};
    WORKS.forEach(w => {
      if(!groups[w.category]) groups[w.category] = [];
      groups[w.category].push(w);
    });
    const cats = Object.keys(groups);
    const items = [];
    let idx = 0, safety = 0;
    while(items.length < FEATURED_COUNT && items.length < WORKS.length && safety < 500){
      const cat = cats[idx % cats.length];
      const arr = groups[cat];
      if(arr && arr.length) items.push(arr.shift());
      idx++;
      safety++;
      if(cats.every(c => !groups[c].length)) break;
    }

    const N = items.length;
    const step = 360 / N;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

    const cards = items.map((w, i) => {
      const c = document.createElement('div');
      c.className = 'fr-card';
      c.style.setProperty('--hue', (i * 360 / N) % 360);

      const img = new Image();
      img.src = w.image;
      img.alt = '';
      img.loading = 'lazy';
      img.draggable = false;
      img.onerror = () => img.remove();

      c.appendChild(img);
      ring.appendChild(c);
      return c;
    });

    let R = 0, rot = reduce ? 0 : -220, target = 0, vel = 0, tiltX = 12, mx = 0, my = 0;
    let dragging = false, moved = 0, lastX = 0, idle = 0, snapping = true, active = -1;

    function layout(){
      const w = Math.min(Math.max(stage.clientWidth * 0.18, 130), 220);
      ring.style.width = w + 'px';
      ring.style.height = (w * 1.3) + 'px';
      R = Math.round((w / 2) / Math.tan(Math.PI / N) * 1.02);
      cards.forEach((c, i) => {
        c.style.transform = `rotateY(${i * step}deg) translateZ(${R}px)`;
      });
    }
    layout();
    addEventListener('resize', layout);

    /* ⚡ درگ با موس + لمس (اصلاح‌شده برای موبایل) */
    stage.addEventListener('pointerdown', e => {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      snapping = false;
      vel = 0;
      stage.classList.add('drag');
      if(stage.setPointerCapture) {
        try { stage.setPointerCapture(e.pointerId); } catch(err) {}
      }
    });

    stage.addEventListener('pointermove', e => {
      mx = e.clientX / innerWidth * 2 - 1;
      my = e.clientY / innerHeight * 2 - 1;
      if(!dragging) return;
      if(e.cancelable) e.preventDefault();
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      moved += Math.abs(dx);
      rot += dx * 0.25;
      vel = dx * 0.25;
      idle = 0;
    }, { passive: false });

    stage.addEventListener('pointerup', () => {
      dragging = false;
      stage.classList.remove('drag');
    });
    stage.addEventListener('pointercancel', () => {
      dragging = false;
      stage.classList.remove('drag');
    });

    cards.forEach((c, i) => c.addEventListener('click', () => {
      if(moved > 6) return;
      const t = -i * step;
      const k = Math.round((rot - t) / 360);
      target = t + k * 360;
      snapping = true;
    }));

    addEventListener('keydown', e => {
      if(e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const dir = e.key === 'ArrowLeft' ? -1 : 1;
      target = Math.round(rot / step) * step + dir * step;
      snapping = true;
    });

    /* ⚡ فقط وقتی دیده میشه رندر کن + موبایل: هر ۲ فریم */
    const isMobile = innerWidth < 700;
    let visible = true;
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
    }, { threshold: 0 }).observe(stage);

    let frameSkip = 0;

    (function loop(){
      requestAnimationFrame(loop);

      if(!visible || document.hidden) return;

      if(isMobile){
        frameSkip++;
        if(frameSkip % 2 !== 0) return;
      }

      if(snapping){
        rot += (target - rot) * 0.08;
        if(Math.abs(target - rot) < 0.05) snapping = false;
      } else if(!dragging){
        rot += vel;
        vel *= 0.94;
        idle++;
        if(Math.abs(vel) < 0.02 && idle > 90 && !reduce) rot += 0.06;
      }

      const tx = isMobile ? 8 : (10 + my * -8);
      const ty = isMobile ? 0 : (mx * 10);
      tiltX += (tx - tiltX) * 0.06;
      ring.style.transform = `translateZ(${-R}px) rotateX(${-tiltX}deg) rotateY(${rot + ty}deg)`;

      let best = -2, bi = 0;
      cards.forEach((c, i) => {
        const f = Math.cos((i * step + rot) * Math.PI / 180);
        const k = (f + 1) / 2;
        c.style.opacity = (0.25 + 0.75 * k).toFixed(2);
        c.style.filter = `brightness(${(0.4 + 0.6 * k).toFixed(2)})`;
        if(f > best){ best = f; bi = i; }
      });

      if(bi !== active){
        active = bi;
        cards.forEach((c, i) => c.classList.toggle('front', i === bi));
        if(countEl) countEl.textContent = fa(bi + 1) + ' / ' + fa(N);
      }
    })();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 200));
  } else {
    setTimeout(init, 200);
  }
})();