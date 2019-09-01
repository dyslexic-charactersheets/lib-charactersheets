import { isNull, has, elementClass } from '../util';
import { log, warn } from '../log';

// Standard table
export function renderTableBasic(args, reg, doc, headings, rows) {
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
    var cells = row.map((cell, h) => {
      if (h < headings.length) {
        if (has(headings[h], "shade") && headings[h].shade)
          cell.shade = true;
      }
      var cellCls = elementClass('td', null, cell, [ 'shade' ], { 'align': '', 'valign': 'bottom' });
      return `<td${cellCls}>${reg.renderItem(cell, doc)}</td>`;
    });

    return `<tr>${cells.join("\n")}</tr>\n`;
  })

  // put it all together
  var cls = elementClass('table', null, args, ['zebra', 'collapse', 'fixed'], ['width', 'layout']);
  return `<table${cls}>${thead}<tbody>${trows.join("\n")}</tbody></table>`;
}
