/* global HandsontablePluginRenameColHeader */


//window.top.ViewInit.sheetName = workbook.sheetName

//console.log(hot.getSettings())

window.hot


window.initHandsometable = function (data, colHeaders, callback) {
  
  const container = document.getElementById('handsontableContainer');
  /*
  if (window.hot !== undefined) {
    window.hot.destroyEditor()
    container.innerHTML = ''
  }
  */
 
  let config = {
    init: callback,
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
    dropdownMenu: [HandsontablePluginColumnSortAsc, HandsontablePluginColumnSortDesc, "col_left", "col_right", "clear_column", "remove_col", HandsontablePluginRenameColHeader, 'filter_by_condition', 'filter_operators', 'filter_by_condition2', 'filter_by_value', 'filter_action_bar'],
    filters: true,
    manualRowMove: true,
    manualColumnMove: true,
    manualRowResize: true,
    manualColumnResize: true,
    manualColumnFreeze: true
    
    //autoColumnSize : true,
  }
  
  //let workbook = window.top.ElectronHelper.loadFile()
  window.hot = new Handsontable(container, config);
}

window.getData = function () {
  let result = {}
  result.header = window.hot.getColHeader()
  result.rows = []
  window.hot.getData().forEach(row => {
    let rowObject = {}
    row.forEach((field, i) => {
      let header = result.header[i]
      rowObject[header] = field
    })
    result.rows.push(rowObject)
  })
  
  //let data = [colHeaders]
  //for (let i = 0; i < rows.length; i++) {
  //  data.push(rows[i])
  //}
  return result
}