import * as _ from 'lodash';

import { interpolate, elementID, elementClass, isObject, isString, isNull, has, clone } from '../util';


export let table = {
  name: 'table',
  defaults: {
    rows: [{}],
    columns: [],
    repeat: 1,
    flip: false,
    template: [],
  },
  render: (args, reg, doc) => {

    // Standard table
    function renderTableBasic(headings, rows) {
      // headings
      var thead = '';
      if (!isNull(headings)) {
        var tcols = headings.map(col => {
          var elem = reg.renderItem(col, doc);
          var cs = has(col, 'colspan') ? col.colspan : 1;
          var colspan = (cs > 1) ? ` colspan='${col.colspan}'` : '';
          return `<th${colspan}>${elem}</th>`;
        });
        thead = `<thead>${tcols.join("\n")}</thead>\n`;
      }

      // cells
      // log("table", "Rows", rows);
      var trows = rows.map(row => {
        var cells = row.map(cell => {
          var cellCls = elementClass('td', null, cell, [], { 'align': '' });
          return `<td${cellCls}>${reg.renderItem(cell, doc)}</td>`;
        });

        return `<tr>${cells.join("\n")}</tr>\n`;
      })

      // put it all together
      var cls = elementClass('table', null, args, ['zebra', 'collapse', 'fixed'], ['width', 'layout']);
      return `<table${cls}>${thead}<tbody>${trows.join("\n")}</tbody></table>`;
    }


    // Column-oriented table
    function renderTableFlipped(headings, cols) {
      // log("table", "Flipped", headings, cols);

      // find the size of the table and make an empty grid of cells
      var hasHeading = false;
      var ncols = cols.length;
      var nrows = 0;
      headings = headings.map(heading => {
        if (isNull(heading)) heading = { type: 'label', label: '' };
        else hasHeading = true;

        if (!has(heading, "rowspan")) heading.rowspan = 1;
        nrows += heading.rowspan;
        return heading;
      });
      cols.forEach(col => {
        if (col.length > nrows) nrows = col.length;
      });

      if (hasHeading) ncols++;
      // log("table", `Table: ${nrows} rows, ${ncols} cols`);
      var cells = Array.from({length: nrows}, r => Array(ncols).fill(null));
      // log("table", "Cell grid:", cells);

      // fill the grid
      if (hasHeading) {
        // log("table", "Headings");
        var row = 0;
        headings.forEach(heading => {
          cells[row][0] = heading;
          row += heading.rowspan;
        });
      }

      cols.forEach((col, c) => {
        if (hasHeading) c++;
        // log("table", "Column", c, col);
        col.forEach((cell, r) => {
          // log("table", "Cell at:", r, c, "=", cell);
          cells[r][c] = cell;
        });
      });

      // log("table", "Cells", cells);

      // render it
      var trows = cells.map(row => {
        var th = '';
        if (hasHeading) {
          var head = row.shift();
          var rowspan = head.rowspan > 1 ? ` rowspan="${head.rowspan}"` : '';
          var th = `<th scope="row"${rowspan}>${isNull(head) ? '' : reg.renderItem(head, doc)}</th>`;
        }

        var tds = row.map(elem => {
          return `<td>${isNull(elem) ? '' : reg.renderItem(elem, doc)}</td>`;
        });

        return `<tr>${th}${tds.join("")}</tr>`;
      });

      // put it all together
      var cls = elementClass('table', null, args, ['zebra', 'collapse', 'fixed'], ['width', 'layout']);
      return `<table${cls}><tbody>${trows.join("\n")}</tbody></table>`;
    }

    // Flexible grid-based table
    function renderTableGrid(args, headings, cells) {

    }


    // get headings
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


    if (isNull(args, "rows") || args.rows == []) {
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

    // repeat the whole set
    if (has(args, "repeat") && args.repeat > 1) {
      let rows2 = Array(rows.length * args.repeat);
      for (var i = 0; i < args.repeat; i += rows.length) {
        for (var j = 0; j < rows.length; j++) {
          rows2[i+j] = clone(rows[j]);
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

    if (Array.isArray(args.template) && args.template.length > 0) {
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
          cell = interpolate(cell, row);
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
      return renderTableFlipped(headings, rows);
    } else {
      return renderTableBasic(headings, rows);
    }
  }
}
