/* ═══════════════════════════════════════════
   🌍 motion.js — کره زمین سه‌بعدی + tilt گالری
   ═══════════════════════════════════════════ */
(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine   = matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (reduce) return;

  const css = document.createElement('style');
  css.textContent = `
    .hero-3d{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0;transition:opacity 1.6s ease}
    .hero-3d.on{opacity:1}
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

  /* ── کره زمین سه‌بعدی ── */
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload = () => { try { startScene(); } catch (err) { console.warn('3D globe disabled:', err); } };
  document.head.appendChild(s);

  /* ── مختصات کشورها [lat, lng] ── */
  const COORDS = {
    IR:[32.42,53.68],AF:[33.93,67.70],TJ:[38.86,71.27],
    SA:[23.88,45.07],AE:[23.42,53.84],EG:[26.82,30.80],
    DZ:[28.03,1.65],MA:[31.79,-7.09],IQ:[33.22,43.67],
    JO:[30.58,36.23],KW:[29.31,47.48],LB:[33.85,35.86],
    LY:[26.33,17.22],OM:[21.51,55.92],PS:[31.95,35.23],
    QA:[25.35,51.18],SD:[12.86,30.21],SY:[34.80,38.99],
    TN:[33.88,9.53],YE:[15.55,48.51],BH:[25.93,50.63],
    RU:[61.52,105.31],BY:[53.70,27.95],KZ:[48.01,66.92],
    KG:[41.20,74.76],UZ:[41.37,64.58],TM:[38.96,59.55],
    DE:[51.16,10.45],AT:[47.51,14.55],CH:[46.81,8.22],
    LI:[47.16,9.55],LU:[49.81,6.12],
    CN:[35.86,104.19],TW:[23.69,120.96],HK:[22.39,114.10],
    MO:[22.19,113.54],SG:[1.35,103.81],JP:[36.20,138.25],
    KR:[35.90,127.76],MN:[46.86,103.84],
    FR:[46.22,2.21],BE:[50.50,4.46],MC:[43.73,7.42],
    SN:[14.49,-14.45],CI:[7.54,-5.54],
    CA:[56.13,-106.34],US:[37.09,-95.71],GB:[55.37,-3.43],
    AU:[-25.27,133.77],NZ:[-40.90,174.88],IE:[53.41,-8.24],
    ZA:[-30.55,22.93],IN:[20.59,78.96],PK:[30.37,69.34],
    NG:[9.08,8.67],KE:[-0.02,37.90],ET:[9.14,40.48],
    TZ:[-6.36,34.88],GH:[7.94,-1.02],
    IT:[41.87,12.56],ES:[40.46,-3.74],PT:[39.39,-8.22],
    NL:[52.13,5.29],SE:[60.12,18.64],NO:[60.47,8.46],
    DK:[56.26,9.50],FI:[61.92,25.74],PL:[51.91,19.14],
    GR:[39.07,21.82],TR:[38.96,35.24],IL:[31.04,34.85],
    TH:[15.87,100.99],VN:[14.05,108.27],MY:[4.21,101.97],
    ID:[-0.78,113.92],PH:[12.87,121.77],
    BR:[-14.23,-51.92],AR:[-38.41,-63.61],MX:[23.63,-102.55],
    CL:[-35.67,-71.54],CO:[4.57,-74.29],PE:[-9.19,-75.01],
    VE:[6.42,-66.58],EC:[-1.83,-78.18],CU:[21.52,-77.78],
    GT:[15.78,-90.23],CR:[9.74,-83.75],PA:[8.53,-80.78],
    DO:[18.73,-70.16],JM:[18.10,-77.29],HT:[18.97,-72.28],
    UA:[48.37,31.16],RO:[45.94,24.96],BG:[42.73,25.48],
    CZ:[49.81,15.47],HU:[47.16,19.50],HR:[45.10,15.20],
    RS:[44.01,21.00],GE:[42.31,43.35],AM:[40.06,45.03],
    AZ:[40.14,47.57],IS:[64.96,-19.02],MT:[35.93,14.37],
    CY:[35.12,33.42],NP:[28.39,84.12],BD:[23.68,90.35],
    LK:[7.87,80.77],MM:[21.91,95.96],KH:[12.57,104.99],
    LA:[19.86,102.50],BN:[4.54,114.73],FJ:[-17.71,178.07]
  };

  function startScene(){
    const small = innerWidth < 700;
    const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:!small });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.domElement.className = 'hero-3d';
    hero.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
    cam.position.z = 16;

    const R = 3.6; // شعاع کره

    /* ── کره زمین ── */
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    const earthTex = loader.load(
      'https://cdn.jsdelivr.net/npm/three-globe@2.24.10/example/img/earth-dark.jpg',
      undefined,
      undefined,
      () => { console.warn('earth texture failed'); }
    );

    const earthGeo = new THREE.SphereGeometry(R, small ? 48 : 72, small ? 32 : 48);
    const earthMat = new THREE.MeshBasicMaterial({ map: earthTex, transparent: true, opacity: 0.95 });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    /* ── هاله اطراف کره (atmosphere) ── */
    const atmosGeo = new THREE.SphereGeometry(R * 1.08, 40, 40);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0xd4a574,
      transparent: true,
      opacity: 0.06,
      side: THREE.BackSide,
      depthWrite: false
    });
    const atmos = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmos);

    /* ── کره سیمی طلایی (تزئینی) ── */
    const wireGeo = new THREE.SphereGeometry(R * 1.004, 24, 16);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xd4a574,
      wireframe: true,
      transparent: true,
      opacity: 0.06
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    /* ── مارکر کشور انتخابی ── */
    let marker = null, halo = null;

    function latLngToVec3(lat, lng, r){
      const phi   = (90 - lat) * Math.PI / 180;
      const theta = (lng + 180) * Math.PI / 180;
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
         r * Math.cos(phi),
         r * Math.sin(phi) * Math.sin(theta)
      );
    }

    function placeMarker(){
      // پاک کردن قبلی
      if (marker){ earth.remove(marker); marker.geometry.dispose(); marker.material.dispose(); marker = null; }
      if (halo)  { earth.remove(halo);   halo.geometry.dispose();   halo.material.dispose();   halo = null; }

      const code = localStorage.getItem('selectedCountry');
      if (!code || !COORDS[code]) return;

      const [lat, lng] = COORDS[code];
      const pos = latLngToVec3(lat, lng, R * 1.015);

      // نقطه طلایی
      marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xd4a574 })
      );
      marker.position.copy(pos);
      earth.add(marker);

      // هاله قرمز پالسی
      halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 20, 20),
        new THREE.MeshBasicMaterial({
          color: 0xe63946,
          transparent: true,
          opacity: 0.35,
          depthWrite: false
        })
      );
      halo.position.copy(pos);
      earth.add(halo);
    }

    placeMarker();

    // اگه کاربر زبان عوض کرد (کشور عوض نمیشه ولی بعداً ممکنه)
    document.addEventListener('languageChanged', () => setTimeout(placeMarker, 100));

    /* ── ستاره‌های پس‌زمینه ── */
    const N = small ? 250 : 600;
    const posArr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      posArr[i*3]   = (Math.random() - .5) * 80;
      posArr[i*3+1] = (Math.random() - .5) * 50;
      posArr[i*3+2] = (Math.random() - .5) * 60 - 15;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const stars = new THREE.Points(g, new THREE.PointsMaterial({
      color: 0xd4a574, size: .06, transparent: true, opacity: .55
    }));
    scene.add(stars);

    /* ── موقعیت کره (چپ/راست با زبان) ── */
    let baseX = 0;
    function place(){
      const rtl = document.documentElement.dir === 'rtl';
      baseX = small ? 0 : (rtl ? -5.8 : 5.8);
      earth.position.x = baseX;
      atmos.position.x = baseX;
      wire.position.x  = baseX;
    }
    function resize(){
      const w = hero.clientWidth, h = hero.clientHeight;
      renderer.setSize(w, h, false);
      cam.aspect = w / h; cam.updateProjectionMatrix();
    }
    place(); resize();
    addEventListener('resize', resize);
    document.addEventListener('languageChanged', place);

    /* ── موس و ژیروسکوپ ── */
    let mx = 0, my = 0;
    addEventListener('mousemove', e => {
      mx = e.clientX / innerWidth * 2 - 1;
      my = e.clientY / innerHeight * 2 - 1;
    });
    addEventListener('deviceorientation', e => {
      if (e.gamma == null) return;
      mx = Math.max(-1, Math.min(1, e.gamma / 30));
      my = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    });

    /* ── فقط وقتی دیده میشه رندر کن ── */
    let visible = true;
    new IntersectionObserver(en => { visible = en[0].isIntersecting; }).observe(hero);

    /* ── لوپ انیمیشن ── */
    const h1 = hero.querySelector('h1');
    let pulseT = 0;
    let spin = 0;

    (function loop(t){
      requestAnimationFrame(loop);
      if (!visible || document.hidden) return;

      // چرخش آروم + واکنش به موس
      spin += 0.0016;
      earth.rotation.y = spin + mx * 0.35;
      earth.rotation.x = my * 0.18;
      wire.rotation.y = earth.rotation.y;
      wire.rotation.x = earth.rotation.x;

      // پالس هاله
      if (halo){
        pulseT += 0.06;
        const s = 1 + Math.sin(pulseT) * 0.4;
        halo.scale.set(s, s, s);
        halo.material.opacity = 0.35 + Math.sin(pulseT) * 0.2;
      }

      stars.rotation.y = t * 0.00002 + mx * 0.04;

      // حرکت دوربین با موس
      cam.position.x += (mx * 1.8 - cam.position.x) * 0.04;
      cam.position.y += (-my * 1.1 - cam.position.y) * 0.04;
      cam.lookAt(baseX, 0, 0);

      // جابجایی خفیف متن hero
      if (h1 && fine) h1.style.transform = `translate3d(${mx * -8}px, ${my * -5}px, 0)`;

      renderer.render(scene, cam);
    })(0);

    requestAnimationFrame(() => renderer.domElement.classList.add('on'));
  }
})();