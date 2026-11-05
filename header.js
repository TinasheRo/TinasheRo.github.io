// Shared site header. Add <script src="header.js"></script> at the end of <body> on every page.
(function () {
  if (document.querySelector('.rh-header')) return;
  var p = location.pathname.toLowerCase();
  var here = p.indexOf('about') > -1 ? 'About' : p.indexOf('play') > -1 ? 'Play' : 'Work';
  var links = [
    ['Work', 'index.html#work'],
    ['About', 'about.html'],
    ['Play', 'play.html'],
    ['Resume', 'Roseanne_Hwami_CV.pdf']
  ];

  var css = document.createElement('style');
  css.textContent =
    '.rh-header{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;width:min(1320px,calc(100% - 48px));margin:0 auto;padding-block:24px;color:#31010f;font-family:"DM Sans",Arial,sans-serif;position:relative;z-index:30}' +
    '.rh-header *{box-sizing:border-box}' +
    '.rh-header a{color:inherit;text-decoration:none}' +
    '.rh-header a:focus-visible{outline:2px solid #9a1840;outline-offset:4px}' +
    '.rh-brand{display:flex;align-items:center;gap:8px;font-family:"Cormorant Garamond",Georgia,serif;font-size:21px;font-weight:600}' +
    '.rh-brand img{width:23px;height:auto}' +
    '.rh-nav{display:flex;gap:28px;font-size:14px}' +
    '.rh-nav a:hover{color:#9a1840}' +
    '.rh-nav a[aria-current="page"]{text-decoration:underline;text-underline-offset:4px}' +
    '@media(max-width:480px){.rh-nav{gap:16px}}' +
    /* hide each page's own older header so only this one shows */
    '#root>header,body>header:not(.rh-header){display:none!important}';
  document.head.appendChild(css);

  if (!document.querySelector('link[href*="DM+Sans"]')) {
    var f = document.createElement('link');
    f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=DM+Sans:wght@400&display=swap';
    document.head.appendChild(f);
  }

  var header = document.createElement('header');
  header.className = 'rh-header';
  var brand = document.createElement('a');
  brand.className = 'rh-brand';
  brand.href = 'index.html';
  brand.setAttribute('aria-label', 'Rose + Anne, home');
  brand.innerHTML = '<img src="assets/Brand__rose.svg" alt="" width="23" height="23">Rose + Anne';
  var nav = document.createElement('nav');
  nav.className = 'rh-nav';
  nav.setAttribute('aria-label', 'Main');
  links.forEach(function (l) {
    var a = document.createElement('a');
    a.textContent = l[0];
    a.href = l[1];
    if (l[0] === 'Resume') { a.target = '_blank'; a.rel = 'noreferrer'; }
    if (l[0] === here) a.setAttribute('aria-current', 'page');
    nav.appendChild(a);
  });
  header.appendChild(brand);
  header.appendChild(nav);
  document.body.insertBefore(header, document.body.firstChild);
})();
