import { elementClass, getLabelHeight, isString } from '../util';

export let calc = {
  name: 'calc',
  // key: 'output',
  defaults: {
    output: {},
    layout: 'left',
    inline: false,
    inputs: [],
    pad: false,
  },
  render(args, reg, doc) {
    args.labelHeight = getLabelHeight(args);

    args.calc = true;
    const cls = elementClass('row', null, args, ["calc", "inline", "labelHeight", "pad"], { 'layout': 'center' });

    // parts of the calculation
    const outputPart = Object.assign({
      border: "full"
    }, args.output);
    // log("-","Output:", output);

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
      outputPart,
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

    return `<div${cls}><div class='row__inner'>${reg.render(parts, doc)}<div class='spacer'></div></div></div>`;
  }
}
