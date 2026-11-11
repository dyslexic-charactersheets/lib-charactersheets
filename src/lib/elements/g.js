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
    mark: false,
    'mark-size': 'medium',
    'merge-bottom': false,
  },
  render(args, reg, doc) {
    const id = elementID('g', args.id);
    const cls = elementClass('g', null, args, ['pad', 'blk', 'mark', 'merge-bottom'], { 'galign': 'justify', 'valign': 'center', 'align': '', 'flex': 'medium', 'cut': 'none', 'mark-size': 'medium' });
    const mark = args.mark ? `<i class='mark icon_${args.mark}'></i>` : '';
    return `<div${id}${cls}>${mark}${reg.render(args.contents, doc)}</div>`;
  }
}
