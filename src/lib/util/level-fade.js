/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { has } from './objects';

export function levelFade(level, ctx) {
  const lv = parseInt(level);
  if (isNaN(lv)) {
    return {};
  }

  const fade = {};
  if (ctx.getVar('enable-level-fade')) {
    fade['fade-level'] = lv;
  }
  const cap = parseInt(ctx.getVar('level-cap', 'number')) || 0;
  if (cap > 0 && lv > cap) {
    fade['level-capped'] = true;
  }
  return fade;
}

export function levelFadeData(args) {
  return has(args, 'fade-level') ? ` data-fade-level='${args['fade-level']}'` : '';
}
