import * as _ from 'lodash';

import { interpolate, elementID, elementClass } from '../util';

function tableBodyTemplate_basic(rows, columns) {

}

export let table = {
    name: 'table',
    defaults: {
        rows: [],
        columns: [],
        repeat: 1,
        flip: false,
        template: [],
    },
    render: (args, reg) => {
        // log("table", "Table", args);
        var cls = elementClass('table', null, args, [ 'zebra', 'collapse', 'fixed' ], [ 'width', 'layout' ]);

        // columns headings
        var tcols = args.columns.map(col => {
            if (col === null) col = { type: 'label', label: '' };
            else if (_.isString(col)) col = { type: 'label', label: col, misc: (col == "Misc") };

            var elem = reg.renderItem(col);
            var colspan = (col.hasOwnProperty('colspan') && col.colspan > 1) ? ` colspan='${col.colspan}'` : '';
            return `<th${colspan}>${elem}</th>`;
        });

        var thead = '';
        if (tcols.length != 0) {
            thead = `<thead>${tcols.join("\n")}</thead>`;
        }

        // rows template
        var rowCallback;
        if (_.isFunction(args.template)) {
            rowCallback = args.template;
        } else if (Array.isArray(args.template)) {
            rowCallback = function(row) {
                // log("table", "Template cells", args.template);
                var templateCells = args.template.flatMap(cell => {
                    if (_.isPlainObject(cell) && _.has(cell, "type") && cell.type == "calc") {
                        var fields = _.clone(cell.inputs);
                        fields.unshift({
                            "type": "span",
                            "content": "=",
                        });
                        var output = _.defaults(cell.output, { "output": true });
                        fields.unshift(output);
                        return fields;
                    }
                    return [ cell ];
                });

                return templateCells.map((cell, i) => {
                    cell = interpolate(cell, row);
                    if (cell === null) {
                        return '<td></td>';
                    } else {
                        if (_.isString(cell)) cell = { type: "label", label: cell };
                        // log("-","Cell:", cell);
                        if (!cell.hasOwnProperty("type")) {
                            return '<td></td>';
                        }

                        var col = _.defaults({label: '', legend: ''}, args.columns[i]);
                        // log("-","Cell:", cell, "+", col);
                        var cell = _.defaults({}, cell, col, { type: 'label', label: '' });
                        // log("-","  =", cell);
                        var cellCls = elementClass('td', null, cell, [], ['align']);
                        return `<td${cellCls}>${reg.renderItem(cell)}</td>`;
                    }
                });
            }
        } else {
            rowCallback = function(row) {
                // log("table", "Table row", row);
                return row.map(cell => {
                    if (_.isString(cell)) cell = { type: "label", label: cell };
                    if (!cell.hasOwnProperty("type")) return  '<td></td>';
                    return `<td>${reg.renderItem(cell)}</td>`;
                });
            }
        }

        var rows = args.rows;
        if (args.repeat > 1) {
            if (_.isEmpty(rows)) {
                rows = [{}];
            }
            // log("-","Repeating row:", rows, "x", args.repeat);
            var repeatedRows = [];
            for (var i = 0; i < args.repeat; i++) {
                repeatedRows = repeatedRows.concat(rows);
            }
            rows = repeatedRows;
        }
        // log("-","Rows:", rows);

        var trows = rows.map(row => {
            return `<tr>${rowCallback(row).join("\n")}</tr>`;
        });
        
        return `<table${cls}>${thead}<tbody>${trows.join("\n")}</tbody></table>`;
    }
}