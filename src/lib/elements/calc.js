/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { isString, isEmpty, isObject } from '../util';
import { elementClass, getLabelHeight, getRubyHeight } from '../util/elements';
import { elementColour } from '../util/colours';
import { has } from '../util/objects';

export let calc = {
  name: 'calc',
  // key: 'output',
  defaults: {
    output: {},
    outputs: [],
    layout: 'left',
    inline: false,
    inputs: [],
    blk: true,
    spacer: true,
  },
  render(args, reg, doc) {
    args.lp = getLabelHeight(args);
    args.rb = getRubyHeight(args);

    args.calc = true;
    args.colour = findColour(args);
    const cls = elementClass('row', null, args, ["calc", "inline", "blk"], { 'layout': 'center', 'lp': '', 'rb': '', colour: false });

    // parts of the calculation
    // const outputPart = Object.assign({
    //   border: "full"
    // }, args.output);
    // log("-","Output:", output);
    
    let outputs = isEmpty(args.outputs) ? [ args.output ] : args.outputs;
    const outputParts = outputs.map(part => {
      if (isString(part)) {
        return {
          "type": "span",
          "content": part
        };
      }
      if (isObject(part)) {
        if (part.type == "field") {
          return {
            border: "full",
            ...part
          };
        }
      }
      return part;
    })

    const inputParts = args.inputs.map(part => {
      if (isString(part)) {
        return {
          "type": "span",
          "content": part
        };
      }
      return part;
    });

    const parts = [
      ...outputParts,
      {
        "type": "span",
        "content": "="
      },
      ...inputParts
    ]
    // log("-","Calculation contents", parts);

    // contextual args
    if (args.inline)
      args.field_frame = "inline";

    var spacer = args.spacer ? "<div class='spacer'></div>" : '';

    return `<div${cls}><div class='row__inner'>${reg.render(parts, doc)}${spacer}</div></div>`;
  }
}

function findColour(args) {
  let colour = elementColour(args.output);
  if (colour) {
    return colour;
  }
  for (let elem of args.inputs) {
    let colour = elementColour(elem);
    if (colour) {
      return colour;
    }
  }
  return false;
}
