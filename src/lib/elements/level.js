/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { __, _e } from '../i18n';
import { elementClass } from '../util/elements';
import { levelFade } from '../util/level-fade';

const LEVEL_MARKER = "_{Level}";

export let level = {
  name: 'level',
  key: 'level',
  defaults: {
    level: 1,
    narrow: true,
    blk: false,
    marker: LEVEL_MARKER,
    contents: [],
    inline: false,
  },
  transform(args, ctx) {
    let layout = "indent-l";
    if (args.inline) {
      layout = "indent-lw";
    }

    return [
      {
        type: "layout",
        layout: layout,
        blk: args.blk,
        ...(args.marker == LEVEL_MARKER ? levelFade(args.level, ctx) : {}),
        contents: [
          {
            type: "g",
            contents: [
              {
                type: "level-marker",
                inline: args.inline,
                level: args.level,
                marker: args.marker
              }
            ]
          },
          {
            type: "g",
            contents: args.contents
          }
        ]
      }
    ];
  }
}

export let level_marker = {
  name: 'level-marker',
  key: 'level',
  defaults: {
    level: 1,
    marker: "_{Level}",
    inline: false,
    blk: true,
  },
  render(args, reg, doc) {
    let level = ("" + args.level).replace(/^\s*/, '').replace(/\s*$/, '');
    if (level == "") {
      return `<div class='level-marker'></div>`;
    }
    if (level == "_") {
      level = "&nbsp;";
    }
    const cls = elementClass("level-marker", null, args, ['inline', 'blk']);
    const marker = args.marker ? `<label>${_e(args.marker, doc)}</label>` : '';
    return `<div${cls}>${marker}<div class='level-marker__level'>${_e(level, doc)}</div></div>`;
  }
}

export let cost = {
  name: 'cost',
  key: 'cost',
  defaults: {
    cost: 1,
    unit: '',
    inline: false,
    blk: false,
  },
  render(args, reg, doc) {
    let cost = ("" + args.cost).replace(/^\s*/, '').replace(/\s*$/, '');
    if (cost == "") {
      return `<div class='level-marker'></div>`;
    }
    if (cost == "_") {
      cost = "&nbsp;";
    }
    const cls = elementClass("level-marker", null, args, ['inline', 'blk', 'cost']);
    const unit = args.unit ? `<label>${_e(args.unit, doc)}</label>` : '';
    return `<div${cls}><div class='level-marker__level'>${_e(cost, doc)}</div>${unit}</div>`;
  }
}
