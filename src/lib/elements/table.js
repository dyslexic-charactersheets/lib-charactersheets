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
  render(args, reg, doc) {
    // get headings
    if (doc.isLargePrint) {
      args.columns = args.columns.filter(col => !(has(col, "optional") && col.optional));
    }

    const headings = args.columns.map(col => {
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
      args.rows = [{}];
    }

    // individual rows repeat
    let rows = args.rows;
    let hr = false;
    rows = rows.flatMap(row => {
      if (has(row, "hr") || (has(row, "type") && row.type == "hr")) {
        // log("table", "Found hr");
        hr = true;
        return [];
      }
      
      const rep = has(row, "repeat") ? row.repeat : 1;
      if (rep > 1) {
        log("table", "Repeating row", rep, "times:", row);
        let reprows = Array.from({ length: rep }, e => [ ...row ]);
        if (hr) {
          // log("table", "Setting repeated row hr");
          reprows[0].hr = true;
          hr = false;
        }
        return reprows;
      }
      if (hr) {
        // log("table", "Setting row hr");
        row.hr = true;
        hr = false;
      }
      return [row];
    });

    if (doc.isLargePrint) {
      rows = rows.filter(row => !(has(row, "optional") && row.optional));
    }

    // repeat the whole set
    if (has(args, "repeat") && args.repeat > 1) {
      let rows2 = Array(rows.length * args.repeat);
      for (let i = 0; i < args.repeat; i += rows.length) {
        for (let j = 0; j < rows.length; j++) {
          rows2[i + j] = cloneDeep(rows[j]);
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
      const templateCells = args.template.flatMap(cell => {
        if (isObject(cell) && has(cell, "type") && cell.type == "calc") {
          let fields = [...cell.inputs];
          fields.unshift({
            type: "span",
            content: "=",
          });
          const output = Object.assign({ output: true }, cell.output);
          fields.unshift(output);
          return fields;
        }
        return [cell];
      });

      rows = rows.map(row => {
        let cells = templateCells.map((cell, i) => {
          // let params = {...args, ...row};
          // log("table", "Interpolating cell", cell, row);
          cell = interpolate(cell, row, doc);
          if (cell === null) {
            return null;
          } else {
            if (isString(cell)) cell = { type: "label", label: cell };
            // log("-","Cell:", cell);
            if (!has(cell, "type")) {
              return null;
            }

            const col = {...headings[i], label: '', legend: '' };
            return { type: 'label', label: '', ...col, ...cell };
          }
        });
        // cells = interpolate(cells, {...args, ...row}, doc);
        return { params: row, cells: cells };
      });
    } else {
      rows = args.rows.map(row => {
        let cells = row.map(cell => {
          if (isString(cell)) return { type: "label", label: cell };
          if (!has(cell, "type")) return null;
          return cell;
        });
        return { params: row, cells: cells };
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
