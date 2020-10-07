import { elementClass } from '../util/elements';

export let color = {
  name: 'color',
  key: 'color',
  defaults: {
    color: 'base',
    blk: false,
    contents: []
  },
  render (args, reg, doc) {
    log("color", "Color block:", args.color);
    let cls = elementClass('color', null, args, ['blk'], {color: ''});
    return `<div${cls}>${reg.render(args.contents, doc)}</div>`;
  }
}
