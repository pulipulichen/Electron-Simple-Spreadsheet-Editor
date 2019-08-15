/* global HandsontablePluginRenameColHeader */


//window.top.ViewInit.sheetName = workbook.sheetName

//console.log(hot.getSettings())

window.hot

window.initHandsometable = function (data, colHeaders) {
  
  
  //let workbook = window.top.ElectronHelper.loadFile()

  const container = document.getElementById('handsontableContainer');
  window.hot = new Handsontable(container, {
    data: data,
    rowHeaders: true,
    //colHeaders: true,
    //colHeaders: ['', 'Tesla', 'Volvo', 'Toyota', 'Ford', 'Tesla', 'Volvo', 'Toyota', 'Ford', 'Tesla', 'Volvo', 'Toyota', 'Ford', 'Tesla', 'Volvo', 'Toyota', 'Ford', 'Tesla', 'Volvo', 'Toyota', 'Ford'],
    colHeaders: colHeaders,
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
    //dropdownMenu: true,
    //dropdownMenu: ['filter_by_condition', 'filter_operators', 'filter_by_condition2', 'filter_by_value', 'filter_action_bar'],
    dropdownMenu: ["col_left", "col_right", "clear_column", "remove_col", HandsontablePluginRenameColHeader, 'filter_by_condition', 'filter_operators', 'filter_by_condition2', 'filter_by_value', 'filter_action_bar'],
    filters: true,
    manualRowMove: true,
    manualColumnMove: true,
    manualRowResize: true,
    manualColumnResize: true,
    manualColumnFreeze: true,
    //autoColumnSize : true,
  });
}