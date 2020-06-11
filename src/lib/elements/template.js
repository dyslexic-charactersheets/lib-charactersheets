import { isEmpty } from "../util";
import { cloneDeep, has, interpolate } from '../util/objects';
import { log, warn } from "../log";

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
    // log("template", "Paste", args.template, "template:", contents);
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
