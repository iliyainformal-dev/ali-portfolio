/* ═══════════════════════════════════════════
   🌍 motion.js — کره زمین سه‌بعدی (نسخه‌ی ۲) + tilt گالری
   - نقشه‌ی قاره‌ها و مرزهای کشورها روی کره (ساخته‌شده با Canvas، بدون عکس آماده)
   - کشوری که کاربر انتخاب کرده روشن و درخشان میشه + چشمک‌زن (beacon)
   - کره به سمت کشور کاربر می‌چرخه، با موس/ژیروسکوپ زنده‌ست
   - ستاره، هاله‌ی جو، مدار و ماهواره
   برای خاموش‌کردن: خط <script src="js/motion.js"> رو از index.html پاک کن.
   ═══════════════════════════════════════════ */
(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine   = matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (reduce) return;

  const css = document.createElement('style');
  css.textContent = `
    .hero-3d{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0;transition:opacity 2s ease}
    .hero-3d.on{opacity:1}
    @media(max-width:700px){.hero-3d.on{opacity:.45}}
    .hero > :not(.hero-glow):not(.hero-3d){position:relative;z-index:1}
    .art{will-change:transform;transition:transform .25s ease-out, box-shadow .25s}
    .art.tilting{transition:transform .08s linear;box-shadow:0 20px 50px rgba(0,0,0,.55),0 0 0 1px rgba(212,165,116,.25)}
  `;
  document.head.appendChild(css);

  /* ── Tilt گالری ── */
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

  const hero = document.querySelector('.hero');
  if (!hero) return;

  /* ── لود Three.js و بعد داده‌ی کشورها ── */
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload = async () => {
    const geo = await loadCountries();          // اگه لود نشد null میشه و کره‌ی ساده نشون میده
    try { startScene(geo); } catch (err) { console.warn('3D globe disabled:', err); }
  };
  document.head.appendChild(s);

  async function loadCountries(){
    const urls = [
      'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_admin_0_countries.geojson',
      'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson'
    ];
    for (const u of urls) {
      try { const r = await fetch(u); if (r.ok) return await r.json(); } catch (e) {}
    }
    console.warn('country map data not loaded');
    return null;
  }

  const codeOf = f => (f.properties.ISO_A2_EH && f.properties.ISO_A2_EH !== '-99') ? f.properties.ISO_A2_EH : f.properties.ISO_A2;
  const polysOf = f => f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;

  /* ── ساخت بافت نقشه با Canvas (equirectangular) ── */
  function drawMaps(geo, W, H, selected){
    const base = document.createElement('canvas'); base.width = W; base.height = H;
    const hi   = document.createElement('canvas'); hi.width = W; hi.height = H;
    const c = base.getContext('2d'), h = hi.getContext('2d');
    const px = (lng, lat) => [(lng + 180) / 360 * W, (90 - lat) / 180 * H];
    const trace = (ctx, f) => {
      ctx.beginPath();
      polysOf(f).forEach(poly => poly.forEach(ring => {
        ring.forEach(([lng, lat], i) => { const [x, y] = px(lng, lat); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
        ctx.closePath();
      }));
    };

    // اقیانوس
    const og = c.createLinearGradient(0, 0, 0, H);
    og.addColorStop(0, '#0d0d18'); og.addColorStop(.5, '#0a0a12'); og.addColorStop(1, '#0d0d18');
    c.fillStyle = og; c.fillRect(0, 0, W, H);

    // شبکه‌ی طول و عرض جغرافیایی
    c.strokeStyle = 'rgba(212,165,116,.07)'; c.lineWidth = W / 2400;
    for (let lng = -180; lng <= 180; lng += 15) { const [x] = px(lng, 0); c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
    for (let lat = -75; lat <= 75; lat += 15)   { const [, y] = px(0, lat); c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }

    if (!geo) return { base, hi };
    const lw = W / 2800;

    // خشکی‌ها (با گرادیان گرم) + درخشش ساحل
    geo.features.forEach(f => {
      if (f.properties.ADMIN === 'Antarctica') { trace(c, f); c.fillStyle = '#17151a'; c.fill(); return; }
      trace(c, f);
      c.fillStyle = '#241e18'; c.fill();
    });
    c.save(); c.shadowColor = 'rgba(212,165,116,.55)'; c.shadowBlur = W / 400;
    c.strokeStyle = 'rgba(212,165,116,.28)'; c.lineWidth = lw * 1.6;
    geo.features.forEach(f => { trace(c, f); c.stroke(); });
    c.restore();
    // مرز کشورها (نازک و واضح)
    c.strokeStyle = 'rgba(212,165,116,.55)'; c.lineWidth = lw;
    geo.features.forEach(f => { trace(c, f); c.stroke(); });

    // کشور انتخابی: پر شدن رنگی + خط درخشان
    let center = null;
    geo.features.filter(f => selected && codeOf(f) === selected).forEach(f => {
      trace(h, f);
      const g = h.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, 'rgba(230,57,70,.78)'); g.addColorStop(1, 'rgba(212,165,116,.7)');
      h.fillStyle = g; h.fill();
      h.save(); h.shadowColor = '#ffd9a0'; h.shadowBlur = W / 220;
      h.strokeStyle = '#ffe2b8'; h.lineWidth = lw * 3.2; h.stroke(); h.restore();
      // مرکز = وسط کادر بزرگ‌ترین تکه‌ی کشور
      const big = polysOf(f).reduce((a, b) => (b[0].length > a[0].length ? b : a));
      const lngs = big[0].map(p => p[0]), lats = big[0].map(p => p[1]);
      center = [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lngs) + Math.max(...lngs)) / 2];
    });
    return { base, hi, center };
  }

  function startScene(geo){
    const small = innerWidth < 700;
    const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:!small });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.domElement.className = 'hero-3d';
    hero.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    cam.position.z = 17;
    const R = 3.8;
    const aniso = renderer.capabilities.getMaxAnisotropy();

    const root = new THREE.Group(); scene.add(root);     // جای کل کره (چپ/راست)
    const earth = new THREE.Group(); root.add(earth);    // این می‌چرخه

    const selected = localStorage.getItem('selectedCountry');
    const maps = drawMaps(geo, small ? 2048 : 4096, small ? 1024 : 2048, selected);
    const mkTex = cv => { const t = new THREE.CanvasTexture(cv); t.anisotropy = aniso; return t; };

    /* کره: شیدر با سایه‌ی لبه + درخشش طلایی کنار */
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(R, small ? 56 : 96, small ? 40 : 64),
      new THREE.ShaderMaterial({
        uniforms: { map: { value: mkTex(maps.base) } },
        vertexShader: `varying vec2 vUv; varying vec3 vN;
          void main(){ vUv=uv; vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
        fragmentShader: `uniform sampler2D map; varying vec2 vUv; varying vec3 vN;
          void main(){
            vec4 c=texture2D(map,vUv);
            float f=clamp(dot(vN,vec3(0.,0.,1.)),0.,1.);
            float shade=.30+.70*pow(f,.55);
            float rim=pow(1.-f,3.);
            gl_FragColor=vec4(c.rgb*shade+vec3(.83,.62,.42)*rim*.5,1.);
          }`
      }));
    earth.add(globe);

    /* لایه‌ی کشور انتخابی (می‌درخشه و نبض می‌زنه) */
    let hiMat = null;
    if (selected && geo) {
      hiMat = new THREE.MeshBasicMaterial({ map: mkTex(maps.hi), transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, opacity:.9 });
      earth.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.003, 96, 64), hiMat));
    }

    /* هاله‌ی جو */
    root.add(new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.2, 64, 48),
      new THREE.ShaderMaterial({
        transparent:true, side:THREE.BackSide, depthWrite:false, blending:THREE.AdditiveBlending,
        vertexShader: `varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
        fragmentShader: `varying vec3 vN; void main(){
            float i=pow(clamp(.66-dot(vN,vec3(0.,0.,1.)),0.,1.),3.);
            gl_FragColor=vec4(.90,.45,.35,1.)*i*1.1; }`
      })));

    /* چشمک‌زن (beacon) روی کشور انتخابی */
    const ll2v = (lat, lng, r) => {
      const phi = (90 - lat) * Math.PI / 180, th = (lng + 180) * Math.PI / 180;
      return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
    };
    const rings = [];
    let face = null;                              // زاویه‌ای که کره باید بچرخه تا کشور رو به دوربین باشه
    if (maps.center) {
      const [lat, lng] = maps.center;
      const p = ll2v(lat, lng, R * 1.01);
      const pin = new THREE.Group();
      pin.position.copy(p);
      pin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), p.clone().normalize());
      pin.add(new THREE.Mesh(new THREE.SphereGeometry(.07, 16, 16), new THREE.MeshBasicMaterial({ color:0xfff0d0 })));
      for (let i = 0; i < 3; i++) {
        const m = new THREE.Mesh(new THREE.RingGeometry(.1, .13, 48),
          new THREE.MeshBasicMaterial({ color:0xe63946, transparent:true, side:THREE.DoubleSide, depthWrite:false, blending:THREE.AdditiveBlending }));
        m.userData.off = i / 3; pin.add(m); rings.push(m);
      }
      earth.add(pin);
      face = { px: p.x, pz: p.z, lat };
    }

    /* مدار و ماهواره */
    const orbit = new THREE.Group(); orbit.rotation.set(1.15, 0, .35); root.add(orbit);
    const OR = R * 1.5, pts = [];
    for (let i = 0; i <= 128; i++) { const a = i / 128 * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * OR, Math.sin(a) * OR, 0)); }
    orbit.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color:0xd4a574, transparent:true, opacity:.22 })));
    const sat = new THREE.Mesh(new THREE.SphereGeometry(.09, 12, 12), new THREE.MeshBasicMaterial({ color:0xe63946 }));
    const satGlow = new THREE.Mesh(new THREE.SphereGeometry(.22, 12, 12),
      new THREE.MeshBasicMaterial({ color:0xe63946, transparent:true, opacity:.25, depthWrite:false, blending:THREE.AdditiveBlending }));
    sat.add(satGlow); orbit.add(sat);

    /* ستاره‌ها (دو لایه: طلایی و سفید) */
    const mkStars = (n, color, size, op) => {
      const a = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { a[i*3] = (Math.random() - .5) * 90; a[i*3+1] = (Math.random() - .5) * 55; a[i*3+2] = (Math.random() - .5) * 60 - 20; }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(a, 3));
      const p = new THREE.Points(g, new THREE.PointsMaterial({ color, size, transparent:true, opacity:op, depthWrite:false }));
      scene.add(p); return p;
    };
    const starsA = mkStars(small ? 220 : 520, 0xd4a574, .07, .6);
    const starsB = mkStars(small ? 120 : 260, 0xffffff, .045, .45);

    /* جای کره (راست‌چین → چپ) */
    let baseX = 0;
    function place(){
      const rtl = document.documentElement.dir === 'rtl';
      baseX = small ? 0 : (rtl ? -5.6 : 5.6);
      root.position.set(baseX, small ? 1.2 : 0, 0);
      const k = small ? .8 : 1; root.scale.set(k, k, k);
    }
    function resize(){
      const w = hero.clientWidth, h = hero.clientHeight;
      renderer.setSize(w, h, false);
      cam.aspect = w / h; cam.updateProjectionMatrix();
    }
    place(); resize();
    addEventListener('resize', resize);
    document.addEventListener('languageChanged', place);

    /* موس و ژیروسکوپ */
    let mx = 0, my = 0;
    addEventListener('mousemove', e => { mx = e.clientX / innerWidth * 2 - 1; my = e.clientY / innerHeight * 2 - 1; });
    addEventListener('deviceorientation', e => {
      if (e.gamma == null) return;
      mx = Math.max(-1, Math.min(1, e.gamma / 30));
      my = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    });

    let visible = true;
    new IntersectionObserver(en => { visible = en[0].isIntersecting; }).observe(hero);

    /* چرخش: اول از یه زاویه‌ی دور تا کشور کاربر می‌چرخه، بعد دور اون زنده می‌مونه */
    const h1 = hero.querySelector('h1');
    let t0 = null, sx = 0, sy = 0, free = Math.random() * 6;
    const ease = x => 1 - Math.pow(1 - x, 4);

    (function loop(t){
      requestAnimationFrame(loop);
      if (!visible || document.hidden) return;

      if (t0 === null && document.body.classList.contains('loaded')) t0 = t;   // بعد از splash شروع کن
      const k = t0 === null ? 0 : ease(Math.min((t - t0) / 3800, 1));
      sx += (mx - sx) * .05; sy += (my - sy) * .05;

      let ry, rx;
      if (face) {
        // کره باید طوری بچرخه که کشور رو به دوربین باشه (دوربین از نگاه مرکز کره، کمی کج دیده میشه)
        const phiP = Math.atan2(face.px, face.pz);
        const phiD = Math.atan2(-baseX, cam.position.z);
        const target = phiD - phiP;
        ry = target + (1 - k) * (-Math.PI * 1.6) + Math.sin(t * .00025) * .45 + sx * .55;
        rx = face.lat * Math.PI / 180 * .55 * k + sy * .3;
      } else {
        free += .0016;
        ry = free + sx * .55; rx = .25 + sy * .3;
      }
      earth.rotation.set(rx, ry, 0);

      if (hiMat) hiMat.opacity = .75 + Math.sin(t * .003) * .22;
      rings.forEach(m => {
        const ph = ((t * .00055) + m.userData.off) % 1;
        const sc = .6 + ph * 5;
        m.scale.set(sc, sc, sc);
        m.material.opacity = (1 - ph) * .9;
      });
      const a = t * .0006;
      sat.position.set(Math.cos(a) * OR, Math.sin(a) * OR, 0);
      satGlow.scale.setScalar(1 + Math.sin(t * .006) * .25);

      starsA.rotation.y = t * .00002 + sx * .04;
      starsB.rotation.y = -t * .000012 + sx * .02;

      cam.position.x += (sx * 1.6 - cam.position.x) * .08;
      cam.position.y += (-sy * 1.0 - cam.position.y) * .08;
      cam.lookAt(0, 0, 0);

      if (h1 && fine) h1.style.transform = `translate3d(${mx * -8}px, ${my * -5}px, 0)`;
      renderer.render(scene, cam);
    })(0);

    requestAnimationFrame(() => renderer.domElement.classList.add('on'));
  }
})();