/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { elementID, elementClass } from '../util/elements';

export let g = {
  name: 'g',
  key: '',
  defaults: {
    id: '',
    contents: [],
    galign: 'justify',
    valign: 'center',
    align: '',
    flex: 'medium',
    blk: false,
    pad: false,
    cut: 'none',
  },
  render(args, reg, doc) {
    const id = elementID('g', args.id);
    const cls = elementClass('g', null, args, ['pad', 'blk'], { 'galign': 'justify', 'valign': 'center', 'align': '', 'flex': 'medium', 'cut': 'none' });
    return `<div${id}${cls}>${reg.render(args.contents, doc)}</div>`;
  }
}
