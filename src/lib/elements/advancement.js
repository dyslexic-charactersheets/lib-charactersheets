import { has, isEmpty, isArray } from '../util';
import { log, warn } from '../log';

export let advancement = {
  name: 'advancement',
  key: 'id',
  defaults: {
    id: "advancement",
    title: "Advancement",
    start: 1,
    end: 20,
    advances: [],
    index: "Level",
    labels: [],
    fields: []
  },
  transform(args, ctx) {
    let table_id = isEmpty(args.id) ? 'advancement' : args.id;
    // log("advancement", "Advances", args.advances);

    // collect items by level
    let itemsByLevel = {};
    for (var lv = 1; lv <= 20; lv++) {
      itemsByLevel[lv] = [];
    }

    args.advances.forEach(advance => {
      // log("advancement", "Advance", advance);

      let levels = advance.levels;
      delete advance.levels;
      if (isEmpty(levels) && has(advance, "level")) {
        levels = [advance.level];
        delete advance.level;
      }

      if (isEmpty(levels)) {
        warn("advancement", "Cannot place advancement", advance);
        return;
      }

      var keys = Object.keys(advance);
      keys.forEach(key => {
        if (!isArray(advance[key])) {
          advance[key] = Array(levels.length).fill(advance[key]);
        }
      });
      // log("advancement", "Placing", levels, advance);

      levels.forEach((level, i) => {
        let item = { level: level };
        keys.forEach(key => {
          item[key] = advance[key][i];
        });
        itemsByLevel[level].push(item);
      });
    });

    // log("advancement", "Items by level", itemsByLevel);

    // build the row data
    let has_labels = false;
    let rows = [];
    for (let lv = 1; lv <= 20; lv++) {
      let flags = {};
      let labels = [];
      // let proficiencies = {
      //   trained: [],
      //   expert: [],
      //   master: [],
      //   legendary: []
      // };
      itemsByLevel[lv].forEach(item => {
        Object.assign(flags, item);
        if (has(item, "advance")) {
          labels.push(item.advance);
          has_labels = true;
          // } else if (has(item, "proficiency")) {
          //   proficiencies[item.proficiency].push(item.in);
        }
      });
      delete flags.level;
      delete flags.label;
      delete flags.advance;
      delete flags.type;
      // delete flags.proficiency;
      // delete flags.in;
      // log("advancement", `Level ${lv}`, labels, flags);

      rows.push(Object.assign(flags, {
        level: lv,
        advance: labels.join(", "),
        // proficiencies: proficiencies
      }));
    }

    // allocate cells and columns
    let columns = [{
      type: "label",
      label: args.index,
      valign: "bottom"
    }];
    let template = [{
      type: "level-marker",
      marker: '',
      level: '#{level}'
    }];
    if (has_labels) {
      columns.push({
        type: "label",
        label: args.title,
        align: "left",
        valign: "bottom"
      });
      template.push({
        type: "p",
        content: "#{advance}",
        align: "left"
      });
    }

    // identify columns
    // cast shade
    var sh = true;
    args.fields.forEach(field => {
      if (!has(field, "name"))
        return;

      field.shade = sh;
      sh = !sh;

      columns.push({
        type: "label",
        label: field.name,
        align: "center",
        valign: "bottom",
        shade: field.shade
      });

      var format = has(field, "format") ? field.format : 'checkbox';
      switch (format) {
        case 'checkbox':
          template.push({
            type: "field",
            id: table_id + '-#{level}-' + field.key,
            frame: "none",
            control: "checkbox",
            width: "small",
            exists: "#{" + field.key + "}",
            shade: field.shade
          });
          break;

        case 'string':
          template.push({
            type: "span",
            content: "#{" + field.key + "}",
            shade: field.shade
          });
          break;

        default:
          template.push({
            type: "nothing",
            shade: field.shade
          });
      }
    });

    // log("advancement", "Rows", rows);
    let table = {
      type: 'table',
      zebra: true,
      collapse: true,
      narrow: true,
      rows: rows,
      columns: columns,
      template: template,
    }

    // log("advancement", "Table", table);
    return [table];
  }
};
