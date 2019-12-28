import { elementClass } from '../util';
import { __ } from '../i18n';

export let portrait = {
  name: 'portrait',
  key: 'char',
  defaults: {
    overprint: false,
    char: 'personal',
    copyright: true,
  },
  render(args, reg, doc) {
    // TODO get the right copyright attribution from the data
    const copyright = "Image &copy; Paizo Publishing";
    const caption = args.copyright ? `<figcaption>${__(copyright, doc)}</figcaption>` : '';
    const cls = elementClass('portrait', null, args, ['overprint'], { 'char': '' });
    return `<figure${cls}><div class='portrait__inner'></div>${caption}</figure>`;
  }
}
