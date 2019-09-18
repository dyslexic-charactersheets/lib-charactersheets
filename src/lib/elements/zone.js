import { has, cloneDeep } from '../util';

export let zone = {
  name: 'zone',
  key: 'zone',
  defaults: {
    zone: '',
    sort: false,
  },
  transform(args, ctx) {
    // log("zone", "Zone", args.zone);
    let existing = has(args, "contents") && args.contents ? args.contents : [];
    const insert = has(ctx.zones, args.zone) ? cloneDeep(ctx.zones[args.zone]) : [];

    const replace = insert.reduce((repl, element) => repl || element.replace, false);
    if (replace) {
      existing = [];
    }

    let contents = existing.concat(insert);
    // const contents = [ ...existing, ...insert ];
    // log("-","[zone] Contents", contents);

    // sort the contents
    if (args.sort) {
      // log("-","[zone] Sorting");
      contents = contents.map(subelement => ({ level: 1, order: 1, ...subelement }));
      contents = contents.sort((a, b) => {
        if (a.level != b.level)
          return a.level - b.level;
        if (a.order != b.order)
          return a.order - b.order;
        if (a.primary && !b.primary)
          return -1;
        if (b.primary && !a.primary)
          return 1;
        return 0;
      });
    }

    return contents;
  }
}
