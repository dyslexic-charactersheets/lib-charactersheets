/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { interpolate } from '../util/objects';
import { elementClass } from '../util/elements';

export let class_icon = {
  name: 'class-icon',
  key: 'icon',
  defaults: {
    icon: '#{class-icon}',
    optional: true,
    size: 'medium',
  },
  render(args, reg, doc) {
    args = interpolate(args, {}, doc);
    const cls = elementClass('class-icon', null, args, [], { 'icon': '', 'size': 'medium' });
    return `<div${cls}></div>`;
  }
}
