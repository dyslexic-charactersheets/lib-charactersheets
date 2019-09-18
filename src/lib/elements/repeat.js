import { interpolate } from '../util';

export let repeat = {
  name: 'repeat',
  key: 'repeat',
  defaults: {
    repeat: 1,
    reduce: 0,
    index: "i",
    rows: []
  },
  transform(args, ctx) {
    let contents = [];

    if (ctx.largePrint && args.reduce > 0)
      args.repeat -= args.reduce;

    for (let i = 1; i <= args.repeat; i++) {
      let vars = {};
      if (i <= args.rows.length) {
        vars = args.rows[i - 1];
      }
      vars[args.index] = i;
      const items = interpolate(args.contents, vars);
      contents = contents.concat(items);
    }

    return contents;
  }
}
