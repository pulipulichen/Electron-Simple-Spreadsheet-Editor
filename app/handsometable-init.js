
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
  dropdownMenu: ["row_above", "row_below", "col_left", "col_right", "clear_column", "remove_row", "remove_col", "undo", "redo", {
    key: 'rename_col_header',
    name: function name() {
      return "Rename column header"
    },
    callback: function callback(event, coords, th) {
      //this.alter('remove_col', (0, _utils2.transformSelectionToColumnDistance)(this.getSelected()), null, 'ContextMenu.removeColumn');
      //alert('ok')
      console.log([event, coords, th])
      
      let index = coords[0].start.col
      
      let instance = this
      let headers = instance.getColHeader()
      
      console.log(headers)
      
      //headers[index] = 
      let header = headers[index]
      let newHeader = window.prompt('Rename column header', header)
      headers[index] = newHeader
      
      console.log(headers)
      
      //console.log(instance.getColHeader())
      instance.updateSettings({
        modifyColWidth: ()=>{},
        colHeaders: headers
      })
      
      var autoColumnSize = this.getPlugin('autoColumnSize'); 
      autoColumnSize.calculateColumnsWidth(index, 0, true);
      
      /*
      let i = 2
      let selector = `#handsontableContainer .wtHider .wtSpreader .htCore th:eq(${i+1}) span.colHeader`
      console.log(selector)
      console.log($(selector).length)
      console.log($(selector).text())
      $(selector).text('AAA')
      console.log($(selector).text())
      */
      return
      
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
          
        console.log('X')
        input.value = th.querySelector(
          isCol ? '.colHeader' : '.rowHeader'
        ).innerText;
        appendInput();
        
        console.log('E')
        
        setTimeout(() => {
          input.select();
          addListeners('change blur', instance[
            isCol ? 'getColHeader' : 'getRowHeader'
          ](), coords[isCol ? 'col' : 'row']);
        });
        
        console.log('Z')
      }
    },
    disabled: function disabled() {
      /*
      var selected = (0, _utils.getValidSelection)(this);
      var totalColumns = this.countCols();

      if (!selected) {
        return true;
      }

      return this.selection.isSelectedByRowHeader() || this.selection.isSelectedByCorner() || !this.isColumnModificationAllowed() || !totalColumns;
      */
      return false
    },
    hidden: function hidden() {
      //return !this.getSettings().allowRemoveColumn;
      return false
    }
  }] ,
  filters: true,
  manualRowMove: true,
  manualColumnMove: true,
  manualRowResize: true,
  manualColumnResize: true,
  autoColumnSize : true,
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