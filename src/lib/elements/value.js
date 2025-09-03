/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { isEmpty } from '../util';
import { log, error } from '../log';

export let value = {
  name: 'value',
  key: 'value',
  defaults: {
    frame: 'none',
    control: 'value',
    width: 'tiny',
    label: "",
    size: 'medium',
    flex: 'tiny',
  },
  transform(args, ctx) {
    log("value", "Making field from value:", args.value);
    return [{
      ...args,
      type: 'field'
    }];
  },
  render(args) {
    error("value", "Untransformed value:", args.value);
    return "";
  }
}

export let value_block = {
  name: 'value-block',
  key: 'value',
  defaults: {
    frame: 'none',
    control: 'value',
    width: 'tiny',
    size: 'medium',
    content: '',
    contents: [],
  },
  transform(args, ctx) {
    let value = {
      ...args,
      type: 'field'
    };

    let contents = isEmpty(args.contents) ? {
        type: 'p',
        content: args.content
      } : {
        type: 'g',
        contents: args.contents
      };

    let type = 'layout';
    let layout = 'indent-l';
    switch (args.width) {
      case 'medium':
      case 'large':
        layout = 'indent-lw';
        break;
        
      case 'huge':
        return [{
          type: 'row',
          contents: [
            value, contents, {
              type: 'spacer'
            }
          ]
        }];
        break;
    }

    return [{
      type: 'layout',
      layout: layout,
      contents: [
        value, contents
      ]
    }];
  }
}
