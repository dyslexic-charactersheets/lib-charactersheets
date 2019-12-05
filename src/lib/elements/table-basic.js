import { isNull, has, elementClass } from '../util';
import { log, warn } from '../log';
import { mergeBottom } from '../classes/Registry';

// Standard table
export function renderTableBasic(args, reg, doc, headings, rows) {
  // headings
  let thead = '';
  if (!isNull(headings)) {
    const tcols = headings.map(col => {
      const elem = reg.renderItem(col, doc);
      const cs = has(col, 'colspan') ? col.colspan : 1;
      const colspan = (cs > 1) ? ` colspan='${col.colspan}'` : '';
      return `<th${colspan}>${elem}</th>`;
    });
    thead = `<thead>${tcols.join("\n")}</thead>\n`;
  }

  // take care of the 'hr'
  rows.forEach((row, i) => {
    if (row.params.hasOwnProperty('hr') && row.params.hr) {
      mergeBottom(rows[i - 1].cells);
    }
  });

  // cells
  // log("table", "Rows", rows);
  const trows = rows.map(row => {
    const cells = row.cells.map((cell, h) => {
      if (h < headings.length) {
        if (has(headings[h], "shade") && headings[h].shade)
          cell.shade = true;
      }
      const cellCls = elementClass('td', null, cell, ['shade'], { 'align': '', 'valign': 'bottom' });
      return `<td${cellCls}>${reg.renderItem(cell, doc)}</td>`;
    });

    const rowCls = elementClass('tr', null, row.params, ['hr']);
    // log("table", "Table row class", row, rowCls);
    return `<tr${rowCls}>${cells.join("\n")}</tr>\n`;
  });

  // put it all together
  const cls = elementClass('table', null, args, ['zebra', 'collapse', 'fixed', 'blk'], ['width', 'layout']);
  return `<table${cls}>${thead}<tbody>${trows.join("\n")}</tbody></table>`;
}
