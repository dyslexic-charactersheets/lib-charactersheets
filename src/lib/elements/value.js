
export let value = {
  name: 'value',
  key: 'value',
  defaults: {
    frame: 'none',
    control: 'value',
    width: 'tiny',
  },
  transform(args, ctx) {
    return [{
      ...args,
      type: 'field'
    }];
  }
}

export let value_block = {
  name: 'value-block',
  key: 'value',
  defaults: {
    frame: 'none',
    control: 'value',
    width: 'tiny',
    content: '',
  },
  transform(args, ctx) {
    let value = {
      ...args,
      type: 'field'
    };
    let label = {
      type: 'p',
      content: args.content
    };

    return [{
      type: 'layout',
      layout: 'indent-l',
      contents: [
        value, label
      ]
    }];
  }
}
