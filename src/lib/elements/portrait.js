import { elementClass } from '../util/elements';
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
    let copyright = "";
    if (args.copyright) {
      switch (this.char) {
        case "personal":
          copyright = doc.getPortraitCopyright();
          break;
        case "animal-companion":
        case "familiar":
          copyright = doc.getAnimalCopyright();
          break;
      }
    }

    const caption = args.copyright ? `<figcaption>${__(copyright, doc)}</figcaption>` : '';
    const cls = elementClass('portrait', null, args, ['overprint'], { 'char': '' });
    return `<figure${cls}><div class='portrait__inner'></div>${caption}</figure>`;
  }
}
