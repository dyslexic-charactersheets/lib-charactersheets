import { has, isEmpty } from '../util';

export let advancement = {
  name: 'advancement',
  key: 'id',
  defaults: {
    id: "advancement",
    title: "Advancement",
    start: 1,
    end: 20,
    index: "Level",
    labels: [],
    fields: []
  },
  transform: args => {

    let columns = [{
      type: "label",
      label: args.index
    }];
    let template = [{
      type: "level-marker",
      marker: '',
      level: '#{level}'
    }];
    // if (!isEmpty(args.labels)) {
      columns.push({
        type: "label",
        label: args.title,
        align: "left"
      });
      template.push({
        type: "p",
        content: "#{label}",
        align: "left"
      });
    // }
    args.fields.forEach(field => {
      var align = (has(field, "align") && !isEmpty(field.align)) ? field.align : '';
      columns.push({
        type: "label",
        label: field.label,
        align: align,
        shade: has(field, "shade") && field.shade
      });
      if (has(field, "values")) {
        template.push({
          type: "p",
          align: align,
          content: "#{"+field.id+"}"
        });
      } else if (has(field, "template")) {
        field.template.exists = "#{"+field.id+"}";
        template.push(field.template);
      } else {
        template.push({
          type: "field",
          id: args.id+'-#{level}-'+field.id,
          frame: "none",
          control: "checkbox",
          width: "small",
          exists: "#{"+field.id+"}"
        });
      }
    });

    let rows = [];
    for (var lv = args.start; lv <= args.end; lv++) {
      let i = lv - args.start;
      let row = { level: lv };

      if (i < args.labels.length) {
        row.label = args.labels[i];
      } else {
        row.label = "";
      }

      args.fields.forEach(field => {
        if (has(field, "values")) {
          if (i < field.values.length) {
            row[field.id] = field.values[i];
          } else {
            row[field.id] = '';
          }
        } else {
          if (field.levels.includes(lv)) {
            row[field.id] = true;
          } else {
            row[field.id] = false;
          }
        }
      });
      rows.push(row);
    }
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

    return [ table ];
  }
};
