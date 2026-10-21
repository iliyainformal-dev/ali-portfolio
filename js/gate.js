/* ⚡ اول از همه: اگه بازدیدکننده از Welcome نیومده، همین الان بره اونجا
   (قبل از اینکه CSS و عکس‌های این صفحه دانلود بشن) */
(function(){
  try { if(!sessionStorage.getItem('fromWelcome')) location.replace('welcome.html'); } catch(e){}
})();
