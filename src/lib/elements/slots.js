import { isArray, isString } from '../util';
import { cloneDeep, has, interpolate } from '../util/objects';
import { mergeBottom } from '../util/elements';
import { log, warn } from '../log';
// import { mergeBottom } from '../classes/Registry';

export let slots = {
  name: 'slots',
  key: 'slots',
  defaults: {
    slots: [],
    key: 'level',
    placeholder: null,
    max: false,
    min: false,
    reduce: 0,
    extra: 0,
    index: 'i',
    even: false,
    contents: [],
  },
  transform(args, ctx) {
    // log("slots", "Args slots:", args.slots);

    let placeholder = args.placeholder;
    if (!isArray(placeholder))
      placeholder = [placeholder];

    if (ctx.largePrint && args.reduce > 0) {
      args.min -= args.reduce;
      args.max -= args.reduce;
    }

    function slotItems(items, slotValues) {
      // log("slots", "Slot items", items, slotValues);
      if (args.min && items.length < args.min) {
        const n = args.min - items.length;
        for (let i = 0; i < n; i++) {
          let values = cloneDeep(slotValues);
          values[args.index] = i;
          // log("slots", "Placeholder slot", values);

          let placeholder = interpolate(cloneDeep(args.placeholder), values);
          items = items.concat(placeholder);
        }
      }
      if (args.max && items.length > args.max) {
        items = items.slice(0, args.max);
      }

      return items;
    }

    if (args.slots === null || args.slots == []) {
      // log("slots","Single slot");
      let contents = slotItems(args.contents, {});
      if (args['merge-bottom']) {
        contents = mergeBottom(contents);
      }
      return contents;
    }

    let slots = {};
    if (!isArray(args.slots)) {
      if (isString(args.slots)) {
        args.slots = args.slots.split(/,/);
      } else {
        warn("slots", "Not a list of slots:", args.slots);
      }
    }
    let i = 1;
    args.slots.forEach(s => {
      slots[s] = {
        key: s,
        contents: []
      };
      slots[s][args.key] = s;
      slots[s][args.index] = i++;
    });

    // log("slots","Filled", slots);
    args.contents.forEach(item => {
      if (!has(item, args.key))
        return;
      if (has(slots, item[args.key])) {
        slots[item[args.key]].contents.push(item);
      }
    });
    for (const [n, s] of Object.entries(slots)) {
      // log("slots","Slot", s.key);
      s.contents = slotItems(s.contents, s);
      s.contents.forEach(item => item[args.key] = s.key);
      // log("slots","Slot", s.key, "items", s.contents);
    };

    // log("slots", "Final slots:", JSON.stringify(slots, null, 2));
    let contents = Object.values(slots).flatMap(s => s.contents);

    //let blank = {};
    //blank[args.key] = '';
    const blank = {
      [args.key]: ''
    };

    // 'extra' slots: add a fixed number of placeholders
    for (let j = 0; j < args.extra; j++) {
      let values = cloneDeep(blank);
      values[args.index] = 'extra-'+i++;
      log("slots", "Extra slots", values);

      let add = cloneDeep(args.placeholder);
      add = interpolate(add, values);
      contents = contents.concat(add);
    }

    // 'balance' slot: if the list isn't even, add one more to balance them up
    if (args.even && contents.length % 2 != 0) {
      let values = cloneDeep(blank);
      values[args.index] = 'extra-'+i++;
      log("slots", "Balance slot", values);

      let add = cloneDeep(args.placeholder);
      add = interpolate(add, values);
      contents = contents.concat(add);
    }

    // log("slots", contents);
    if (args['merge-bottom']) {
      contents = mergeBottom(contents);
    }
    return contents;
  }
}
