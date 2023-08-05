import { isObject, isString, isArray, isNull, isEmpty } from '../util';
import { cloneDeep, has, interpolate } from '../util/objects';
import { elementColour } from '../util/colours';

import { renderTableBasic } from './table-basic';
import { renderTableFlipped } from './table-flipped';
import { log, warn } from '../log';
// import { renderTableGrid } from './table-grid';

export let table = {
  name: 'table',
  key: 'id',
  defaults: {
    rows: [{}],
    columns: [],
    repeat: 1,
    reduce: 0,
    flip: false,
    template: [],
    width: '',
    colourful: false,
    blk: false,
    zebra: false,
    collapse: false,
    fixed: false,
    layout: false,
    'merge-bottom': false,
  },
  transform(args, ctx) {
    if (has(args, "_direct") && args._direct) {
      return false;
    }
    if (!has(args, "template") && !has(args, "repeat") /*&& !has(args, "columns")*/ && (!has(args, "reduce") || !args.reduce)) {
      return false;
    }

    // get headings
    if (ctx.largePrint || ctx.skipOptional) {
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
      
      let repeat = has(row, "repeat") ? row.repeat : 1;
      if (ctx.largePrint && row.reduce > 0)
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

    if (ctx.largePrint) {
      rows = rows.filter(row => !(has(row, "optional") && row.optional));
    }

    // repeat the whole set
    if (has(args, "repeat")) {
      let repeat = args.repeat;
      if (ctx.largePrint && args.reduce > 0)
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
          cell = interpolate(cell, row, ctx);
          // log("table", "Cell", cell);
          if (cell === null) {
            return null;
          } else {
            if (isString(cell)) cell = { type: "label", label: cell };
            // log("-","Cell:", cell, "Row:", row);
            if (!has(cell, "type")) {
              return null;
            }

            // transform the cell
            // let replace = ctx.composeElement(cell, reg);
            // log("table", "Cell, composed", replace);
            // if (isEmpty(replace)) {
            //   cell = { type: 'g', contents: [] };
            // }
            // if (replace.length > 1) {
            //   cell = { type: 'g', contents: replace };
            // }
            // cell = replace[0];

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

        // apply transformations so the contents of cells can compose
        // cells = cells.map(cell => {
        //   let replace = ctx.composeElement(cell, reg);
        //   // log("table", "Cell, composed", replace);
        //   if (isEmpty(replace)) {
        //     return { type: 'g', contents: [] };
        //   }
        //   if (replace.length > 1) {
        //     return { type: 'g', contents: replace };
        //   }
        //   return replace[0];
        // });
        
        // cells = interpolate(cells, {...args, ...row}, ctx);
        // log("table", "Templated row cells", row, cells);
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

    if (args.colourful) {
      for (let row of rows) {
        for (let cell of row.cells) {
          let colour = elementColour(cell);
          if (colour) {
            row.params.colour = colour;
            break;
          }
        }
      }
    }

    // apply transformations to cells
    // rows = rows.map(row => {
    //   row.cells = row.cells.map(cell => {
    //     let replace = doc.composeElement(cell, reg);
    //     // log("table", "Cell, composed", replace);
    //     if (isEmpty(replace)) {
    //       return { type: 'g', contents: [] };
    //     }
    //     if (replace.length > 1) {
    //       return { type: 'g', contents: replace };
    //     }
    //     return replace[0];
    //   });
    //   return row;
    // })
    // log("table", `${headings.length} columns, ${rows.length} rows`);

    return [{
      id: args.id,
      type: "table",
      rows: rows,
      flip: args.flip,
      width: args.width,
      blk: args.blk,
      'merge-bottom': args['merge-bottom'],
      zebra: args.zebra,
      collapse: args.collapse,
      fixed: args.fixed,
      layout: args.layout,
      _headings: headings,
      _direct: true,
    }];
  },
  render(args, reg, doc) {
    // render
    // return renderTableBasic(headings, rows);
    if (args.flip) {
      return renderTableFlipped(args, reg, doc, args._headings, args.rows);
    } else {
      return renderTableBasic(args, reg, doc, args._headings, args.rows);
    }
  }
}
