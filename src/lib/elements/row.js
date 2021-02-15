import { elementClass, getRubyHeight } from '../util/elements';

export let row = {
  name: 'row',
  key: 'layout',
  defaults: {
    contents: [],
    layout: 'left',
    valign: 'bottom',
    unlabelled: false,
    narrow: false,
    blk: true
  },
  render(args, reg, doc) {
    // args.lp = getLabelHeight(args);
    args.rb = getRubyHeight(args);
    const cls = elementClass('row', null, args, ['unlabelled', 'narrow', 'blk', 'pad'], { 'layout': 'left', 'valign': 'bottom', 'rb': '', 'flex': 'medium' });
    return `<div${cls}><div class='row__inner'>${reg.render(args.contents, doc)}</div></div>`;
  }
}
