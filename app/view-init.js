/* global fileType, readChunk, ipc, settings */

let ViewInitConfig = {
  el: '#toolbarContainer',
  data: {
    //fixColumns: 3,
    sheetName: "",
    filepath: null,
    handsometableContainer: null,
    _enablePersist: true,
    opened: false,
    changed: false,
    hasFilter: false,
    hasSort: false
    //persistAttrs: ['fixColumns']
  },
  mounted: function () {
    this._afterMounted()
  },
  watch: {
    opened: function (opened) {
      //console.log(fixColumns)
      //hot = this.getHot()
      
      if (opened === true) {
        $('#welcomePlaceholder').addClass('hide')
        $('#handsometableContainer').removeClass('hide')
      }
    }
  },
  methods: {
    open: function () {
      //console.log('TODO OPEN')
      //this.showLoading()
      ipc.send('open-file-dialog')
    },
    openCallback: function (filepath) {
      //let filepath = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.ods"
      //let filepath = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.csv"
      //let filepath = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.xls"
      //let filepath = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.xlsx"
      this.filepath = filepath
      
      const buffer = readChunk.sync(filepath, 0, fileType.minimumBytes);
      let fileTypeResult = fileType(buffer)
      
      let ext = filepath.slice(filepath.lastIndexOf('.') + 1)
      
      //console.log(fileTypeResult)
      //if (["application/vnd.oasis.opendocument.spreadsheet"].indexOf(fileTypeResult.mime) > -1) {
      if ( (fileTypeResult === undefined && ext === 'csv')
              || (fileTypeResult.mime === 'application/x-msi' && ext === 'xls')
              || (fileTypeResult.mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && ext === 'xlsx')
              || (fileTypeResult.mime === 'application/vnd.oasis.opendocument.spreadsheet' && ext === 'ods') ) {
        //this.handsometableContainer.src = this.handsometableContainer.src
        this.showLoading()
        this.handsometableContainer.contentWindow.location.reload(true)
        this.opened = true
        this.changeTitle(filepath)
        //document.title = workbook.filename
        //ipc.send('change-icon', ext)
      }
    },
    _openIframeReloadCallback: function () {
      if (typeof(this.filepath) !== 'string') {
        return this
      }
      
      let workbook = ElectronHelper.loadFile(this.filepath)
      if (typeof(workbook) === 'object') {
        this.sheetName = workbook.sheetName
        this.handsometableContainer.contentWindow.initHandsometable(workbook.data, workbook.colHeaders, () => {
          this.hideLoading()
          setTimeout(() => {
            this.initHotEvent()
          }, 0)
        })
      }
      else {
        this.hideLoading()
      }
      
    },
    changeTitle: function (filepath) {
      document.title = path.basename(filepath)
      let ext = filepath.slice(filepath.lastIndexOf('.') + 1)
      ipc.send('change-icon', ext)
    },
    save: function () {
      if (this.changed === false) {
        return this
      }
      
      //console.log(data)
      
      //console.log('TODO save')
      
      //let bookType = this.ext
      //let filepath = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\save.csv"
      let filepath = this.filepath
      this.saveAsCallback(filepath)
    },
    saveAs: function () {
      //console.log('TODO save as')
      let filepath = this.filepath
      ipc.send('open-file-dialog-save', filepath)
    },
    saveAsCallback: function (filepath) {
      //console.log(filepath)
      let bookType = filepath.slice(filepath.lastIndexOf('.') + 1)
      
      let data = this.handsometableContainer.contentWindow.getData()
      //console.log(data)
      //return
      
      let wopts = { bookType: bookType, bookSST:false, type:'base64' };
      let sheets = {}
      sheets[this.sheetName] = XLSX.utils.json_to_sheet(data.rows, {
        header: data.header
      })
      
      let workbook = {
        "SheetNames": ["xls sheet"],
        "Sheets": sheets,
        "Workbook": {
          "Sheets": [{ Hidden: 0, name: this.sheetName } ]
        }
      }
      //console.log(workbook)
      let wbout = XLSX.write(workbook, wopts)
      //let base64 = new Blob([wbout],{type:"application/octet-stream"})
      ElectronHelper.saveFile(filepath, wbout)
      
      this.changeTitle(filepath)
      
      this.changed = false
    },
    _afterMounted: function () {
      this.initDropdown()
      this.initHotkeys()
      this.initIpc()
      this.handsometableContainer = document.getElementById("handsometableContainer")
      this.handsometableContainer.onload = () => {
        //console.log('onload')
        this._openIframeReloadCallback()
      }
      //document.getElementById("handsometableContainer").contentWindow.ElectronHelper = ElectronHelper
      
      $('#welcomePlaceholder').click(() => {
        this.open()
      })
      
      if (typeof(settings.get('filepath')) === 'string') {
        this.openCallback(settings.get('filepath'))
        //setTimeout(() => {
          //this.open()
          //this._openCallback(null, "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.utf8.csv")
        //}, 1000)
      }
        
    },
    initDropdown: function () {
      $('.ui.dropdown')
        .dropdown({
          clearable: true,
          placeholder: 'any'
        })
    },
    initHotkeys: function () {
      hotkeys('ctrl+o,ctrl+s,ctrl+shift+s', (event, handler) => {
        switch(handler.key) {
          case "ctrl+o": this.open();break;
          case "ctrl+s": this.save();break;
          case "ctrl+shift+s": this.saveAs();break;
        }
      });
    },
    initIpc: function () {
      ipc.on('selected-file', (event, path) => {
        //console.log(['[', path, ']'])
        this.openCallback(path)
      });
      
      ipc.on('selected-file-save', (event, path) => {
        //console.log(['[', path, ']'])
        this.saveAsCallback(path)
      });
    },
    getHot: function () {
      return document.getElementById("handsometableContainer").contentWindow.hot
    },
    getData: function () {
      let data = document.getElementById("handsometableContainer").contentWindow.getData()
      console.log(data)
    },
    persist: function () {
      //console.log([this._enablePersist, this._debugDemo])
      if (this._enablePersist && (this._debugDemo === false || this._debugDemo === undefined)) {
        ElectronHelper.persist(this, this.persistAttrs)
      }
    },
    showLoading: function () {
      $('body').dimmer('show')
    },
    hideLoading: function () {
      $('body').dimmer('hide')
    },
    setDocumentChanged: function () {
      if (document.title.startsWith('*') === false) {
        document.title = '*' + document.title
      }
      this.changed = true
    },
    initHotEvent: function () {
      hot = this.handsometableContainer.contentWindow.hot
      //console.log(hot)
      if (hot === undefined) {
        return this
      }
      
      new Array('afterSetDataAtCell', 'afterUpdateSettings', 'afterColumnMove', 'afterRowMove').forEach(event => {
        hot.addHook(event, () => {
          this.setDocumentChanged()
        })
      })
      
      new Array('afterColumnSort').forEach(event => {
        hot.addHook(event, () => {
          this.setDocumentChanged()
          this.hasSort = true
        })
      })
      
      new Array('afterFilter').forEach(event => {
        hot.addHook(event, () => {
          this.setDocumentChanged()
          this.hasFilter = true
        })
      })
    },
    reopen: function () {
      this.openCallback(this.filepath)
    },
    clearSort: function () {
      this.getHot().getPlugin('columnSorting').clearSort()
    },
    clearFilter: function () {
      let hot = this.getHot()
      let filters = hot.getPlugin('Filters')
      filters.clearConditions()
      filters.filter()
      hot.render()
    },
    search : function (event) {
      //console.log(r)
      let hot = this.getHot()
      let search = hot.getPlugin('search');
      let queryResult = search.query(event.srcElement.value);
      hot.render()
    },
    changeSheetName: function () {
      ElectronHelper.prompt('Change sheet name', this.sheetName, (newSheetName) => {
        if (typeof(newSheetName) === 'string' && newSheetName.trim() !== '') {
          this.sheetName = newSheetName
        }
      })
    }
  }
}

window.ViewInit = new Vue(ViewInitConfig)

$(() => {
  //ViewInit.initDropdown()
})

//$('#handsometableContainer').load(() => {
//  console.log('load')
  //document.getElementById("handsometableContainer").contentWindow.ElectronHelper = ElectronHelper
//})

