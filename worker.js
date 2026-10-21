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
  // 🔐 API فقط برای صفحه‌های خود سایت؛ هیچ سایت دیگه‌ای اجازه‌ی صدا زدنش رو نداره
  const corsHeaders = {};
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }
  if (request.method === 'POST') {
    const origin = request.headers.get('Origin');
    if (origin && origin !== url.origin) {
      return jsonResponse({ error: 'دسترسی مجاز نیست' }, 403);
    }
    const len = parseInt(request.headers.get('Content-Length') || '0', 10);
    if (len > 3 * 1024 * 1024) {
      return jsonResponse({ error: 'درخواست بیش از حد بزرگه' }, 413);
    }
  }

  // 🔐 محدودیت تعداد تلاش (جلوی حدس زدن رمز و اسپم)
  const LIMITS = {
    login:            [10, 15 * 60],
    signup:           [5, 60 * 60],
    'forgot-password':[5, 60 * 60],
    'reset-password': [10, 60 * 60],
    'delete-account': [5, 60 * 60]
  };
  const action = url.pathname.replace('/api/', '');
  if (request.method === 'POST' && LIMITS[action]) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const [max, windowSec] = LIMITS[action];
    if (await tooManyAttempts(env, `${action}:${ip}`, max, windowSec)) {
      return jsonResponse({ error: 'تعداد تلاش‌ها زیاد بود. کمی بعد دوباره امتحان کن.' }, 429);
    }
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
    return jsonResponse({ error: 'خطای سرور' }, 500, corsHeaders);
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
  const bad = tooLong({ email: [email, 254], password: [password, 128], name: [name, 80], phone: [phone, 20], role: [role, 30], gender: [gender, 10] });
  if (bad) return jsonResponse({ error: bad }, 400, corsHeaders);
  
  // بررسی ایمیل تکراری
  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
    .bind(email.toLowerCase()).first();
  
  if (existing) {
    return jsonResponse({ error: 'این ایمیل قبلاً ثبت شده' }, 400, corsHeaders);
  }
  
  // ساخت کاربر جدید
  const userId = crypto.randomUUID();
  const storedPassword = await makePasswordRecord(password);
  
  await env.DB.prepare(`
  INSERT INTO users (id, email, password_hash, name, phone, age, gender, role)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).bind(
  userId, email.toLowerCase(), storedPassword,
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
  const bad = tooLong({ email: [email, 254], password: [password, 128] });
  if (bad) return jsonResponse({ error: bad }, 400, corsHeaders);
  
  // پیدا کردن کاربر
  const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
    .bind(email.toLowerCase()).first();
  
  if (!user) {
    return jsonResponse({ error: 'ایمیل یا پسورد اشتباه است' }, 401, corsHeaders);
  }
  
  // بررسی پسورد
  const check = await verifyPassword(password, user.password_hash);
  if (!check.ok) {
    return jsonResponse({ error: 'ایمیل یا پسورد اشتباه است' }, 401, corsHeaders);
  }
  
  // رمزهای قدیمی (هش ضعیف‌تر) رو بی‌صدا به فرمت قوی‌تر ارتقا بده
  if (check.needsUpgrade) {
    await env.DB.prepare('UPDATE users SET password_hash = ? WHERE id = ?')
      .bind(await makePasswordRecord(password), user.id).run();
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
      phone: session.phone, age: session.age, gender: session.gender,
      role: session.role, avatar_url: session.avatar_url, bio: session.bio,
      created_at: session.created_at
    }
  }, 200, corsHeaders);
}
/* ===== درخواست بازیابی رمز =====
   🔐 کد فقط به ایمیل صاحب حساب فرستاده می‌شه، هیچ‌وقت توی جواب API نمیاد.
   برای فعال شدن، باید کلید سرویس ایمیل (Resend) تنظیم بشه:
     npx wrangler secret put RESEND_API_KEY
   و در wrangler.toml مقدار MAIL_FROM (مثلاً "Ali Ghaemi <no-reply@alighaemi.art>").
   تا اون موقع این بخش پیام «موقتاً غیرفعال» برمی‌گردونه.
*/
async function handleForgotPassword(request, env, corsHeaders) {
  if (!env.RESEND_API_KEY || !env.MAIL_FROM) {
    return jsonResponse({
      error: 'بازیابی رمز موقتاً غیرفعاله. لطفاً از طریق تلگرام یا ایمیل با ما در تماس باش.',
      disabled: true
    }, 503, corsHeaders);
  }
  
  const body = await request.json();
  const { email, phone } = body;
  
  if (!email || !phone) {
    return jsonResponse({ error: 'ایمیل و شماره موبایل الزامی است' }, 400, corsHeaders);
  }
  
  // جواب همیشه یکسانه، تا کسی نتونه بفهمه یه ایمیل توی سایت ثبت شده یا نه
  const genericOk = jsonResponse({
    success: true,
    expiresIn: 600,
    message: 'اگه این اطلاعات درست باشه، کد بازیابی به ایمیلت فرستاده شد. ۱۰ دقیقه اعتبار داره.'
  }, 200, corsHeaders);
  
  const user = await env.DB.prepare(
    'SELECT id, name, email FROM users WHERE email = ? AND phone = ?'
  ).bind(email.toLowerCase(), phone).first();
  
  if (!user) return genericOk;
  
  const code = secureSixDigitCode();
  const expiresAt = Math.floor(Date.now() / 1000) + (10 * 60);
  
  await env.DB.prepare(`
    UPDATE users 
    SET recovery_code = ?, recovery_expires = ?
    WHERE id = ?
  `).bind(code, expiresAt, user.id).run();
  
  const sent = await sendRecoveryEmail(env, user.email, user.name, code);
  if (!sent) {
    return jsonResponse({ error: 'ارسال ایمیل ناموفق بود. چند دقیقه دیگه دوباره امتحان کن.' }, 502, corsHeaders);
  }
  
  return genericOk;
}

/* ===== ارسال ایمیل کد بازیابی (Resend) ===== */
async function sendRecoveryEmail(env, to, name, code) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: [to],
        subject: 'کد بازیابی رمز | Password reset code',
        text: `سلام ${name || ''}\n\nکد بازیابی رمز شما: ${code}\nاین کد ۱۰ دقیقه اعتبار دارد.\nاگر شما درخواست نداده‌اید، این ایمیل را نادیده بگیرید.\n\nYour password reset code: ${code} (valid for 10 minutes).`
      })
    });
    return res.ok;
  } catch (err) {
    console.error('Email send failed:', err);
    return false;
  }
}

/* ===== کد ۶ رقمی امن ===== */
function secureSixDigitCode() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (100000 + (buf[0] % 900000)).toString();
}

/* ===== تغییر رمز با کد بازیابی ===== */
async function handleResetPassword(request, env, corsHeaders) {
  const body = await request.json();
  const { email, phone, code, newPassword } = body;
  
  if (!email || !phone || !code || !newPassword) {
    return jsonResponse({ error: 'اطلاعات ناقص است' }, 400, corsHeaders);
  }
  
  if (String(newPassword).length > 128 || String(code).length > 10) {
    return jsonResponse({ error: 'اطلاعات نامعتبر' }, 400, corsHeaders);
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
  
  if (!user.recovery_code || user.recovery_code !== String(code).trim()) {
    // با هر حدس اشتباه، کد باطل می‌شه تا کسی نتونه کدها رو یکی‌یکی امتحان کنه
    if (user.recovery_code) {
      await env.DB.prepare(
        'UPDATE users SET recovery_code = NULL, recovery_expires = NULL WHERE id = ?'
      ).bind(user.id).run();
    }
    return jsonResponse({ error: 'کد بازیابی اشتباهه. دوباره درخواست کد بده.' }, 400, corsHeaders);
  }
  
  const now = Math.floor(Date.now() / 1000);
  if (user.recovery_expires < now) {
    return jsonResponse({ error: 'کد بازیابی منقضی شده. دوباره درخواست بده' }, 400, corsHeaders);
  }
  
  await env.DB.prepare(`
    UPDATE users
    SET password_hash = ?, recovery_code = NULL, recovery_expires = NULL
    WHERE id = ?
  `).bind(await makePasswordRecord(newPassword), user.id).run();
  
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
  const bad = tooLong({ name: [name, 80], role: [role, 30], gender: [gender, 10] });
  if (bad) return jsonResponse({ error: bad }, 400, corsHeaders);
  
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
  
  // فقط آواتار آماده یا عکس واقعی قبوله
  const isPreset = /^preset:[1-8]$/.test(avatar_url);
  const isImage = /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(avatar_url);
  if (!isPreset && !isImage) {
    return jsonResponse({ error: 'فرمت عکس معتبر نیست' }, 400, corsHeaders);
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
  const check = await verifyPassword(password, user.password_hash);
  if (!check.ok) {
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
/* ===== هش کردن پسورد =====
   فرمت جدید:  v2:salt:hash   (۱۰۰ هزار دور PBKDF2، حداکثر مجاز در Cloudflare)
   فرمت قدیمی: salt:hash      (۱۰ هزار دور) — موقع ورود خودکار ارتقا پیدا می‌کنه
*/
const HASH_ITERATIONS_V2 = 100000;
const HASH_ITERATIONS_LEGACY = 10000;

async function hashPassword(password, salt, iterations = HASH_ITERATIONS_V2) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

async function makePasswordRecord(password) {
  const salt = crypto.randomUUID();
  return `v2:${salt}:${await hashPassword(password, salt, HASH_ITERATIONS_V2)}`;
}

async function verifyPassword(password, record) {
  if (!record) return { ok: false };
  const parts = record.split(':');
  let salt, stored, iterations, needsUpgrade;
  if (parts[0] === 'v2' && parts.length === 3) {
    [, salt, stored] = parts;
    iterations = HASH_ITERATIONS_V2;
    needsUpgrade = false;
  } else if (parts.length === 2) {
    [salt, stored] = parts;
    iterations = HASH_ITERATIONS_LEGACY;
    needsUpgrade = true;
  } else {
    return { ok: false };
  }
  const input = await hashPassword(password, salt, iterations);
  return { ok: safeEqual(input, stored), needsUpgrade };
}

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* ===== محدودیت تعداد تلاش (ذخیره در D1؛ جدولش خودکار ساخته می‌شه) ===== */
let rateTableReady = false;
async function tooManyAttempts(env, key, max, windowSec) {
  try {
    if (!rateTableReady) {
      await env.DB.prepare('CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL)').run();
      rateTableReady = true;
    }
    const now = Math.floor(Date.now() / 1000);
    const row = await env.DB.prepare('SELECT count, reset_at FROM rate_limits WHERE key = ?').bind(key).first();
    if (!row || row.reset_at <= now) {
      await env.DB.prepare('INSERT OR REPLACE INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?)').bind(key, now + windowSec).run();
      return false;
    }
    if (row.count >= max) return true;
    await env.DB.prepare('UPDATE rate_limits SET count = count + 1 WHERE key = ?').bind(key).run();
    return false;
  } catch (err) {
    console.error('rate limit error:', err);
    return false; // اگه شمارنده خراب شد، سایت از کار نیفته
  }
}

/* ===== بررسی طول ورودی‌ها ===== */
function tooLong(fields) {
  for (const [label, [value, max]] of Object.entries(fields)) {
    if (value != null && String(value).length > max) return `مقدار «${label}» بیش از حد طولانیه`;
  }
  return null;
}

/* ===== پاسخ JSON (با سربرگ‌های امنیتی) ===== */
function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      ...extraHeaders
    }
  });
}