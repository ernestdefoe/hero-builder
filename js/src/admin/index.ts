import app from 'flarum/admin/app';

// The Hero Studio: a simple, complete settings form. The icon is a free-text
// Font Awesome field (type any class — not a fixed preset list).
app.initializers.add('ernestdefoe-prism-hero', () => {
  const K = 'ernestdefoe-prism-hero';
  const t = (k: string) => app.translator.trans(`${K}.admin.${k}`);

  app.extensionData
    .for(K)
    .registerSetting({ setting: `${K}.enabled`, type: 'boolean', label: t('enabled') })
    .registerSetting({ setting: `${K}.title`, type: 'text', label: t('title'), placeholder: t('title_placeholder') })
    .registerSetting({ setting: `${K}.subtitle`, type: 'text', label: t('subtitle') })
    .registerSetting({ setting: `${K}.icon`, type: 'text', label: t('icon'), help: t('icon_help'), placeholder: 'fas fa-meteor' })
    .registerSetting({ setting: `${K}.c1`, type: 'text', label: t('c1'), placeholder: '#7c3aed' })
    .registerSetting({ setting: `${K}.c2`, type: 'text', label: t('c2'), placeholder: '#ec4899' })
    .registerSetting({ setting: `${K}.image`, type: 'text', label: t('image'), help: t('image_help') })
    .registerSetting({ setting: `${K}.showStats`, type: 'boolean', label: t('show_stats') });
});
