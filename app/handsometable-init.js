
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
  dropdownMenu: ["row_above", "row_below", "col_left", "col_right", "clear_column", "remove_row", "remove_col", "undo", "redo", "rename_col_header"] ,
  filters: true,
  manualRowMove: true,
  manualColumnMove: true,
  manualRowResize: true,
  manualColumnResize: true,
  /*
  afterOnCellMouseDown: function(event, coords, th) {
      if (coords.row === -1 || coords.col === -1) {
        let instance = this,
          isCol = coords.row === -1,
          input = document.createElement('input'),
          rect = th.getBoundingClientRect(),
          addListeners = (events, headers, index) => {
            events.split(' ').forEach(e => {
              input.addEventListener(e, () => {
                headers[index] = input.value;
                instance.updateSettings(isCol ? {
                  colHeaders: headers
                } : {
                  rowHeaders: headers
                });
                setTimeout(() => {
                  if (input.parentNode)
                    input.parentNode.removeChild(input)
                });
              }) 
            })
          },
          appendInput = () => {
            input.setAttribute('type', 'text');
            input.style.cssText = '' +
              'position:absolute;' +
              'left:' + rect.left + 'px;' +
              'top:' + rect.top + 'px;' +
              'width:' + (rect.width - 4) + 'px;' +
              'height:' + (rect.height - 4) + 'px;' +
              'z-index:1060;';
            document.body.appendChild(input);
          };
        input.value = th.querySelector(
          isCol ? '.colHeader' : '.rowHeader'
        ).innerText;
        appendInput();
        setTimeout(() => {
          input.select();
          addListeners('change blur', instance[
            isCol ? 'getColHeader' : 'getRowHeader'
          ](), coords[isCol ? 'col' : 'row']);
        });
      }
    }
     * 
   */
});