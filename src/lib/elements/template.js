import { isEmpty, isNull } from "../util";
import { cloneDeep, has, interpolate } from '../util/objects';
import { log, warn } from "../log";
import { weigh } from "../util/weights";

export let paste = {
  name: 'paste',
  key: 'template',
  defaults: {
    template: '',
    params: {},
    contents: [],
  },
  transform(args, ctx) {
    // log("template", "Paste", args.template);
    if (!has(ctx.templates, args.template))
      return [];

    const template = ctx.templates[args.template];
    // log("template", "Paste", args.template, "initial template:", template);
    if (isEmpty(template))
      return [];

    // const params = { ...template.params, ...args.params, item: args.contents };
    // const item = {
    //   type: 'g',
    //   contents: cloneDeep(args.contents)
    // };
    const item = cloneDeep(args.contents);
    const params = { item, ...template.params, ...args.params };

    let contents = cloneDeep(template.contents);
    // log("template", "Paste", args.template, "clone template:", contents);
    // log("template", "Paste", args.template, "params:", params);
    contents = interpolate(contents, params);
    return contents;
  }
}

export let copy = {
  name: 'copy',
  key: 'template',
  defaults: {
    template: '',
    alias: [],
    params: {},
    contents: [],
  },
  transform(args, ctx) {
    log("template", "Copy template:", args.template);
    ctx.templates[args.template] = {
      params: args.params,
      contents: args.contents,
    }
    args.alias.forEach(alias => {
      log("template", "Copy template alias:", args.template);
      ctx.templates[alias] = {
        params: args.params,
        contents: args.contents,
      };
    });
    return [];
  }
}

export let split = {
  name: 'split',
  key: 'template',
  defaults: {
    template: '',
    parts: 2,
    weighted: false,
    contents: []
  },
  transform(args, ctx) {
    // log("template", "Split items:", args.template);
    let parts = [];
    let start = 0;

    if (args.weighted) {
      // split the items by estimated size
      let totalWeight = weigh(args.contents);
      let sliceWeight = Math.ceil(totalWeight / args.parts);
      for (let i = 0; i < args.parts; i++) {
        let part = [];
        let partWeight = 0;
        for (let j = start; j < args.contents.length; j++) {
          let item = args.contents[j]
          let weight = weigh(item);
          // log("template", "Split: item weight", weight);
          part.push(item);
          partWeight += weight;
          if (partWeight >= sliceWeight) {
            start = j;
            break;
          }
        }
        parts.push(part);
      }

    } else {
      // split the items equally
      let sliceLen = Math.ceil(args.contents.length / args.parts);
      for (let i = 0; i < args.parts; i++) {
        let end = start + sliceLen;
        let part = args.contents.slice(start, end);
        start = end;
        parts.push(part);
      }
    }
    
    for (let i = 1; i < args.parts; i++) {
      // log("template", "Split: Saving template", args.template+"/"+i, part);
      ctx.templates[args.template+"/"+(i+1)] = {
        params: {},
        contents: parts[i],
      };
    }
    // log("template", "Split first part:", firstPart);
    return parts[0];
  }
}
