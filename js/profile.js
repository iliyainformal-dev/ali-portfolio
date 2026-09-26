/* ═══════════════════════════════════════════
   👤 منطق صفحه پروفایل
   ═══════════════════════════════════════════ */
(function(){
  const token = localStorage.getItem('authToken');
  
  // اگه لاگین نیستی، برو به صفحه اصلی
  if(!token){
    window.location.href = 'index.html';
    return;
  }
  
  // عناصر
  const profileAvatar   = document.getElementById('profileAvatar');
  const navUserAvatar   = document.getElementById('navUserAvatar');
  const navUserName     = document.getElementById('navUserName');
  const profileName     = document.getElementById('profileName');
  const profileRole     = document.getElementById('profileRole');
  const infoEmail       = document.getElementById('infoEmail');
  const infoPhone       = document.getElementById('infoPhone');
  const infoAge         = document.getElementById('infoAge');
  const infoGender      = document.getElementById('infoGender');
  const infoRole        = document.getElementById('infoRole');
  const infoJoined      = document.getElementById('infoJoined');
  const bioContent      = document.getElementById('bioContent');
  
  // Modalها
  const editModal       = document.getElementById('editModal');
  const avatarModal     = document.getElementById('avatarModal');
  const deleteModal     = document.getElementById('deleteModal');
  const editForm        = document.getElementById('editForm');
  const deleteForm      = document.getElementById('deleteForm');
  const editMessage     = document.getElementById('editMessage');
  const avatarMessage   = document.getElementById('avatarMessage');
  const deleteMessage   = document.getElementById('deleteMessage');
  
  // دکمه‌ها
  const editProfileBtn  = document.getElementById('editProfileBtn');
  const editBioBtn      = document.getElementById('editBioBtn');
  const avatarEditBtn   = document.getElementById('avatarEditBtn');
  const deleteAccountBtn= document.getElementById('deleteAccountBtn');
  const uploadArea      = document.getElementById('uploadArea');
  const avatarFileInput = document.getElementById('avatarFileInput');
  const presetAvatars   = document.querySelectorAll('.preset-avatar');
  
  let currentUser = null;
  
  /* ===== Modal helpers ===== */
  function openModal(modal){
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(modal){
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  // بستن با ضربدر
  document.querySelectorAll('[data-close]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      closeModal(btn.closest('.modal-overlay'));
    });
  });
  
  // بستن با کلیک روی پس‌زمینه
  [editModal, avatarModal, deleteModal].forEach(modal=>{
    modal?.addEventListener('click', (e)=>{
      if(e.target === modal) closeModal(modal);
    });
  });
  
  // بستن با Esc
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      closeModal(editModal);
      closeModal(avatarModal);
      closeModal(deleteModal);
    }
  });
  
  /* ===== نمایش پیام ===== */
  function showMessage(el, text, type){
    if(!el) return;
    el.textContent = text;
    el.className = 'form-message ' + type;
  }
  
  /* ===== ترجمه نقش ===== */
  function roleLabel(role){
    const map = {
      'artist':  '🎨 هنرمند',
      'student': '📚 هنرجوی هنر',
      'lover':   '💙 دوست‌دار هنر',
      'gallery': '🖼️ گالری‌دار',
      'buyer':   '🛒 خریدار آثار هنری',
      'other':   '✨ سایر'
    };
    return map[role] || role;
  }
  
  /* ===== ترجمه جنسیت ===== */
  function genderLabel(g){
    const map = { 'male':'مرد', 'female':'زن' };
    return map[g] || '-';
  }
  
  /* ===== نمایش اطلاعات کاربر ===== */
  function renderUser(user){
    currentUser = user;
    
    // حرف اول اسم
    const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';
    
    // آواتار
    if(user.avatar_url){
      // اگه URL بود
      if(user.avatar_url.startsWith('preset:')){
        // آواتار آماده
        const presetNum = user.avatar_url.replace('preset:', '');
        const colors = {
          '1':['#e63946','#d4a574'], '2':['#7b2cbf','#e63946'],
          '3':['#2c7bbf','#7b2cbf'], '4':['#d4a574','#e63946'],
          '5':['#4ade80','#2c7bbf'], '6':['#f97316','#e63946'],
          '7':['#ec4899','#7b2cbf'], '8':['#06b6d4','#2c7bbf']
        };
        const icons = {'1':'🎨','2':'🎭','3':'🖼️','4':'✨','5':'🌟','6':'🔥','7':'💜','8':'💎'};
        const c = colors[presetNum] || colors['1'];
        profileAvatar.style.background = `linear-gradient(135deg,${c[0]},${c[1]})`;
        profileAvatar.innerHTML = icons[presetNum] || '🎨';
        
        if(navUserAvatar){
          navUserAvatar.style.background = `linear-gradient(135deg,${c[0]},${c[1]})`;
          navUserAvatar.textContent = icons[presetNum] || '🎨';
        }
      } else {
        // عکس واقعی
        profileAvatar.style.background = `url('${user.avatar_url}') center/cover`;
        profileAvatar.innerHTML = '';
        
        if(navUserAvatar){
          navUserAvatar.style.background = `url('${user.avatar_url}') center/cover`;
          navUserAvatar.textContent = '';
        }
      }
    } else {
      // پیش‌فرض: حرف اول اسم
      profileAvatar.style.background = 'linear-gradient(135deg,var(--accent),var(--accent-2))';
      profileAvatar.textContent = initial;
      
      if(navUserAvatar){
        navUserAvatar.style.background = 'linear-gradient(135deg,var(--accent),var(--accent-2))';
        navUserAvatar.textContent = initial;
      }
    }
    
    // نام و نقش
    profileName.textContent = user.name || 'بدون نام';
    profileRole.textContent  = roleLabel(user.role);
    
    if(navUserName) navUserName.textContent = (user.name || '').split(' ')[0];
    
    // اطلاعات
    infoEmail.textContent  = user.email || '-';
    infoPhone.textContent  = user.phone || '-';
    infoAge.textContent    = user.age ? user.age + ' سال' : '-';
    infoGender.textContent = genderLabel(user.gender);
    infoRole.textContent   = roleLabel(user.role);
    
    // تاریخ عضویت
    if(user.created_at){
      const date = new Date(user.created_at * 1000);
      const faDate = date.toLocaleDateString('fa-IR', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      infoJoined.textContent = faDate;
    } else {
      infoJoined.textContent = '-';
    }
    
    // بیوگرافی
    if(user.bio && user.bio.trim()){
      bioContent.innerHTML = `<p>${escapeHtml(user.bio)}</p>`;
    } else {
      bioContent.innerHTML = '<p class="bio-empty">هنوز بیوگرافی‌ای ننوشتی...</p>';
    }
  }
  
  function escapeHtml(text){
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  /* ===== دریافت اطلاعات کاربر ===== */
  async function loadUser(){
    try {
      const res = await fetch('/api/me', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      
      if(!res.ok){
        // توکن منقضی شده
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
        return;
      }
      
      const data = await res.json();
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      renderUser(data.user);
      
    } catch(err){
      console.error('خطا در دریافت اطلاعات:', err);
      // از localStorage استفاده کن
      const cached = localStorage.getItem('currentUser');
      if(cached){
        renderUser(JSON.parse(cached));
      }
    }
  }
  
  /* ===== پر کردن فرم ویرایش ===== */
  function fillEditForm(){
    if(!currentUser) return;
    document.getElementById('editName').value   = currentUser.name || '';
    document.getElementById('editAge').value    = currentUser.age || '';
    document.getElementById('editGender').value = currentUser.gender || '';
    document.getElementById('editRole').value   = currentUser.role || '';
    document.getElementById('editBio').value    = currentUser.bio || '';
  }
  
  // دکمه ویرایش پروفایل
  editProfileBtn?.addEventListener('click', ()=>{
    fillEditForm();
    showMessage(editMessage, '', '');
    openModal(editModal);
  });
  
  // دکمه ویرایش بیوگرافی
  editBioBtn?.addEventListener('click', ()=>{
    fillEditForm();
    showMessage(editMessage, '', '');
    openModal(editModal);
    // فوکوس روی بیو
    setTimeout(()=>document.getElementById('editBio').focus(), 300);
  });
  
  // دکمه تغییر آواتار
  avatarEditBtn?.addEventListener('click', ()=>{
    showMessage(avatarMessage, '', '');
    openModal(avatarModal);
  });
  
  /* ===== ذخیره تغییرات ===== */
  editForm?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(editForm).entries());
    
    const submitBtn = editForm.querySelector('.modal-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>در حال ذخیره...</span>';
    
    try {
      const res = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      
      if(!res.ok){
        showMessage(editMessage, result.error || 'خطا در ذخیره', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>ذخیره تغییرات</span>';
        return;
      }
      
      showMessage(editMessage, '✅ تغییرات ذخیره شد!', 'success');
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      renderUser(result.user);
      
      setTimeout(()=>{
        closeModal(editModal);
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>ذخیره تغییرات</span>';
        showMessage(editMessage, '', '');
      }, 1500);
      
    } catch(err){
      showMessage(editMessage, 'خطای شبکه. دوباره تلاش کن.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>ذخیره تغییرات</span>';
    }
  });
  
  /* ===== حذف حساب ===== */
  deleteAccountBtn?.addEventListener('click', ()=>{
    showMessage(deleteMessage, '', '');
    document.querySelector('#deleteForm input[name="password"]').value = '';
    openModal(deleteModal);
  });
  
  deleteForm?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const password = deleteForm.querySelector('input[name="password"]').value;
    
    if(!confirm('مطمئنی می‌خوای حسابت رو حذف کنی؟ این عمل غیرقابل بازگشته!')){
      return;
    }
    
    const submitBtn = deleteForm.querySelector('.modal-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>در حال حذف...</span>';
    
    try {
      const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ password })
      });
      
      const result = await res.json();
      
      if(!res.ok){
        showMessage(deleteMessage, result.error || 'خطا در حذف', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>بله، حسابم رو حذف کن</span>';
        return;
      }
      
      showMessage(deleteMessage, '✅ حساب حذف شد. در حال خروج...', 'success');
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      
      setTimeout(()=>window.location.href = 'index.html', 1500);
      
    } catch(err){
      showMessage(deleteMessage, 'خطای شبکه. دوباره تلاش کن.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>بله، حسابم رو حذف کن</span>';
    }
  });
  
  /* ===== انتخاب آواتار آماده ===== */
  presetAvatars.forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const presetNum = btn.dataset.color;
      
      try {
        const res = await fetch('/api/update-avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ avatar_url: 'preset:' + presetNum })
        });
        
        const result = await res.json();
        
        if(!res.ok){
          showMessage(avatarMessage, result.error || 'خطا', 'error');
          return;
        }
        
        showMessage(avatarMessage, '✅ عکس پروفایل تغییر کرد!', 'success');
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        renderUser(result.user);
        
        setTimeout(()=>{
          closeModal(avatarModal);
          showMessage(avatarMessage, '', '');
        }, 1000);
        
      } catch(err){
        showMessage(avatarMessage, 'خطای شبکه', 'error');
      }
    });
  });
  
  /* ===== آپلود فایل ===== */
  uploadArea?.addEventListener('click', ()=>avatarFileInput.click());
  
  uploadArea?.addEventListener('dragover', (e)=>{
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  uploadArea?.addEventListener('dragleave', ()=>{
    uploadArea.classList.remove('dragover');
  });
  uploadArea?.addEventListener('drop', (e)=>{
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if(e.dataTransfer.files.length > 0){
      handleFileUpload(e.dataTransfer.files[0]);
    }
  });
  
  avatarFileInput?.addEventListener('change', (e)=>{
    if(e.target.files.length > 0){
      handleFileUpload(e.target.files[0]);
    }
  });
  
  function handleFileUpload(file){
    // بررسی نوع
    if(!file.type.startsWith('image/')){
      showMessage(avatarMessage, 'فقط فایل عکس مجاز است', 'error');
      return;
    }
    
    // بررسی حجم (۲ مگابایت)
    if(file.size > 2 * 1024 * 1024){
      showMessage(avatarMessage, 'حجم عکس باید کمتر از ۲ مگابایت باشه', 'error');
      return;
    }
    
    showMessage(avatarMessage, '⏳ در حال آپلود...', 'success');
    
    const reader = new FileReader();
    reader.onload = async (ev)=>{
      const base64 = ev.target.result;
      
      try {
        const res = await fetch('/api/update-avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ avatar_url: base64 })
        });
        
        const result = await res.json();
        
        if(!res.ok){
          showMessage(avatarMessage, result.error || 'خطا در آپلود', 'error');
          return;
        }
        
        showMessage(avatarMessage, '✅ عکس آپلود شد!', 'success');
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        renderUser(result.user);
        
        setTimeout(()=>{
          closeModal(avatarModal);
          showMessage(avatarMessage, '', '');
        }, 1000);
        
      } catch(err){
        showMessage(avatarMessage, 'خطای شبکه در آپلود', 'error');
      }
    };
    reader.readAsDataURL(file);
  }
  
  /* ===== شروع ===== */
  loadUser();
})();