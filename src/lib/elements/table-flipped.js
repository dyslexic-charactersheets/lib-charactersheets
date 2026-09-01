/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

import { isNull, isString, isEmpty, isObject } from '../util';
import { elementClass } from '../util/elements';
import { log, warn } from '../log';
import { has } from '../util/objects';

// Column-oriented table
export function renderTableFlipped(args, reg, doc, headings, cols) {
  // log("table", "Flipped", headings, cols);

  // find the size of the table and make an empty grid of cells
  let hasHeading = false;
  let ncols = cols.length;
  let nrows = 0;
  headings = headings.map(heading => {
    if (isNull(heading) || (isString(heading) && heading == "") || (isObject(heading) && heading.type == 'label' && isEmpty(heading.label)) ) {
      heading = { type: 'label', label: '' };
    } else {
      hasHeading = true;
    }

    if (!has(heading, "rowspan")) heading.rowspan = 1;
    nrows += heading.rowspan;
    return heading;
  });
  cols.forEach(col => {
    if (col.cells.length > nrows) nrows = col.cells.length;
  });

  if (hasHeading) ncols++;
  // log("table", `Table: ${nrows} rows, ${ncols} cols`);
  let cells = Array.from({ length: nrows }, r => Array(ncols).fill(null));
  // log("table", "Cell grid:", cells);

  // fill the grid
  if (hasHeading) {
    // log("table", "Headings");
    let row = 0;
    headings.forEach(heading => {
      cells[row][0] = heading;
      row += heading.rowspan;
    });
  }

  let cappedCols = Array(ncols).fill(false);
  let colLevels = Array(ncols).fill(false);

  cols.forEach((col, c) => {
    if (hasHeading) c++;
    if (has(col, "params") && col.params && has(col.params, 'level-capped')) {
      cappedCols[c] = col.params['level-capped'];
      colLevels[c] = has(col.params, 'level-required') ? col.params['level-required'] : col.params.level;
    }
    // log("table", "Column", c, col);
    col.cells.forEach((cell, r) => {
      // log("table", "Cell at:", r, c, "=", cell);
      cells[r][c] = cell;
    });
  });

  // log("table", "Cells", cells);

  // render it
  const trows = cells.map(row => {
    let th = '';
    if (hasHeading) {
      const head = row.shift();
      const colspan = (has(head, "colspan") && head.colspan > 1) ? ` colspan="${head.colspan}"` : '';
      const rowspan = (has(head, "rowspan") && head.rowspan > 1) ? ` rowspan="${head.rowspan}"` : '';
      th = `<th scope="row"${colspan}${rowspan}>${isNull(head) ? '' : reg.renderItem(head, doc)}</th>`;
    }

    const tds = row.map((elem, c) => {
      const i = hasHeading ? c + 1 : c;
      const colspan = (has(elem, "colspan") && elem.colspan > 1) ? ` colspan="${elem.colspan}"` : '';
      const rowspan = (has(elem, "rowspan") && elem.rowspan > 1) ? ` rowspan="${elem.rowspan}"` : '';
      const cls = cappedCols[i] ? ` class="td--level-capped"` : '';
      const level = (colLevels[i] !== false) ? ` data-level='${colLevels[i]}'` : '';
      return `<td${cls}${level}>${isNull(elem) ? '' : reg.renderItem(elem, doc)}</td>`;
    });

    return `<tr>${th}${tds.join("")}</tr>`;
  });

  // put it all together
  const cls = elementClass('table', null, args, ['zebra', 'collapse', 'fixed', 'blk', 'flip'], {'width': '', 'layout': ''});
  return `<table${cls}><tbody>${trows.join("\n")}</tbody></table>`;
}
