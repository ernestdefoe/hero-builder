<?php

/*
 * Hero Builder for Flarum 2 — a customizable, animated discussion-list hero,
 * per home page AND per tag, configured in a live Hero Studio. MIT licensed.
 * No core files touched: settings drive everything and the hero is rendered
 * client-side over the IndexPage (which Flarum reuses for tag pages).
 */

use ErnestDefoe\HeroBuilder\Api;
use Flarum\Api\Resource\ForumResource;
use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),

    // The admin loads the same hero CSS so the Hero Studio live preview
    // matches, plus the Studio's own styles, which forum visitors never need.
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/forum.less')
        ->css(__DIR__.'/less/admin.less'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\Settings())
        // Master on/off, on until an admin turns it off.
        ->default('ernestdefoe-hero-builder.enabled', '1')
        ->serializeToForum('heroBuilder.enabled', 'ernestdefoe-hero-builder.enabled', fn ($v) => (bool) (int) $v),

    // The hero map (filtered to the tags the visitor can see) and the cached
    // live counts. An invokable class so its dependencies are injected.
    (new Extend\ApiResource(ForumResource::class))
        ->fields(Api\ForumHeroFields::class),
];
