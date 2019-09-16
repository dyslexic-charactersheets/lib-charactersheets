import { elementClass, getLabelHeight, getRubyHeight } from '../util';

export let row = {
  name: 'row',
  key: 'layout',
  defaults: {
    contents: [],
    layout: 'left',
    valign: 'bottom',
    unlabelled: false,
    narrow: false,
    pad: false
  },
  render(args, reg, doc) {
    args.lp = getLabelHeight(args);
    args.rb = getRubyHeight(args);
    var cls = elementClass('row', null, args, ['unlabelled', 'narrow', 'pad'], { 'layout': 'left', 'valign': 'bottom', 'lp': '', 'rb': '', 'flex': 'medium' });
    return `<div${cls}><div class='row__inner'>${reg.render(args.contents, doc)}</div></div>`;
  }
}
