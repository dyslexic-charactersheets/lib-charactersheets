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
    fade: false,
    cut: 'none',
    level: false,
  },
  render(args, reg, doc) {
    const id = elementID('g', args.id);
    const cls = elementClass('g', null, args, ['pad', 'blk', 'fade'], { 'galign': 'justify', 'valign': 'center', 'align': '', 'flex': 'medium', 'cut': 'none' });
    const level = (args.level !== false && args.level !== '') ? ` data-level='${args.level}'` : '';
    return `<div${id}${cls}${level}>${reg.render(args.contents, doc)}</div>`;
  }
}
