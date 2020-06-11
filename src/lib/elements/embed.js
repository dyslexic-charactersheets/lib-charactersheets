import { isEmpty } from '../util';
import { elementClass } from '../util/elements';
import { interpolate } from '../util/objects';

export let embed = {
  name: 'embed',
  key: 'src',
  defaults: {
    src: '',
    contents: [],
    reverse: [],
    base: [],
  },
  render(args, reg, doc) {
    let contents = isEmpty(args.contents) ? '' : `<div class='embed__inner'>${reg.render(args.contents, doc)}</div>`;
    let reverse = isEmpty(args.reverse) ? '' : `<div class='embed__reverse'>${reg.render(args.reverse, doc)}</div>`;
    let base = isEmpty(args.base) ? '' : `<div class='embed__base'>${reg.render(args.base, doc)}</div>`;
    let baseRev = isEmpty(args.base) ? '' : `<div class='embed__base-reverse'>${reg.render(args.base, doc)}</div>`;


    args.src = interpolate(args.src, {}, doc);
    const cls = elementClass('embed', null, args, ['blk'], { 'src': '' });
    return `<div${cls}>${reverse}${contents}${base}${baseRev}</div>`;
  }
}
