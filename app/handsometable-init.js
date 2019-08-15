
/* global HandsontablePluginRenameColHeader */

const container = document.getElementById('handsontableContainer');
const hot = new Handsontable(container, {
  data: data,
  rowHeaders: true,
  //colHeaders: true,
  colHeaders: ['', 'Tesla', 'Volvo', 'Toyota', 'Ford', 'Tesla', 'Volvo', 'Toyota', 'Ford', 'Tesla', 'Volvo', 'Toyota', 'Ford', 'Tesla', 'Volvo', 'Toyota', 'Ford', 'Tesla', 'Volvo', 'Toyota', 'Ford'],
  multiColumnSorting: {
    indicator: true
  },
  autoColumnSize: {
    samplingRatio: 23
  },
  contextMenu: true,
  columnSorting: {
    indicator: true
  },
  dropdownMenu: ["row_above", "row_below", "col_left", "col_right", "clear_column", "remove_row", "remove_col", "undo", "redo", HandsontablePluginRenameColHeader],
  filters: true,
  manualRowMove: true,
  manualColumnMove: true,
  manualRowResize: true,
  manualColumnResize: true,
  //autoColumnSize : true,
});