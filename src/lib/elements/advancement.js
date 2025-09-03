/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { isEmpty, isArray } from '../util';
import { toKebabCase } from '../util/strings';
import { cloneDeep, has, interpolate } from '../util/objects';
import { log, warn } from '../log';

export let advancement = {
  name: 'advancement',
  key: 'id',
  defaults: {
    id: "advancement",
    title: "_{Advancement}",
    start: 1,
    end: 20,
    zebra: true,
    shade: true,
    elide: false,
    flip: false,
    rotate: false,
    advances: [],
    index: "_{Level}",
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
      // log("advancement", "Placing keys", keys);
      keys.forEach(key => {
        if (!isArray(advance[key]) || key == "contents") {
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
        itemsByLevel[level].push(cloneDeep(item));
      });
    });

    // log("advancement", "Items by level", itemsByLevel);

    // build the row data
    let has_icons = false;
    let has_labels = false;
    let rows = [];
    for (let lv = 1; lv <= 20; lv++) {
      let flags = {};
      let advances = [];
      let gains = [];
      let contents = [];
      let icons = [];
      let proficiencyAdvances = {
        trained: [],
        expert: [],
        master: [],
        legendary: []
      };
      let iconItems = [];

      itemsByLevel[lv].forEach(item => {
        Object.assign(flags, item);
        if (has(item, "advance")) {
          if (has(item, "proficiency")) {
            proficiencyAdvances[item.proficiency].push(item.advance);
          } else if (has(item, "icon")) {
            iconItems.push({
              type: "p",
              blk: false,
              content: item.advance,
              icon: item.icon
            });
          } else {
            advances.push(item.advance);
            has_labels = true;
          }
        } else if (has(item, "gain")) {
          gains.push(item.gain);
          has_labels = true;
        }
        if (has(item, "contents")) {
          let rowContents = cloneDeep(item.contents);
          log("advancement", `Item contents at level ${lv}`, rowContents);
          if (!isArray(rowContents))
            rowContents = [rowContents];
          rowContents = interpolate(rowContents, {level: lv});
          contents = [...contents, ...rowContents];
        }
        // if (has(item, "icon")) {
        //   icons.push(item.icon);
        //   has_icons = true;
        // }
      });
      delete flags.level;
      delete flags.label;
      delete flags.advance;
      delete flags.gain;
      delete flags.type;

      const proficiencyItems = [];
      ["trained", "expert", "master", "legendary"].forEach(tier => {
        if (!isEmpty(proficiencyAdvances[tier])) {
          proficiencyItems.push({
            type: "p",
            // title: tier.charAt(0).toUpperCase() + tier.slice(1),
            blk: false,
            content: proficiencyAdvances[tier].join(", "),
            icon: "proficiency-"+tier
          });
        }
      });

      const items = [];
      if (!isEmpty(gains)) {
        gains = gains.map((gain) => {
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
        items.push({
          type: "row",
          wrap: true,
          blk: false,
          contents: gains
        });
      }
      if (!isEmpty(advances)) {
        items.push({
          type: "p",
          blk: false,
          content: advances.join(", ")
        });
      }

      if (args.elide && isEmpty(icons) && isEmpty(items) && isEmpty(flags)) {
        continue;
      }

      rows.push({
        ...flags,
        level: lv,
        icon: icons.join(","),
        item: {
          type: "g",
          contents: [...proficiencyItems, ...iconItems, ...items, ...contents]
        }
      });
    }

    // allocate cells and columns
    let columns = [{
      type: "label",
      label: args.index,
      rotate: args.flip ^ args.rotate,
      valign: "middle"
    }];
    let template = [{
      type: "level-marker",
      marker: '',
      level: '#{level}'
    }];
    if (has_icons) {
      columns.push({
        type: "label",
        label: "",
        rotate: args.flip ^ args.rotate,
        valign: "middle"
      });
      template.push({
        type: "g",
        contents: [{
          type: "if",
          condition: "#{icon}!=",
          then: [{
            type: "icon",
            icon: "#{icon}",
            blk: false
          }]
        }]
      });
    }
    if (has_labels) {
      columns.push({
        type: "label",
        label: args.title,
        rotate: args.flip ^ args.rotate,
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

      field.shade = args.shade && sh;
      sh = !sh;

      columns.push({
        type: "label",
        label: field.name,
        rotate: args.flip ^ args.rotate,
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

        case 'checkgrid':
          // log("advancement", `Checkgrid: label = ${field.label}, max = ${field.max}`);
          template.push({
            type: "field",
            id: table_id + '-#{level}-' + field.key,
            frame: "left",
            label: field.label,
            control: "checkgrid",
            depth: 'auto',
            max: field.max,
            shade: field.shade,
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

    // log("advancement", "Column", columns);
    // log("advancement", "Rows", rows);
    // log("advancement", "Template", template);

    const table = {
      id: args.id,
      type: 'table',
      zebra: args.zebra,
      flip: args.flip,
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
