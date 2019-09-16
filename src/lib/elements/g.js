import { elementClass } from '../util';

export let g = {
  name: 'g',
  key: '',
  defaults: {
    contents: [],
    galign: 'justify',
    valign: 'center',
    padg: false,
  },
  render(args, reg, doc) {
    var cls = elementClass('g', null, args, ['pad'], { 'galign': 'justify', 'valign': 'center' });
    return `<div${cls}>${reg.render(args.contents, doc)}</div>`;
  }
}
