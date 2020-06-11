import { isNull } from '../util';
import { elementClass, mergeBottom } from '../util/elements';
import { has } from '../util/objects';
// import { log, warn } from '../log';
// import { mergeBottom } from '../classes/Registry';

// Standard table
export function renderTableBasic(args, reg, doc, headings, rows) {
  // headings
  let thead = '';
  if (!isNull(headings)) {
    const tcols = headings.map(col => {
      const colCls = elementClass('th', null, col, ['vr'], { 'width': '' });
      const elem = reg.renderItem(col, doc);
      const cs = has(col, 'colspan') ? col.colspan : 1;
      const colspan = (cs > 1) ? ` colspan='${col.colspan}'` : '';
      return `<th${colCls}${colspan}>${elem}</th>`;
    });
    thead = `<thead>${tcols.join("\n")}</thead>\n`;
  }

  // take care of the 'hr'
  rows.forEach((row, i) => {
    if (has(row.params, 'hr') && row.params.hr) {
      mergeBottom(rows[i - 1].cells, true);
    }
  });
  if (args['merge-bottom']) {
    mergeBottom(rows[rows.length - 1].cells, true);
  }

  // cells
  // log("table", "Rows", rows);
  const trows = rows.map(row => {
    const cells = row.cells.map((cell, h) => {
      if (h < headings.length) {
        // if (has(headings[h], "shade") && headings[h].shade)
        //   cell.shade = true;
        // use object destructuring to extract fields from the heading
        let colFields = (({shade, vr}) => ({shade, vr}))(headings[h]);
        cell = {...colFields, ...cell};
      }
      const cellCls = elementClass('td', null, cell, ['shade', 'vr'], { 'width': '', 'align': '', 'valign': 'bottom' });
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
