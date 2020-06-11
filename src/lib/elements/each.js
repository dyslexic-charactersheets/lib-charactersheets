import { interpolate, isObject, isString } from '../util';
import { cloneDeep, has } from '../util/objects';
// import { log } from '../log';

export let each = {
  name: 'each',
  key: '',
  defaults: {
    template: '',
    index: 'i',
    rows: [],
    params: {},
    map: {},
    contents: [],
  },
  transform(args) {
    let i = 0;
    // log("each", "Items", args.contents);
    return args.contents.flatMap(item => {
      i++;

      let values = cloneDeep(args.params);
      if (i < args.rows.length && isObject(args.rows[i]))
        values = { ...args.rows[i], ...values };

      if (isString(item) && has(args.map, item)) {
        values = { ...args.map[item], ...values, item: item };
      } else {
        values = { ...item, ...values, item: cloneDeep(item) };
      }
      values[args.index] = i;

      // log("each", "Template", args.template);
      // log("each", "Values", values);
      const product = interpolate(args.template, values);
      // log("each", "Product", values);
      return product;
    });
  }
}
