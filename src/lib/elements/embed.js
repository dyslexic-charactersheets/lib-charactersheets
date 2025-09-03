/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { isEmpty, isNumber } from '../util';
import { __, _e } from '../i18n';
import { elementID, elementClass } from '../util/elements';
import { interpolate } from '../util/objects';
import { log } from '../log';

export let embed = {
  name: 'embed',
  key: 'src',
  defaults: {
    src: '',
    contents: [],
    repeat: false,
    reverse: [],
    base: [],
    labels: [],
  },
  render(args, reg, doc) {
    let contents = '';
    if (args.repeat && isNumber(args.repeat)) {
      contents = []
      for (let i = 1; i <= args.repeat; i++) {
        let items = interpolate(args.contents, {i}, doc);
        let embedInner = `<div class='embed__inner embed__inner-${i}'>${reg.render(items, doc)}</div>`;
        contents.push(embedInner);
      }
      contents = contents.join('');
    } else {
      contents = isEmpty(args.contents) ? '' : `<div class='embed__inner'>${reg.render(args.contents, doc)}</div>`;
    }
    let reverse = isEmpty(args.reverse) ? '' : `<div class='embed__reverse'>${reg.render(args.reverse, doc)}</div>`;
    let base = isEmpty(args.base) ? '' : `<div class='embed__base'>${reg.render(args.base, doc)}</div>`;
    let baseRev = isEmpty(args.base) ? '' : `<div class='embed__base-reverse'>${reg.render(args.base, doc)}</div>`;

    let labels = args.labels.map((label) => {
      log("embed", "Label", label);
      let cls = elementClass('embed', 'label', label, ['accent'], { 'label': '', 'align': '', 'size': 'medium', 'rotate': '' });
      return `<label${cls}>${_e(label.text, doc)}</label>`
    }).join('');

    args.src = interpolate(args.src, {}, doc);
    const cls = elementClass('embed', null, args, ['blk'], { 'src': '' });
    return `<div${cls}>${reverse}${contents}${base}${baseRev}${labels}</div>`;
  }
}
