/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

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
    let cls = elementClass('color', null, args, ['blk'], {color: ''});
    return `<div${cls}>${reg.render(args.contents, doc)}</div>`;
  }
}
