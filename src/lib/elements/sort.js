/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { isString, isNumber, isArray } from '../util';
import { has } from '../util/objects';
import { log } from '../log';

export let sort = {
  name: 'sort',
  key: 'orderby',
  defaults: {
    orderby: '',
    order: 'ASC',
    unique: false,
    group: false,
    group_hr: false,
    contents: []
  },
  transform(args, ctx) {
    let key = args.orderby;
    let isEmbedKey = false;
    if (key != null && key.charAt(0) == '.') {
      isEmbedKey = true;
      key = key.substring(1);
    }
    // log("sort", `Sorting ${args.contents.length} items by ${key}`);
    // log("sort", JSON.stringify(args.contents, null, 2));

    let defaultValue = false;
    if (args.orderby == 'level' || args.orderby == 'order') {
      defaultValue = 1;
    }

    let contents = args.contents;
    if (args.unique) {
      contents = [...new Set(contents)];
    }

    function elementSortValue(elem) {
      if (isString(elem)) {
        return elem;
      }
      if (has(elem, key)) {
        return elem[key];
      }
      if (isEmbedKey && has(elem, "contents") && isArray(elem.contents) && elem.contents.length > 0) {
        let subelem = elem.contents[0];
        if (has(subelem, key)) {
          return subelem[key];
        }
      }
      return defaultValue;
    }
    
    contents = contents.sort((a, b) => {
      const ka = isString(a) ? a : (has(a, key) ? a[key] : defaultValue);
      const kb = isString(b) ? b : (has(b, key) ? b[key] : defaultValue);
      if (!ka && !kb) return 0;
      if (!ka) return 1;
      if (!kb) return -1;
      // log("sort", `Compare: "${ka}" <> "${kb}"`);
      if (isNumber(ka) || isNumber(kb))
        return ka - kb;
      return ka.localeCompare(kb, ctx.locale, { sensitivity: 'base', ignorePunctuation: true });
    });

    if (args.order == 'DESC') {
      contents = contents.reverse();
    }

    if (args.group) {
      let groupkeys = contents.map((item) => item[args.group]);
      groupkeys = [...new Set(groupkeys)];
      switch (args.group) {
        case 'abilityref':
          groupkeys = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].filter((ability) => groupkeys.includes(ability));
      }
      log("sort", `Group by ${args.group}`, groupkeys);

      // group the items by group key
      let itemsbygroup = {};
      for (let group of groupkeys) {
        itemsbygroup[group] = [];
      }
      for (let item of contents) {
        let group = item[args.group];
        itemsbygroup[group].push(item);
      }
      log("sort", "Items by group", itemsbygroup);

      // add hr to the last item in each group
      if (args.group_hr) {
        for (let group of groupkeys) {
          itemsbygroup[group][itemsbygroup[group].length - 1].hr = true;
        }
      }

      // put them back together
      contents = [];
      for (let group of groupkeys) {
        for (let item of itemsbygroup[group]) {
          contents.push(item);
        }
      }
      log("sort", "Items", contents);
    }

    // log("sort", "Sorted items", contents);
    return contents;
  }
};
