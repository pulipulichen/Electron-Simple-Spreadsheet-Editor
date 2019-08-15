let ViewInitConfig = {
  el: '#toolbarContainer',
  data: {
    //fixColumns: 3,
    sheetName: "AAA BBB",
    
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
      let workbook = ElectronHelper.loadFile(filepath)
      if (typeof(workbook) === 'object') {
        document.title = workbook.filename
        this.sheetName = workbook.sheetName
        document.getElementById("handsometableContainer").contentWindow.initHandsometable(workbook.data, workbook.colHeaders)
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
      //document.getElementById("handsometableContainer").contentWindow.ElectronHelper = ElectronHelper
      
      setTimeout(() => {
        this.open()
      }, 1000)
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

