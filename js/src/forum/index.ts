import app from 'flarum/forum/app';
import { override } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import HeroBanner from './components/HeroBanner';

// Replace the default welcome hero on the discussion list with the customizable
// animated hero banner (unless an admin has turned it off).
app.initializers.add('ernestdefoe-hero-builder', () => {
  override(IndexPage.prototype, 'hero', function (this: any, original: () => any) {
    if (app.forum.attribute('heroBuilder.enabled') === false) {
      return original();
    }
    return HeroBanner.component();
  });
});
