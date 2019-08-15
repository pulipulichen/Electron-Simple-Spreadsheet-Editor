/* global fileType, readChunk, ipc, settings */

let ViewInitConfig = {
  el: '#toolbarContainer',
  data: {
    //fixColumns: 3,
    sheetName: "AAA BBB",
    filepath: null,
    ext: null,
    handsometableContainer: null,
    _enablePersist: true,
    //persistAttrs: ['fixColumns']
  },
  mounted: function () {
    this._afterMounted()
  },
  /*
  watch: {
    fixColumns: function (fixColumns) {
      //console.log(fixColumns)
      hot = this.getHot()
      
    }
  },
   */
  methods: {
    open: function () {
      //console.log('TODO OPEN')
      //this.showLoading()
      ipc.send('open-file-dialog')
    },
    _openCallback: function (event, filepath) {
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
      }
    },
    _openIframeReloadCallback: function () {
      if (typeof(this.filepath) !== 'string') {
        return this
      }
      
      let workbook = ElectronHelper.loadFile(this.filepath)
      if (typeof(workbook) === 'object') {
        document.title = workbook.filename
        this.sheetName = workbook.sheetName
        this.handsometableContainer.contentWindow.initHandsometable(workbook.data, workbook.colHeaders, () => {
          this.hideLoading()
        })
      }
      else {
        this.hideLoading()
      }
      
    },
    save: function () {
      console.log('TODO save')
    },
    saveAs: function () {
      console.log('TODO save as')
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
      
      if (typeof(settings.get('filepath')) === 'string') {
        this._openCallback(null, settings.get('filepath'))
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
        this._openCallback(event, path)
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

