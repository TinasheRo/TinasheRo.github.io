// Shared footer used on every page. Load this before the page's own script.
function SiteFooter() {
  const e = React.createElement;
  return e('footer', { id: 'contact', className: 'site-footer' },
    e('div', { className: 'wrap footer-row' },
      e('div', null,
        e('h2', null, 'Let’s Connect'),
        e('p', null, 'Interested in working together? Let’s chat.'),
        e('div', { className: 'footer-pills' },
          e('a', { className: 'pill', href: 'https://www.linkedin.com/in/roseannehwami', target: '_blank', rel: 'noreferrer' }, 'linkedin ↗'),
          e('a', { className: 'pill', href: 'mailto:roseannehwami@gmail.com' }, 'Email ↗'))),
      e('img', { className: 'footer-rose', src: 'assets/Unfurling_rose.svg', alt: '', width: 64, height: 64 })));
}
