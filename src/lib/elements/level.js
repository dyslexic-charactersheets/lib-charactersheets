import { __ } from '../i18n';
import { esc } from '../util';

export let level = {
  name: 'level',
  key: 'level',
  defaults: {
    level: 1,
    narrow: true,
    marker: "Level",
    contents: [],
  },
  transform(args) {
    return [
      {
        type: "layout",
        layout: "indent-l",
        contents: [
          {
            type: "g",
            contents: [
              {
                type: "level-marker",
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
  },
  render(args, reg, doc) {
    var level = ("" + args.level).replace(/^\s*/, '').replace(/\s*$/, '');
    if (level == "") {
      return `<div class='level-marker'></div>`;
    }
    if (level == "_") {
      level = "&nbsp;";
    }
    var marker = args.marker ? `<label>${esc(__(args.marker, doc), true)}</label>` : '';
    return `<div class='level-marker'>${marker}<div class='level-marker__level'>${esc(__(level, doc))}</div></div>`;
  }
}
