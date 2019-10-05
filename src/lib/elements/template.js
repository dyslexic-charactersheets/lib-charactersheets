import { has, cloneDeep, interpolate, isEmpty } from "../util";
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
    // log("template", "Paste template:", args.template);
    if (!has(ctx.templates, args.template))
      return [];

    const template = ctx.templates[args.template];
    if (isEmpty(template))
      return [];

    // const params = { ...template.params, ...args.params, item: args.contents };
    const params = Object.assign({}, template.params, args.params);
    let contents = cloneDeep(template.contents);
    contents = interpolate(contents, params);
    return contents;
  }
}

export let copy = {
  name: 'copy',
  key: 'template',
  defaults: {
    template: '',
    params: {},
    contents: [],
  },
  transform(args, ctx) {
    // log("template", "Copy template:", args.template);
    ctx.templates[args.template] = {
      params: args.params,
      contents: args.contents,
    }
    return [];
  }
}
