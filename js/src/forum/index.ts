import app from 'flarum/forum/app';
import { override } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import PrismHero from './components/PrismHero';

// Replace the default welcome hero on the discussion list with the customizable
// animated Prism hero (unless an admin has turned it off).
app.initializers.add('ernestdefoe-prism-hero', () => {
  override(IndexPage.prototype, 'hero', function (this: any, original: () => any) {
    if (app.forum.attribute('prismHero.enabled') === false) {
      return original();
    }
    return PrismHero.component();
  });
});
