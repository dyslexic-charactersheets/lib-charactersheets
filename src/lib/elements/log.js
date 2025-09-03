/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { log } from '../log';
import { isArray } from '../util';
import { interpolate } from '../util/objects';

export let logelem = {
  name: 'log',
  key: 'message',
  defaults: {
    message: '',
    contents: [],
  },
  transform(args, doc) {
    const message = interpolate(args.message, {}, doc);
    log("-", message);
    
    if (isArray(args.contents) && args.contents.length > 0) {
      log("-", JSON.stringify(args.contents));
    }
    return [];
  }
};
