import { isNull, has, elementClass } from '../util';
import { log, warn } from '../log';

// Column-oriented table
export function renderTableFlipped(args, reg, doc, headings, cols) {
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
      var rowspan = (has(head, "rowspan") && head.rowspan > 1) ? ` rowspan="${head.rowspan}"` : '';
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
