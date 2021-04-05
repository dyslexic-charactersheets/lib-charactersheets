import { isObject, isString, isArray, isNull, isEmpty } from '../util';
import { cloneDeep, has, interpolate } from '../util/objects';

import { renderTableBasic } from './table-basic';
import { renderTableFlipped } from './table-flipped';
import { log, warn } from '../log';
// import { renderTableGrid } from './table-grid';

export let table = {
  name: 'table',
  defaults: {
    rows: [{}],
    columns: [],
    repeat: 1,
    reduce: 0,
    flip: false,
    template: [],
    width: '',
    blk: false,
    'merge-bottom': false,
  },
  render(args, reg, doc) {
    // get headings
    if (doc.largePrint || doc.skipOptional) {
      args.columns = args.columns.filter(col => !(has(col, "optional") && col.optional));
    }

/*
    // is this a direct cells table?
    if (has(args, "cells") && isEmpty(args.template)) {
      log("table", "Direct cells", args, args.cells);

      let ncols = 0;
      let rows = [];
      args.cells.forEach(row => {
        if (row.contents.length > ncols) ncols = row.contents.length;
        rows.push(row.contents);
      });
      let headings = new Array(ncols).fill(null);

      // render
      // return renderTableBasic(headings, rows);
      if (args.flip) {
        return renderTableFlipped(args, reg, doc, headings, rows);
      } else {
        return renderTableBasic(args, reg, doc, headings, rows);
      }
    }
    */

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
      
      let repeat = has(row, "repeat") ? row.repeat : 1;
      if (doc.largePrint && row.reduce > 0)
        repeat -= row.reduce;
      if (repeat > 1) {
        // log("table", `Repeating row ${rep} times:`, row);
        let reprows = Array.from({ length: repeat }, e => {
          return { ...row };
        });
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

    if (doc.largePrint ) {
      rows = rows.filter(row => !(has(row, "optional") && row.optional));
    }

    // repeat the whole set
    if (has(args, "repeat")) {
      let repeat = args.repeat;
      if (doc.largePrint && args.reduce > 0)
        rep -= args.reduce;
      if (args.repeat > 1) {
        let rows2 = Array(rows.length * repeat);
        for (let i = 0; i < repeat; i += rows.length) {
          for (let j = 0; j < rows.length; j++) {
            rows2[i + j] = cloneDeep(rows[j]);
          }
        }
        rows = rows2;
        // log("table", "Repeating row", args.repeat, "times:", rows);
      }
    }

    // number rows
    for (let i = 0; i < rows.length; i++) {
      if (!isObject(rows[i])) {
        warn("table", "Row is not an object", rows[i]);
      }
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
          const output = { ...cell.output, output: true };
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
          // log("table", "Cell", cell);
          if (cell === null) {
            return null;
          } else {
            if (isString(cell)) cell = { type: "label", label: cell };
            // log("-","Cell:", cell, "Row:", row);
            if (!has(cell, "type")) {
              return null;
            }

            let levelat = {};
            if (has(row, "level") && has(cell, "at") && isArray(cell.at)) {
              let levelats = cell.at.filter(item => item.level == row.level);
              if (!isEmpty(levelats)) {
                levelat = levelats[0];
                delete levelat.type;
                delete levelat.level;
                // log("table", "Found at level:", row.level, levelat);
              }
            }

            const col = {...headings[i], label: '', legend: '' };
            delete col.icon;
            return { type: 'label', label: '', ...col, colspan: 1, rowspan: 1, ...cell, ...levelat };
          }
        });
        // cells = interpolate(cells, {...args, ...row}, doc);
        return { params: row, cells: cells };
      });
    } else {
      rows = args.rows.map(row => {
        let cells = [];

        if (isArray(row)) {
          cells = row;
        } else if (isObject(row)) {
          if (has(row, "contents")) {
            cells = row.contents;
          }
        }

        cells = cells.map(cell => {
          if (isString(cell)) return { type: "label", label: cell };
          if (!has(cell, "type")) return null;
          return cell;
        });
        return { params: row, cells: cells };
      });
    }

    // apply transformations to cells
    rows = rows.map(row => {
      row.cells = row.cells.map(cell => {
        let replace = doc.composeElement(cell, reg);
        if (isEmpty(replace)) {
          return { type: 'g', contents: [] };
        }
        if (replace.length > 1) {
          return { type: 'g', contents: replace };
        }
        return replace[0];
      });
      return row;
    })
    // log("table", `${headings.length} columns, ${rows.length} rows`);

    // render
    // return renderTableBasic(headings, rows);
    if (args.flip) {
      return renderTableFlipped(args, reg, doc, headings, rows);
    } else {
      return renderTableBasic(args, reg, doc, headings, rows);
    }
  }
}
