import app from 'flarum/admin/app';
import Admin from 'flarum/common/extenders/Admin';

// Hero Builder settings, declared via Flarum 2's JS Admin extender. This replaces
// the removed 1.x `app.extensionData.for(...).registerSetting()` API (using it
// throws "Hero Builder failed to initialize"). Each .setting() takes a FUNCTION
// that returns the config object. The icon is a free-text field — type any Font
// Awesome class, not a fixed preset list.
const K = 'ernestdefoe-hero-builder';
const t = (k: string) => app.translator.trans(`${K}.admin.${k}`);

export default [
  new Admin()
    .setting(() => ({ setting: `${K}.enabled`, type: 'boolean', label: t('enabled') }))
    .setting(() => ({ setting: `${K}.title`, type: 'text', label: t('title'), placeholder: t('title_placeholder') }))
    .setting(() => ({ setting: `${K}.subtitle`, type: 'text', label: t('subtitle') }))
    .setting(() => ({ setting: `${K}.icon`, type: 'text', label: t('icon'), help: t('icon_help'), placeholder: 'fas fa-meteor' }))
    .setting(() => ({ setting: `${K}.c1`, type: 'text', label: t('c1'), placeholder: '#7c3aed' }))
    .setting(() => ({ setting: `${K}.c2`, type: 'text', label: t('c2'), placeholder: '#ec4899' }))
    .setting(() => ({ setting: `${K}.image`, type: 'text', label: t('image'), help: t('image_help') }))
    .setting(() => ({ setting: `${K}.showStats`, type: 'boolean', label: t('show_stats') })),
];
