import { elementClass } from '../util';

export let g = {
  name: 'g',
  key: '',
  defaults: {
    contents: [],
    galign: 'justify',
    valign: 'center',
    flex: 'medium',
    pad: false,
  },
  render(args, reg, doc) {
    const cls = elementClass('g', null, args, ['pad'], { 'galign': 'justify', 'valign': 'center', 'flex': 'medium' });
    return `<div${cls}>${reg.render(args.contents, doc)}</div>`;
  }
}
