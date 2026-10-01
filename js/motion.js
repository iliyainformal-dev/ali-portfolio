/* ═══════════════════════════════════════════
   ✨ motion.js — موشن سه‌بعدی سایت علی قائمی
   1) صحنه‌ی سه‌بعدی پشت هیرو (ذرات طلایی + فرم سیمی قرمز)
   2) کج‌شدن سه‌بعدی کارت‌های گالری با موس
   اگه خواستی خاموشش کنی: فقط خط <script src="js/motion.js"> رو از index.html پاک کن.
   ═══════════════════════════════════════════ */
(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine   = matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (reduce) return;                       // کاربرهایی که انیمیشن نمی‌خوان

  /* ── استایل‌های لازم (خودش اضافه میشه، نیازی به دست‌زدن به style.css نیست) ── */
  const css = document.createElement('style');
  css.textContent = `
    .hero-3d{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0;transition:opacity 1.6s ease}
    .hero-3d.on{opacity:1}
    .hero > :not(.hero-glow):not(.hero-3d){position:relative;z-index:1}
    .art{will-change:transform;transition:transform .25s ease-out, box-shadow .25s}
    .art.tilting{transition:transform .08s linear;box-shadow:0 20px 50px rgba(0,0,0,.55),0 0 0 1px rgba(212,165,116,.25)}
  `;
  document.head.appendChild(css);

  /* ── ۲) کج‌شدن کارت‌ها (کار می‌کنه حتی برای کارت‌هایی که بعداً ساخته میشن) ── */
  if (fine) {
    let cur = null;
    const reset = c => { if (c) { c.classList.remove('tilting'); c.style.transform = ''; } };
    document.addEventListener('mousemove', e => {
      const card = e.target.closest && e.target.closest('.art');
      if (card !== cur) { reset(cur); cur = card; }
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.classList.add('tilting');
      card.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.03)`;
    });
    document.addEventListener('mouseleave', () => { reset(cur); cur = null; });
  }

  /* ── ۱) صحنه‌ی سه‌بعدی هیرو ── */
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload = () => { try { startScene(); } catch (err) { console.warn('3D hero disabled:', err); } };
  document.head.appendChild(s);

  function startScene(){
    const small = innerWidth < 700;
    const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:!small });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.domElement.className = 'hero-3d';
    hero.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    cam.position.z = 14;

    // ذرات طلایی
    const N = small ? 350 : 900, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i*3]   = (Math.random() - .5) * 46;
      pos[i*3+1] = (Math.random() - .5) * 26;
      pos[i*3+2] = (Math.random() - .5) * 20;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const dots = new THREE.Points(g, new THREE.PointsMaterial({ color:0xd4a574, size:.07, transparent:true, opacity:.8 }));
    scene.add(dots);

    // فرم سیمی قرمز + یک فرم طلایی کوچیک‌تر
    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.6, .7, small ? 90 : 160, 16),
      new THREE.MeshBasicMaterial({ color:0xe63946, wireframe:true, transparent:true, opacity: small ? .22 : .35 }));
    const ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.1, 1),
      new THREE.MeshBasicMaterial({ color:0xd4a574, wireframe:true, transparent:true, opacity:.5 }));
    scene.add(knot, ico);

    // سایت فارسی راست‌چینه → فرم سمت چپ؛ زبان‌های دیگه برعکس
    function place(){
      const rtl = document.documentElement.dir === 'rtl';
      const side = small ? 0 : (rtl ? -1 : 1);
      knot.position.set(side * 6.5, 0, 0);
      ico.position.set(side * 3.2, 3.6, 3);
    }
    function resize(){
      const w = hero.clientWidth, h = hero.clientHeight;
      renderer.setSize(w, h, false);
      cam.aspect = w / h; cam.updateProjectionMatrix();
    }
    place(); resize();
    addEventListener('resize', resize);
    document.addEventListener('languageChanged', place);

    // موس و اسکرول
    let mx = 0, my = 0;
    addEventListener('mousemove', e => { mx = e.clientX / innerWidth * 2 - 1; my = e.clientY / innerHeight * 2 - 1; });
    addEventListener('deviceorientation', e => {            // موبایل: با کج‌کردن گوشی
      if (e.gamma == null) return;
      mx = Math.max(-1, Math.min(1, e.gamma / 30)); my = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    });

    // فقط وقتی هیرو دیده میشه رندر کن (باتری و سرعت)
    let visible = true;
    new IntersectionObserver(en => { visible = en[0].isIntersecting; }).observe(hero);

    const h1 = hero.querySelector('h1');
    (function loop(t){
      requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const sy = scrollY * 0.008;
      knot.rotation.x = t * .00018 + my * .3;
      knot.rotation.y = t * .00026 + mx * .4;
      ico.rotation.x = -t * .0004;  ico.rotation.y = t * .0005;
      dots.rotation.y = t * .00003 + mx * .05;
      knot.position.y = ico.position.y * 0 - sy;
      cam.position.x += (mx * 1.6 - cam.position.x) * .04;
      cam.position.y += (-my * 1.0 - cam.position.y) * .04;
      cam.lookAt(0, 0, 0);
      if (h1 && fine) h1.style.transform = `translate3d(${mx * -8}px, ${my * -5}px, 0)`;
      renderer.render(scene, cam);
    })(0);

    requestAnimationFrame(() => renderer.domElement.classList.add('on'));
  }
})();