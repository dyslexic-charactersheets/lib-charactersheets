import { interpolate, isObject, isString, isArray, isNull, isEmpty, has, cloneDeep } from '../util';

import { renderTableBasic } from './table-basic';
import { renderTableFlipped } from './table-flipped';
// import { renderTableGrid } from './table-grid';

export let table = {
  name: 'table',
  defaults: {
    rows: [{}],
    columns: [],
    repeat: 1,
    flip: false,
    template: [],
    width: '',
  },
  render: (args, reg, doc) => {
    // get headings
    if (doc.isLargePrint) {
      args.columns = args.columns.filter(col => !(has(col, "optional") && col.optional));
    }

    var headings = args.columns.map(col => {
      if (isNull(col)) {
        col = {
          type: 'label',
          label: ''
        };
      } else if (isString(col)) {
        col = {
          type: 'label',
          label: col,
          misc: col == "Misc"
        };
      }

      return col;
    });


    if (isEmpty(args.rows) || args.rows == []) {
      // log("table", "Filling in empty rows");
      args.rows = [ {} ];
    }

    // individual rows repeat
    var rows = args.rows;
    rows = rows.flatMap(row => {
      var rep = has(row, "repeat") ? row.repeat : 1;
      if (rep > 1) {
        // log("table", "Repeating row", rep, "times:", row);
        return Array.from({length: rep}, e => Array.from(row));
      }
      return [row];
    });

    if (doc.isLargePrint) {
      rows = rows.filter(row => !(has(row, "optional") && row.optional));
    }

    // repeat the whole set
    if (has(args, "repeat") && args.repeat > 1) {
      let rows2 = Array(rows.length * args.repeat);
      for (var i = 0; i < args.repeat; i += rows.length) {
        for (var j = 0; j < rows.length; j++) {
          rows2[i+j] = cloneDeep(rows[j]);
        }
      }
      rows = rows2;
      // log("table", "Repeating row", args.repeat, "times:", rows);
    }

    // number rows
    for (let i = 0; i < rows.length; i++) {
      rows[i].i = i + 1;
    }

    // apply the row template

    if (isArray(args.template) && args.template.length > 0) {
      var templateCells = args.template.flatMap(cell => {
        if (isObject(cell) && has(cell, "type") && cell.type == "calc") {
          var fields = [...cell.inputs];
          fields.unshift({
            type: "span",
            content: "=",
          });
          var output = Object.assign({ output: true }, cell.output);
          fields.unshift(output);
          return fields;
        }
        return [cell];
      });

      rows = rows.map(row => {
        return templateCells.map((cell, i) => {
          cell = interpolate(cell, row, doc);
          if (cell === null) {
            return null;
          } else {
            if (isString(cell)) cell = { type: "label", label: cell };
            // log("-","Cell:", cell);
            if (!has(cell, "type")) {
              return null;
            }

            var col = Object.assign({}, headings[i], { label: '', legend: '' });
            return Object.assign({}, { type: 'label', label: '' }, col, cell);
          }
        });
      });
    } else {
      rows = args.rows.map(row => {
        return row.map(cell => {
          if (isString(cell)) return { type: "label", label: cell };
          if (!has(cell, "type")) return null;
          return cell;
        });
      });
    }

    // render
    // return renderTableBasic(headings, rows);
    if (args.flip) {
      return renderTableFlipped(args, reg, doc, headings, rows);
    } else {
      return renderTableBasic(args, reg, doc, headings, rows);
    }
  }
}
