import { __, _e } from '../i18n';
import { elementClass } from '../util';

export let level = {
  name: 'level',
  key: 'level',
  defaults: {
    level: 1,
    narrow: true,
    marker: "Level",
    contents: [],
    inline: false,
  },
  transform(args) {
    let layout = "indent-l";
    if (args.inline) {
      layout = "indent-lw";
    }

    return [
      {
        type: "layout",
        layout: layout,
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
    marker: "Level",
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
