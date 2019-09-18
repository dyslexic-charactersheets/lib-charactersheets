import { elementClass } from '../util';
import { __ } from '../i18n';

export let portrait = {
  name: 'portrait',
  key: 'char',
  defaults: {
    overprint: false,
    char: 'personal',
  },
  render(args, reg, doc) {
    // TODO get the right copyright attribution from the data
    const copyright = "Image &copy; Paizo Publishing";
    const cls = elementClass('portrait', null, args, ['overprint'], { 'char': '' });
    return `<figure${cls}><div class='portrait__inner'></div><figcaption>${__(copyright, doc)}</figcaption></figure>`;
  }
}
