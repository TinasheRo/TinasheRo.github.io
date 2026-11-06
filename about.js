const h = React.createElement;

const NAV = [
  { label: 'Work', href: 'index.html#work' },
  { label: 'About', href: 'about.html', current: true },
  { label: 'Email', href: 'mailto:roseannehwami@gmail.com' },
  { label: 'Resume', href: 'Resume6.pdf', external: true },
];

// Tries each path in turn until one loads
const PHOTOS = ['assets/about-photo.jpg', 'assets/about-photo.png', 'about-photo.jpg', 'about-photo.png'];

const EXPERIENCE = [
  { role: 'Software Developer', org: 'York Community Consulting', logo: 'assets/logo-ycc.svg', text: 'Developing user-focused web solutions through front-end development and UX/UI.' },
  { role: 'UX/UI design Intern', org: 'Foxlove Revenue', logo: 'assets/logo-foxlove.svg', text: 'Conducted user interviews, designed UI solutions, and iterated based on user feedback.' },
  { role: 'Design Deputy Lead', org: 'Interactive Media Showcase @2025', logo: 'assets/logo-showcase.png', text: 'Led visual design decisions, merchandise creation, and collaboration with marketing and technical teams.' },
];

const TOOLS = [
  { name: 'Adobe Creative Suite', time: '2 years', text: 'Experience using Photoshop and Adobe Premiere Pro.', href: '#' },
  { name: 'Figma', time: '3+ years', text: 'Experience designing in Figma.', href: 'index.html#work' },
  { name: 'Front End Development', time: '1 year', text: 'Using Visual Studio Code, including HTML, CSS and JS.', href: 'index.html#work' },
  { name: 'Blender', time: '2+ years', text: 'Experience using Blender.', href: '#' },
  { name: 'Content Creation', time: '7 months', text: 'Experience in content creation.', href: '#' },
  { name: 'Marketing', time: '3 months', text: 'Experience in digital marketing.', href: '#' },
];


const SECTIONS = [
  { id: 'overview', nav: 'Overview' },
  { id: 'approach', nav: '01 / My approach' },
  { id: 'experience', nav: '02 / Experience' },
  { id: 'moments', nav: '03 / Moments' },
  { id: 'toolkit', nav: '04 / Creative toolkit' },
];

function useActive() {
  const [active, setActive] = React.useState('overview');
  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-25% 0px -65% 0px' });
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); el && io.observe(el); });
    return () => io.disconnect();
  }, []);
  return active;
}

function SubNav({ active }) {
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    const f = () => { const d = document.documentElement; setPct((d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100); };
    f(); addEventListener('scroll', f, { passive: true });
    return () => removeEventListener('scroll', f);
  }, []);
  return h('div', { className: 'subnav' },
    h('div', { className: 'wrap subnav-row' },
      h('a', { className: 'back', href: 'index.html' }, '← Back'),
      h('nav', { 'aria-label': 'Page sections' },
        SECTIONS.map((s) => h('a', { key: s.id, href: '#' + s.id, className: active === s.id ? 'on' : '', 'aria-current': active === s.id ? 'true' : undefined }, s.nav)))),
    h('div', { className: 'bar', style: { width: pct + '%' } }));
}

function Header() {
  return h('header', { className: 'site-header wrap' },
    h('a', { className: 'brand', href: 'index.html', 'aria-label': 'Rose + Anne, home' },
      h('img', { className: 'brand-mark', src: 'assets/Brand__rose.svg', alt: '', width: 23, height: 23 }), 'Rose + Anne'),
    h('nav', { className: 'nav', 'aria-label': 'Main' },
      NAV.map((n) => h('a', {
        key: n.label, href: n.href,
        ...(n.current && { 'aria-current': 'page' }),
        ...(n.external && { target: '_blank', rel: 'noreferrer' }),
      }, n.label))));
}

function Hero() {
  const blobs = React.useRef(null);
  useHeroBlobs(blobs);
  return h('div', { className: 'blob-bg' },
    h('div', { className: 'blobs', ref: blobs, 'aria-hidden': 'true' }, h('i'), h('i'), h('i')),
    h('section', { id: 'overview', className: 'wrap about-hero' },
    h('div', null,
      h('p', { className: 'eyebrow' }, 'About me / In full bloom'),
      h('h1', null, 'Meet Roseanne', h('svg', { className: 'flourish', viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' },
        [0, 60, 120, 180, 240, 300].map((d) => h('path', { key: d, d: 'M12 12 L11 1.5 Q17 4 12 12 Z', transform: 'rotate(' + d + ' 12 12)' })))),
      h('h2', null, 'A curious product designer, built to solve real problems.'),
      h('p', { className: 'lede' }, 'Every product I design starts with understanding the people I’m designing for. This photo captures that philosophy. The tools aren’t the main course, they’re simply the ingredients I use to create meaningful experiences.')),
    h('figure', { className: 'portrait' },
      h('img', {
        src: PHOTOS[0],
        alt: 'Roseanne holding a plate decorated with design tool icons: Figma, Blender, Photoshop, Premiere Pro, CSS, JS and GitHub',
        onError: (e) => {
          const i = Number(e.currentTarget.dataset.try || 0) + 1;
          if (i < PHOTOS.length) { e.currentTarget.dataset.try = i; e.currentTarget.src = PHOTOS[i]; }
        },
      }),
      h('figcaption', null, 'The tools are ingredients. People come first.'))));
}

function Approach() {
  return h('section', { id: 'approach', className: 'sec dark approach' },
    h('div', { className: 'wrap' },
      h('p', { className: 'eyebrow' }, '01 / My approach'),
      h('h2', null, 'People first. Possibilities next.'),
      h('div', { className: 'two' },
        h('p', null, 'I’m a Product Designer who enjoys turning messy data and complex workflows into clear, meaningful experiences. I bring together marketing, UX/UI design and front-end development to connect what people need with solutions that make a real difference'),
        h('p', null, 'My design philosophy grew from studying Psychology at A level: understand people first, then design around what they need. I bring that curiosity to my role as Lead UX Designer for Foxlove Revenue, turning user insights into clear, useful experiences. As a Marketing Assistant at the University of York, I use storytelling to connect with prospective students and make information more engaging.'))));
}

function Experience() {
  return h('section', { id: 'experience', className: 'sec exp' },
    h('div', { className: 'wrap' },
      h('p', { className: 'eyebrow' }, '02 / Experience'),
      h('h2', { className: 'sec-title' }, 'Designing, building & bringing people together.'),
      h('ul', { className: 'grid3' }, EXPERIENCE.map((e) =>
        h('li', { key: e.role },
          h('article', { className: 'card' },
            h('img', { className: 'logo' + (e.logo.endsWith('.png') ? ' pixel' : ''), src: e.logo, alt: '', onError: (ev) => { ev.currentTarget.style.display = 'none'; } }),
            h('h3', null, e.role),
            h('p', { className: 'org' }, e.org),
            h('p', null, e.text)))))));
}


const MOMENTS = [
  { img: 'assets/gallery-design-poster.jpg', tag: 'Showcase 2025', title: 'Design Deputy', text: 'Leading visual design decisions, merchandise and collaboration with the marketing and technical teams.', alt: 'Design Team poster for the 2025 Interactive Media Showcase featuring Roseanne as Deputy Lead alongside Patrick and Yeonsu' },
  { img: 'assets/gallery-black-access.jpg', tag: 'Black Access', title: 'The Black Access team', text: 'With the Black Access team, where I worked as a content creator.', alt: 'The Black Access team standing together in a group on the lawn outside a university building' },
  { img: 'assets/gallery-showcase-2026.jpg', tag: 'Showcase 2026', title: 'My work on show', text: 'Setting up my project for visitors to play at the Interactive Media Showcase.', alt: 'A computer station with a Who Poisoned Pippy? title screen, crime scene tape and newspaper clippings on a dark curtain' },
  { img: 'assets/gallery-open-day.jpg', tag: 'Open Day', title: 'Presented to future students', text: 'My project on the Interactive Media stand, alongside course information for prospective students.', alt: 'The Interactive Media Open Day stand with project boards, a laptop and course information on a table' },
];

function Gallery() {
  const { useRef, useState, useEffect } = React;
  const track = useRef(null);
  const [cur, setCur] = useState(0);
  const go = (i) => {
    const t = track.current, c = t.children[Math.max(0, Math.min(MOMENTS.length - 1, i))];
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    t.scrollTo({ left: c.offsetLeft, behavior: calm ? 'auto' : 'smooth' });
  };
  useEffect(() => {
    const t = track.current;
    const f = () => {
      if (t.scrollLeft + t.clientWidth >= t.scrollWidth - 4) return setCur(MOMENTS.length - 1);
      let best = 0, d = 1e9;
      [...t.children].forEach((c, i) => { const x = Math.abs(c.offsetLeft - t.scrollLeft); if (x < d) { d = x; best = i; } });
      setCur(best);
    };
    t.addEventListener('scroll', f, { passive: true }); f();
    return () => t.removeEventListener('scroll', f);
  }, []);
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
  };
  const num = (n) => String(n + 1).padStart(2, '0');
  return h('section', { id: 'moments', className: 'sec moments' },
    h('div', { className: 'wrap' },
      h('p', { className: 'eyebrow' }, '03 / Moments'),
      h('div', { className: 'moments-head' },
        h('h2', { className: 'sec-title' }, 'Behind the work, in the room.'),
        h('div', { className: 'ctrl' },
          h('span', { className: 'count', 'aria-live': 'polite' }, num(cur) + ' / ' + num(MOMENTS.length - 1)),
          h('button', { className: 'arrow', onClick: () => go(cur - 1), disabled: cur === 0, 'aria-label': 'Previous photo' }, '←'),
          h('button', { className: 'arrow', onClick: () => go(cur + 1), disabled: cur === MOMENTS.length - 1, 'aria-label': 'Next photo' }, '→'))),
      h('div', { className: 'track', ref: track, tabIndex: 0, role: 'region', 'aria-roledescription': 'carousel', 'aria-label': 'Photos from showcases and open day', onKeyDown: onKey },
        MOMENTS.map((m, i) => h('figure', { key: m.img, className: 'slide' + (i === cur ? ' on' : ''), 'aria-label': (i + 1) + ' of ' + MOMENTS.length },
          h('img', { src: m.img, alt: m.alt, loading: 'lazy', draggable: false }),
          h('figcaption', null, h('span', { className: 'pill-sm' }, m.tag), h('h3', null, m.title), h('p', null, m.text))))),
      h('div', { className: 'dots' }, MOMENTS.map((m, i) =>
        h('button', { key: m.img, className: i === cur ? 'on' : '', onClick: () => go(i), 'aria-label': 'Go to photo ' + (i + 1) + ': ' + m.title, 'aria-current': i === cur ? 'true' : undefined })))));
}

function Toolkit() {
  return h('section', { id: 'toolkit', className: 'sec' },
    h('div', { className: 'wrap' },
      h('p', { className: 'eyebrow' }, '04 / Creative toolkit'),
      h('h2', { className: 'sec-title' }, 'A few tools. Many possibilities.'),
      h('ul', { className: 'grid3 tools' }, TOOLS.map((t) =>
        h('li', { key: t.name },
          h('article', { className: 'card' },
            h('h3', null, t.name),
            h('span', { className: 'pill-sm' }, t.time),
            h('p', null, t.text),
            h('a', { className: 'more', href: t.href }, 'Check out my examples →')))))));
}

function App() {
  const active = useActive();
  return h(React.Fragment, null,
    h(Header), h(SubNav, { active }),
    h('main', null, h(Hero), h(Approach), h(Experience), h(Gallery), h(Toolkit)),
    h(SiteFooter));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));