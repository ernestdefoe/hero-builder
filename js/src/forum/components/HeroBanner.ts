import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';

declare const m: import('mithril').Static;

/**
 * The customizable, animated hero banner. Fully data-driven from the admin
 * Hero Studio settings (title, subtitle, any Font Awesome icon, a two-colour
 * gradient or a cover image, and optional community stats). No per-forum CSS.
 */
export default class HeroBanner extends Component {
  view() {
    const attr = (k: string): any => app.forum.attribute(k);

    const title = attr('heroBuilder.title') || attr('title');
    const subtitle = attr('heroBuilder.subtitle') || attr('description') || '';
    const icon = attr('heroBuilder.icon') || 'fas fa-meteor';
    const c1 = attr('heroBuilder.c1') || '#7c3aed';
    const c2 = attr('heroBuilder.c2') || '#ec4899';
    const image = attr('heroBuilder.image');
    const grad = `linear-gradient(135deg, ${c1}, ${c2})`;

    return m('div.HeroBanner', { style: { background: image ? '#0b0a14' : grad } }, [
      image ? m('img.HeroBanner-cover', { src: image, alt: '' }) : null,
      m('span.HeroBanner-blob', {
        style: { background: `radial-gradient(circle, ${c1}, transparent 70%)`, left: '-50px', top: '-80px' },
        'aria-hidden': 'true',
      }),
      m('span.HeroBanner-blob', {
        style: {
          background: `radial-gradient(circle, ${c2}, transparent 70%)`,
          right: '-40px',
          top: '-50px',
          animationDuration: '11s',
          animationDelay: '-3s',
        },
        'aria-hidden': 'true',
      }),
      m('span.HeroBanner-sheen', { 'aria-hidden': 'true' }),
      m('span.HeroBanner-wash', { 'aria-hidden': 'true' }),
      m('div.HeroBanner-body', [
        m('div.HeroBanner-badge', m('i', { className: icon, 'aria-hidden': 'true' })),
        m('div.HeroBanner-text', [
          m('h1.HeroBanner-title', title),
          subtitle ? m('p.HeroBanner-subtitle', subtitle) : null,
        ]),
        attr('heroBuilder.showStats') !== false ? this.stats() : null,
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
        m('div.HeroBanner-stat', [
          m('span.HeroBanner-stat-ico', m('i', { className: ico, title: label, 'aria-label': label })),
          m('span.HeroBanner-stat-num', value),
        ])
      );
    };

    // Counts are shown only when the forum exposes them (e.g. the Statistics
    // extension or a future serializer); otherwise the hero simply omits them.
    add(fmt(app.forum.attribute('discussionCount')), 'fas fa-comments', app.translator.trans('ernestdefoe-hero-builder.forum.discussions') as string);
    add(fmt(app.forum.attribute('postCount')), 'far fa-comment-dots', app.translator.trans('ernestdefoe-hero-builder.forum.posts') as string);

    return rows.length ? m('div.HeroBanner-stats', rows) : null;
  }
}
