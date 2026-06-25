import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';

declare const m: import('mithril').Static;

/**
 * The customizable, animated hero banner. Fully data-driven from the admin
 * Hero Studio settings (title, subtitle, any Font Awesome icon, a two-colour
 * gradient or a cover image, and optional community stats). No per-forum CSS.
 */
export default class PrismHero extends Component {
  view() {
    const attr = (k: string): any => app.forum.attribute(k);

    const title = attr('prismHero.title') || attr('title');
    const subtitle = attr('prismHero.subtitle') || attr('description') || '';
    const icon = attr('prismHero.icon') || 'fas fa-meteor';
    const c1 = attr('prismHero.c1') || '#7c3aed';
    const c2 = attr('prismHero.c2') || '#ec4899';
    const image = attr('prismHero.image');
    const grad = `linear-gradient(135deg, ${c1}, ${c2})`;

    return m('div.PrismHero', { style: { background: image ? '#0b0a14' : grad } }, [
      image ? m('img.PrismHero-cover', { src: image, alt: '' }) : null,
      m('span.PrismHero-blob', {
        style: { background: `radial-gradient(circle, ${c1}, transparent 70%)`, left: '-50px', top: '-80px' },
        'aria-hidden': 'true',
      }),
      m('span.PrismHero-blob', {
        style: {
          background: `radial-gradient(circle, ${c2}, transparent 70%)`,
          right: '-40px',
          top: '-50px',
          animationDuration: '11s',
          animationDelay: '-3s',
        },
        'aria-hidden': 'true',
      }),
      m('span.PrismHero-sheen', { 'aria-hidden': 'true' }),
      m('span.PrismHero-wash', { 'aria-hidden': 'true' }),
      m('div.PrismHero-body', [
        m('div.PrismHero-badge', m('i', { className: icon, 'aria-hidden': 'true' })),
        m('div.PrismHero-text', [
          m('h1.PrismHero-title', title),
          subtitle ? m('p.PrismHero-subtitle', subtitle) : null,
        ]),
        attr('prismHero.showStats') !== false ? this.stats() : null,
      ]),
    ]);
  }

  stats() {
    const fmt = (n: any): string | null =>
      n == null ? null : n >= 1000 ? Math.round(n / 100) / 10 + 'k' : String(n);

    const rows: any[] = [];
    const add = (value: string | null, ico: string, label: string) => {
      if (value == null) return;
      rows.push(
        m('div.PrismHero-stat', [
          m('span.PrismHero-stat-ico', m('i', { className: ico, title: label, 'aria-label': label })),
          m('span.PrismHero-stat-num', value),
        ])
      );
    };

    // Counts are shown only when the forum exposes them (e.g. the Statistics
    // extension or a future serializer); otherwise the hero simply omits them.
    add(fmt(app.forum.attribute('discussionCount')), 'fas fa-comments', app.translator.trans('ernestdefoe-prism-hero.forum.discussions') as string);
    add(fmt(app.forum.attribute('postCount')), 'far fa-comment-dots', app.translator.trans('ernestdefoe-prism-hero.forum.posts') as string);

    return rows.length ? m('div.PrismHero-stats', rows) : null;
  }
}
