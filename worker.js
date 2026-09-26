/* ═══════════════════════════════════════════
   🔐 Worker API - احراز هویت
   ═══════════════════════════════════════════ */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // مسیرهای API
    if (url.pathname.startsWith('/api/')) {
      return handleAPI(request, env, url);
    }
    
    // بقیه درخواست‌ها → فایل‌های استاتیک
    return env.ASSETS.fetch(request);
  }
};

/* ===== مدیریت API ===== */
async function handleAPI(request, env, url) {
  // CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const path = url.pathname.replace('/api/', '');
    
    // مسیرهای مختلف
    if (path === 'signup' && request.method === 'POST') {
      return await handleSignup(request, env, corsHeaders);
    }
    if (path === 'login' && request.method === 'POST') {
      return await handleLogin(request, env, corsHeaders);
    }
    if (path === 'logout' && request.method === 'POST') {
      return await handleLogout(request, env, corsHeaders);
    }
    if (path === 'me' && request.method === 'GET') {
      return await handleMe(request, env, corsHeaders);
    }
    if (path === 'detect-country' && request.method === 'GET') {
  return jsonResponse({ 
    country: request.headers.get('CF-IPCountry') || null 
  }, 200, corsHeaders);
}
    if (path === 'forgot-password' && request.method === 'POST') {
  return await handleForgotPassword(request, env, corsHeaders);
}
if (path === 'reset-password' && request.method === 'POST') {
  return await handleResetPassword(request, env, corsHeaders);
}
if (path === 'update-profile' && request.method === 'POST') {
  return await handleUpdateProfile(request, env, corsHeaders);
}
if (path === 'update-avatar' && request.method === 'POST') {
  return await handleUpdateAvatar(request, env, corsHeaders);
}
if (path === 'delete-account' && request.method === 'POST') {
  return await handleDeleteAccount(request, env, corsHeaders);
}
    
    return jsonResponse({ error: 'مسیر یافت نشد' }, 404, corsHeaders);
    
  } catch (err) {
    console.error('API Error:', err);
    return jsonResponse({ error: 'خطای سرور', details: err.message }, 500, corsHeaders);
  }
}

/* ===== ثبت‌نام ===== */
async function handleSignup(request, env, corsHeaders) {
  const body = await request.json();
  const { email, password, name, phone, age, gender, role } = body;
  
  // اعتبارسنجی
  if (!email || !password || !name || !phone || !role) {
    return jsonResponse({ error: 'اطلاعات ناقص است' }, 400, corsHeaders);
  }
  if (password.length < 6) {
    return jsonResponse({ error: 'پسورد باید حداقل ۶ کاراکتر باشه' }, 400, corsHeaders);
  }
  if (!email.includes('@')) {
    return jsonResponse({ error: 'ایمیل معتبر نیست' }, 400, corsHeaders);
  }
  
  // بررسی ایمیل تکراری
  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
    .bind(email.toLowerCase()).first();
  
  if (existing) {
    return jsonResponse({ error: 'این ایمیل قبلاً ثبت شده' }, 400, corsHeaders);
  }
  
  // ساخت کاربر جدید
  const userId = crypto.randomUUID();
  const salt = crypto.randomUUID();
  const passwordHash = await hashPassword(password, salt);
  
  await env.DB.prepare(`
  INSERT INTO users (id, email, password_hash, name, phone, age, gender, role)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).bind(
  userId, email.toLowerCase(), `${salt}:${passwordHash}`,
  name, phone || null, age || null, gender || null, role
).run();
  
  // ساخت session
  const token = crypto.randomUUID();
  const expiresAt = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // ۳۰ روز
  
  await env.DB.prepare(`
    INSERT INTO sessions (id, user_id, token, expires_at)
    VALUES (?, ?, ?, ?)
  `).bind(crypto.randomUUID(), userId, token, expiresAt).run();
  
  return jsonResponse({
    success: true,
    token: token,
    user: { id: userId, email, name, age, gender, role }
  }, 200, corsHeaders);
}

/* ===== ورود ===== */
async function handleLogin(request, env, corsHeaders) {
  const body = await request.json();
  const { email, password } = body;
  
  if (!email || !password) {
    return jsonResponse({ error: 'ایمیل و پسورد الزامی است' }, 400, corsHeaders);
  }
  
  // پیدا کردن کاربر
  const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
    .bind(email.toLowerCase()).first();
  
  if (!user) {
    return jsonResponse({ error: 'ایمیل یا پسورد اشتباه است' }, 401, corsHeaders);
  }
  
  // بررسی پسورد
  const [salt, storedHash] = user.password_hash.split(':');
  const inputHash = await hashPassword(password, salt);
  
  if (inputHash !== storedHash) {
    return jsonResponse({ error: 'ایمیل یا پسورد اشتباه است' }, 401, corsHeaders);
  }
  
  // ساخت session جدید
  const token = crypto.randomUUID();
  const expiresAt = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
  
  await env.DB.prepare(`
    INSERT INTO sessions (id, user_id, token, expires_at)
    VALUES (?, ?, ?, ?)
  `).bind(crypto.randomUUID(), user.id, token, expiresAt).run();
  
  return jsonResponse({
    success: true,
    token: token,
    user: {
      id: user.id, email: user.email, name: user.name,
      age: user.age, gender: user.gender, role: user.role,
      avatar_url: user.avatar_url, bio: user.bio
    }
  }, 200, corsHeaders);
}

/* ===== خروج ===== */
async function handleLogout(request, env, corsHeaders) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return jsonResponse({ success: true }, 200, corsHeaders);
  
  const token = authHeader.replace('Bearer ', '');
  await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
  
  return jsonResponse({ success: true }, 200, corsHeaders);
}

/* ===== اطلاعات کاربر ===== */
async function handleMe(request, env, corsHeaders) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return jsonResponse({ error: 'وارد نشده‌اید' }, 401, corsHeaders);
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  const session = await env.DB.prepare(`
    SELECT s.user_id, s.expires_at, u.* 
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ?
  `).bind(token).first();
  
  if (!session) {
    return jsonResponse({ error: 'نشست منقضی شده' }, 401, corsHeaders);
  }
  
  if (session.expires_at < Math.floor(Date.now() / 1000)) {
    await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return jsonResponse({ error: 'نشست منقضی شده' }, 401, corsHeaders);
  }
  
  return jsonResponse({
    user: {
      id: session.id, email: session.email, name: session.name,
      age: session.age, gender: session.gender, role: session.role,
      avatar_url: session.avatar_url, bio: session.bio
    }
  }, 200, corsHeaders);
}
/* ===== درخواست بازیابی رمز ===== */
async function handleForgotPassword(request, env, corsHeaders) {
  const body = await request.json();
  const { email, phone } = body;
  
  if (!email || !phone) {
    return jsonResponse({ error: 'ایمیل و شماره موبایل الزامی است' }, 400, corsHeaders);
  }
  
  const user = await env.DB.prepare(
    'SELECT id, name FROM users WHERE email = ? AND phone = ?'
  ).bind(email.toLowerCase(), phone).first();
  
  if (!user) {
    return jsonResponse({ 
      error: 'کاربری با این ایمیل و شماره موبایل پیدا نشد' 
    }, 404, corsHeaders);
  }
  
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Math.floor(Date.now() / 1000) + (10 * 60);
  
  await env.DB.prepare(`
    UPDATE users 
    SET recovery_code = ?, recovery_expires = ?
    WHERE id = ?
  `).bind(code, expiresAt, user.id).run();
  
  return jsonResponse({
    success: true,
    code: code,
    userName: user.name,
    expiresIn: 600,
    message: 'کد بازیابی صادر شد. ۱۰ دقیقه اعتبار داره.'
  }, 200, corsHeaders);
}

/* ===== تغییر رمز با کد بازیابی ===== */
async function handleResetPassword(request, env, corsHeaders) {
  const body = await request.json();
  const { email, phone, code, newPassword } = body;
  
  if (!email || !phone || !code || !newPassword) {
    return jsonResponse({ error: 'اطلاعات ناقص است' }, 400, corsHeaders);
  }
  
  if (newPassword.length < 6) {
    return jsonResponse({ error: 'پسورد باید حداقل ۶ کاراکتر باشه' }, 400, corsHeaders);
  }
  
  const user = await env.DB.prepare(`
    SELECT id, recovery_code, recovery_expires
    FROM users
    WHERE email = ? AND phone = ?
  `).bind(email.toLowerCase(), phone).first();
  
  if (!user) {
    return jsonResponse({ error: 'کاربر پیدا نشد' }, 404, corsHeaders);
  }
  
  if (user.recovery_code !== code) {
    return jsonResponse({ error: 'کد بازیابی اشتباهه' }, 400, corsHeaders);
  }
  
  const now = Math.floor(Date.now() / 1000);
  if (user.recovery_expires < now) {
    return jsonResponse({ error: 'کد بازیابی منقضی شده. دوباره درخواست بده' }, 400, corsHeaders);
  }
  
  const salt = crypto.randomUUID();
  const passwordHash = await hashPassword(newPassword, salt);
  
  await env.DB.prepare(`
    UPDATE users
    SET password_hash = ?, recovery_code = NULL, recovery_expires = NULL
    WHERE id = ?
  `).bind(`${salt}:${passwordHash}`, user.id).run();
  
  await env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(user.id).run();
  
  return jsonResponse({
    success: true,
    message: 'رمز با موفقیت تغییر کرد! حالا می‌تونی وارد بشی.'
  }, 200, corsHeaders);
}

/* ===== بررسی توکن و گرفتن کاربر ===== */
async function getUserFromToken(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  const session = await env.DB.prepare(`
    SELECT s.user_id, s.expires_at
    FROM sessions s
    WHERE s.token = ?
  `).bind(token).first();
  
  if (!session) return null;
  
  const now = Math.floor(Date.now() / 1000);
  if (session.expires_at < now) {
    await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return null;
  }
  
  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(session.user_id).first();
  
  return user;
}

/* ===== آپدیت پروفایل ===== */
async function handleUpdateProfile(request, env, corsHeaders) {
  const user = await getUserFromToken(request, env);
  if (!user) {
    return jsonResponse({ error: 'وارد نشده‌اید' }, 401, corsHeaders);
  }
  
  const body = await request.json();
  const { name, age, gender, role, bio } = body;
  
  if (!name || !name.trim()) {
    return jsonResponse({ error: 'اسم نمی‌تونه خالی باشه' }, 400, corsHeaders);
  }
  
  if (bio && bio.length > 500) {
    return jsonResponse({ error: 'بیوگرافی حداکثر ۵۰۰ کاراکتر' }, 400, corsHeaders);
  }
  
  await env.DB.prepare(`
    UPDATE users
    SET name = ?, age = ?, gender = ?, role = ?, bio = ?
    WHERE id = ?
  `).bind(
    name.trim(),
    age || null,
    gender || null,
    role,
    bio || null,
    user.id
  ).run();
  
  // برگرداندن اطلاعات جدید
  const updated = await env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(user.id).first();
  
  return jsonResponse({
    success: true,
    user: {
      id: updated.id, email: updated.email, name: updated.name,
      phone: updated.phone, age: updated.age, gender: updated.gender,
      role: updated.role, avatar_url: updated.avatar_url, bio: updated.bio,
      created_at: updated.created_at
    }
  }, 200, corsHeaders);
}

/* ===== آپدیت آواتار ===== */
async function handleUpdateAvatar(request, env, corsHeaders) {
  const user = await getUserFromToken(request, env);
  if (!user) {
    return jsonResponse({ error: 'وارد نشده‌اید' }, 401, corsHeaders);
  }
  
  const body = await request.json();
  const { avatar_url } = body;
  
  if (!avatar_url) {
    return jsonResponse({ error: 'عکس ارسال نشده' }, 400, corsHeaders);
  }
  
  // اگه base64 بود، حجمش رو چک کن (حدود ۲MB)
  if (avatar_url.startsWith('data:')) {
    const sizeInBytes = (avatar_url.length * 3) / 4;
    if (sizeInBytes > 2 * 1024 * 1024) {
      return jsonResponse({ error: 'حجم عکس بیشتر از ۲ مگابایته' }, 400, corsHeaders);
    }
  }
  
  await env.DB.prepare('UPDATE users SET avatar_url = ? WHERE id = ?')
    .bind(avatar_url, user.id).run();
  
  const updated = await env.DB.prepare('SELECT * FROM users WHERE id = ?')
    .bind(user.id).first();
  
  return jsonResponse({
    success: true,
    user: {
      id: updated.id, email: updated.email, name: updated.name,
      phone: updated.phone, age: updated.age, gender: updated.gender,
      role: updated.role, avatar_url: updated.avatar_url, bio: updated.bio,
      created_at: updated.created_at
    }
  }, 200, corsHeaders);
}

/* ===== حذف حساب ===== */
async function handleDeleteAccount(request, env, corsHeaders) {
  const user = await getUserFromToken(request, env);
  if (!user) {
    return jsonResponse({ error: 'وارد نشده‌اید' }, 401, corsHeaders);
  }
  
  const body = await request.json();
  const { password } = body;
  
  if (!password) {
    return jsonResponse({ error: 'پسورد الزامی است' }, 400, corsHeaders);
  }
  
  // بررسی پسورد
  const [salt, storedHash] = user.password_hash.split(':');
  const inputHash = await hashPassword(password, salt);
  
  if (inputHash !== storedHash) {
    return jsonResponse({ error: 'پسورد اشتباهه' }, 401, corsHeaders);
  }
  
  // حذف کاربر و همه چیز مربوط بهش
  await env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(user.id).run();
  await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(user.id).run();
  
  return jsonResponse({
    success: true,
    message: 'حساب کاربری حذف شد'
  }, 200, corsHeaders);
}
/* ===== هش کردن پسورد ===== */
async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 10000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ===== پاسخ JSON ===== */
function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...extraHeaders
    }
  });
}