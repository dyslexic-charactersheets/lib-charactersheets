import { isNull, has, elementClass } from '../util';
import { log, warn } from '../log';

// Column-oriented table
export function renderTableFlipped(args, reg, doc, headings, cols) {
  // log("table", "Flipped", headings, cols);

  // find the size of the table and make an empty grid of cells
  let hasHeading = false;
  const ncols = cols.length;
  let nrows = 0;
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
  const trows = cells.map(row => {
    let th = '';
    if (hasHeading) {
      const head = row.shift();
      const rowspan = (has(head, "rowspan") && head.rowspan > 1) ? ` rowspan="${head.rowspan}"` : '';
      th = `<th scope="row"${rowspan}>${isNull(head) ? '' : reg.renderItem(head, doc)}</th>`;
    }

    const tds = row.map(elem => {
      return `<td>${isNull(elem) ? '' : reg.renderItem(elem, doc)}</td>`;
    });

    return `<tr>${th}${tds.join("")}</tr>`;
  });

  // put it all together
  const cls = elementClass('table', null, args, ['zebra', 'collapse', 'fixed'], ['width', 'layout']);
  return `<table${cls}><tbody>${trows.join("\n")}</tbody></table>`;
}
