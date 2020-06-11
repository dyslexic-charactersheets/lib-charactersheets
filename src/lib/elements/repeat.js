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
    "merge-bottom": false,
    rows: []
  },
  transform(args, ctx) {
    let contents = [];

    let repeat = args.repeat;
    if (!repeat) {
      if (!isEmpty(args.rows))
        repeat = args.rows.length;
      else
        repeat = 1;
    }
    if (ctx.largePrint && args.reduce > 0)
      repeat -= args.reduce;

    for (let i = 1; i <= repeat; i++) {
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
