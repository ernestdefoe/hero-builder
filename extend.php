<?php

/*
 * Prism Hero for Flarum 2 — a customizable, animated discussion-list hero.
 * MIT licensed. No core files touched: settings drive everything and the hero
 * is rendered client-side over the IndexPage.
 */

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    // Expose the hero config to the forum frontend. The admin (Hero Studio)
    // writes these; the forum reads them via app.forum.attribute('prismHero.*').
    (new Extend\Settings())
        // enabled / showStats default to TRUE when unset. Flarum's
        // serializeToForum has no default argument, so the closure supplies it
        // (a plain 'boolval' would turn the unset null into false).
        ->serializeToForum('prismHero.enabled', 'ernestdefoe-prism-hero.enabled', fn ($v) => $v === null ? true : (bool) (int) $v)
        ->serializeToForum('prismHero.title', 'ernestdefoe-prism-hero.title')
        ->serializeToForum('prismHero.subtitle', 'ernestdefoe-prism-hero.subtitle')
        // title/subtitle/icon/colours fall back to sensible defaults forum-side.
        ->serializeToForum('prismHero.icon', 'ernestdefoe-prism-hero.icon')
        ->serializeToForum('prismHero.c1', 'ernestdefoe-prism-hero.c1')
        ->serializeToForum('prismHero.c2', 'ernestdefoe-prism-hero.c2')
        ->serializeToForum('prismHero.image', 'ernestdefoe-prism-hero.image')
        ->serializeToForum('prismHero.showStats', 'ernestdefoe-prism-hero.showStats', fn ($v) => $v === null ? true : (bool) (int) $v),
];
