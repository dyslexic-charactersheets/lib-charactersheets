import { has, isEmpty, isArray, toKebabCase } from '../util';
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
    for (let lv = 1; lv <= 20; lv++) {
      itemsByLevel[lv] = [];
    }

    args.advances.forEach(advance => {
      // log("advancement", "Advance", advance);

      let levels = advance.levels;
      delete advance.levels;
      if (isEmpty(levels) && has(advance, "level")) {
        if (isArray(advance.level))
          levels = advance.level;
        else
          levels = [advance.level];
        delete advance.level;
      }

      if (isEmpty(levels)) {
        warn("advancement", "Cannot place advancement", advance);
        return;
      }

      let keys = Object.keys(advance);
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
        if (!has(itemsByLevel, level))
          warn("advancement", "Unknown level:", level);
        itemsByLevel[level].push(item);
      });
    });

    // log("advancement", "Items by level", itemsByLevel);

    // build the row data
    let has_labels = false;
    let rows = [];
    for (let lv = 1; lv <= 20; lv++) {
      let flags = {};
      let advances = [];
      let gains = [];

      itemsByLevel[lv].forEach(item => {
        Object.assign(flags, item);
        if (has(item, "advance")) {
          advances.push(item.advance);
          has_labels = true;
        } else if (has(item, "gain")) {
          gains.push(item.gain);
          has_labels = true;
        }
      });
      delete flags.level;
      delete flags.label;
      delete flags.advance;
      delete flags.gain;
      delete flags.type;

      const items = gains.map((gain) => {
        let slug = gain.replace(/_\{(.*?)\}/g, '$1');
        slug = `gain-${lv}-${toKebabCase(slug)}`;
        return {
          type: "field",
          id: slug,
          control: "checkbox",
          frame: "right",
          label: gain,
          align: "left",
        };
      });
      if (!isEmpty(advances)) {
        items.push({
          type: "p",
          content: advances.join(", ")
        });
      }

      rows.push({
        ...flags,
        level: lv,
        item: {
          type: "g",
          contents: items
        }
      });
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
      // template.push({
      //   type: "p",
      //   content: "#{advance}",
      //   align: "left"
      // });
      template.push({
        type: "item"
      });
    }

    // identify columns
    // cast shade
    let sh = true;
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

      const format = has(field, "format") ? field.format : 'checkbox';
      switch (format) {
        case 'checkbox':
          template.push({
            type: "field",
            id: table_id + '-#{level}-' + field.key,
            frame: "none",
            control: "checkbox",
            // width: "small",
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
    const table = {
      type: 'table',
      zebra: true,
      collapse: true,
      narrow: true,
      rows: rows,
      columns: columns,
      template: template,
      td_valign: 'middle',
      blk: false,
    }

    // log("advancement", "Table", table);
    return [table];
  }
};
