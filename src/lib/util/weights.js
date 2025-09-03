/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

// estimate the visual height of an element
// return an integer in an arbitrary unit of "lines" roughly equal to a calculation row
// this won't be exact

import { isArray, isNumber, isNull } from "../util";
import { has } from "./objects";
import { log, warn } from "../log";

function maxWeight(items) {
  let weight = 1;
  for (let item of items) {
    let itemWeight = weigh(item);
    if (!isNumber(itemWeight)) {
      warn("weights", "Bad weight", itemWeight, item);
      continue;
    }
    if (itemWeight > weight) {
      weight = itemWeight;
    }
  }
  return weight;
}

export function weigh(item) {
  if (isNull(item)) {
    return 0;
  }

  if (isArray(item)) {
    let weight = 0;
    for (let child of item) {
      let itemWeight = weigh(child);
      if (isNumber(itemWeight)) {
        weight += itemWeight;
      } else {
        warn("weights", "Bad weight", itemWeight, item);
      }
    }
    return weight;
  }

  if (!has(item, "type")) {
    return 0;
  }

  switch (item.type) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
      return 2;

    case 'h5':
    case 'h6':
    case 'p':
      return 1;

    case 'section':
      return weigh(item.contents) + 1;

    case 'g':
    case 'action':
      return weigh(item.contents);
      
    case 'dl':
      return Object.keys(item.defs).length;

    case 'row':
      return maxWeight(item.contents);

    case 'span':
    case 'icon':
    case 'flags':
      return 1;
      
    case 'field':
      if (item.control == "ability" || item.border == "circle") {
        return 2;
      }
      return 1;

    case 'layout':
      switch (item.layout) {
        case '1n':
        case '2e':
        case '2l':
        case '2r':
        case '2ll':
        case '2rr':
        case '13l':
        case '13r':
        case '3e':
        case '3lr':
        case '3f':
        case '4l':
        case '5e':
        case '6e':
        case 'indent-l':
        case 'indent-r':
          return maxWeight(item.contents);
        default:
          warn("weights", "Unknown layout", item.layout);
          return 1;
      }

    case 'spacer':
    case 'hr':
    case 'item':
      return 0;

    default:
      warn("weights", "Default weight", item.type, item);
      return 1;
  }
}
