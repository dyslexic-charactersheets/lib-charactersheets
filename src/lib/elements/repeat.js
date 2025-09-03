/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { isEmpty, toBoolean } from '../util';
import { interpolate } from '../util/objects';

export let repeat = {
  name: 'repeat',
  key: 'repeat',
  defaults: {
    repeat: 0,
    reduce: 0,
    contents: [],
    index: "i",
    start: 1,
    "merge-bottom": false,
    rows: []
  },
  transform(args, ctx) {
    let contents = [];

    let repeat = parseInt(args.repeat);
    if (!repeat) {
      if (!isEmpty(args.rows))
        repeat = args.rows.length;
      else
        repeat = 1;
    }
    if (ctx.largePrint && args.reduce > 0)
      repeat -= parseInt(args.reduce);

    let start = parseInt(args.start);
    let end = start + repeat;
    for (let i = start; i < end; i++) {
      let vars = {};
      if (i <= args.rows.length) {
        vars = args.rows[i - 1];
      }
      vars[args.index] = i;
      const items = interpolate(args.contents, vars);
      contents = contents.concat(items);
    }

    if (toBoolean(args["merge-bottom"])) {
      contents[contents.length - 1]["merge-bottom"] = true;
    }

    return contents;
  }
}
