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
    '.rh-brand{display:flex;align-items:center;gap:10px;font-family:"Cormorant Garamond",Georgia,serif;font-size:21px;font-weight:600}' +
    '.rh-brand img{width:34px;height:auto}' +
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
  brand.innerHTML = '<img src="assets/Brand__rose_draw.svg" alt="" width="34" height="34">Rose + Anne';
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

// Sticky sub-navigation (← Back + section links + progress bar) for pages that don't build their own.
// About and the case studies already have one, so this only adds it where it is missing.
(function () {
  var p = location.pathname.toLowerCase();
  var kind = /theinterface/.test(p) ? 'interface' : /play/.test(p) ? 'play' : /about|resource|foxlove|deep-within|pippy|case-study/.test(p) ? null : 'home';
  if (!kind) return;

  var pages = {
    home: { back: null, items: [['Overview', '#rh-top'], ['Selected work', '#work'], ['Contact', '#contact']] },
    play: { back: 'index.html', items: [['Overview', '#rh-top'], ['Projects', '.pl-grid'], ['Contact', '#contact']] },
    interface: { back: 'play.html', items: [['Overview', '.Intro-container'], ['Play the game', 'h5:itch'], ['Final design', '.image_DeepWithin'], ['Contact', 'footer']] }
  };
  var cfg = pages[kind];

  function find(sel) {
    if (sel === 'h5:itch') {
      var hs = document.querySelectorAll('h5');
      for (var i = 0; i < hs.length; i++) if (/itch/i.test(hs[i].textContent)) return hs[i];
      return null;
    }
    return document.querySelector(sel);
  }

  function build() {
    if (document.querySelector('.subnav, .rh-sub')) return;
    var top = document.querySelector('.rh-header');
    if (!top) return;
    top.id = top.id || 'rh-top';

    var css = document.createElement('style');
    css.textContent =
      'html{scroll-padding-top:72px;scroll-behavior:smooth}' +
      '.rh-sub{position:sticky;top:0;z-index:25;background:var(--paper,#e7e0cb);border-bottom:1px solid rgb(49 1 15/16%);font-family:"DM Sans",Arial,sans-serif;color:#31010f}' +
      '.rh-sub *{box-sizing:border-box}' +
      '.rh-sub-row{display:flex;align-items:center;gap:24px;width:min(1320px,calc(100% - 48px));margin:0 auto;min-height:58px}' +
      '.rh-sub a{color:inherit;text-decoration:none}' +
      '.rh-back{flex:none;padding:6px 14px;border:1px solid rgb(49 1 15/40%);border-radius:999px;font-size:13px;font-weight:600}' +
      '.rh-back:hover{background:#31010f;color:#e7e0cb}' +
      '.rh-sub nav{display:flex;gap:26px;overflow-x:auto;scrollbar-width:none;font-size:13px;white-space:nowrap}' +
      '.rh-sub nav a{padding-block:16px;border-bottom:2px solid transparent}' +
      '.rh-sub nav a:hover{color:#9a1840}' +
      '.rh-sub nav a.on{border-color:#9a1840;color:#9a1840;font-weight:600}' +
      '.rh-sub a:focus-visible{outline:2px solid #9a1840;outline-offset:3px}' +
      '.rh-bar{position:absolute;bottom:-1px;left:0;height:2px;background:#9a1840}' +
      '@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}';
    document.head.appendChild(css);

    var sub = document.createElement('div');
    sub.className = 'rh-sub';
    var row = document.createElement('div');
    row.className = 'rh-sub-row';
    if (cfg.back) {
      var b = document.createElement('a');
      b.className = 'rh-back';
      b.href = cfg.back;
      b.textContent = '← Back';
      row.appendChild(b);
    }
    var nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Page sections');
    var links = [], targets = [];
    cfg.items.forEach(function (it, i) {
      var el = it[1] === '#rh-top' ? top : find(it[1]);
      if (!el) return;
      el.id = el.id || 'rh-s-' + i;
      var a = document.createElement('a');
      a.href = '#' + el.id;
      a.textContent = it[0];
      nav.appendChild(a);
      links.push(a); targets.push(el);
    });
    if (!links.length) return;
    row.appendChild(nav);
    sub.appendChild(row);
    var bar = document.createElement('div');
    bar.className = 'rh-bar';
    sub.appendChild(bar);
    top.parentNode.insertBefore(sub, top.nextSibling);

    function setOn(i) {
      links.forEach(function (a, n) {
        a.classList.toggle('on', n === i);
        if (n === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }
    setOn(0);
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) setOn(targets.indexOf(e.target)); });
      }, { rootMargin: '-25% 0px -65% 0px' });
      targets.forEach(function (t) { io.observe(t); });
    }
    function progress() {
      var d = document.documentElement;
      var max = d.scrollHeight - d.clientHeight;
      bar.style.width = (max > 0 ? (d.scrollTop / max) * 100 : 0) + '%';
    }
    progress();
    addEventListener('scroll', progress, { passive: true });
  }

  // wait until the page's own script has drawn its content
  function start() { setTimeout(build, 350); }
  if (document.readyState === 'complete') start(); else addEventListener('load', start);
})();