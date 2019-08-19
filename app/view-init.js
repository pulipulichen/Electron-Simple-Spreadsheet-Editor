/* global fileType, readChunk, ipc, settings, mode, XLSX, win, fs, ArffHelper, DayjsHelper */

let ViewInitConfig = {
  el: '#toolbarContainer',
  data: {
    //fixColumns: 3,
    sheetName: "",
    filepath: null,
    handsontableContainer: null,
    //_enablePersist: true,
    opened: false,
    changed: false,
    hasFilter: false,
    hasSort: false,
    recentFiles: [],
    recentFilesUnixMS: [],
    persistAttrs: ['recentFiles', 'recentFilesUnixMS'],
    _saveCallback: null,
    hotkeysConfig: 'ctrl+o,ctrl+shift+o,ctrl+s,ctrl+shift+s,ctrl+w,ctrl+f,ctrl+d,ctrl+p',
    minHeight: 600,
    minWidth: 600,
    resized: true
  },
  mounted: function () {
    ElectronHelper.mount(this, this.persistAttrs, () => {
      this._afterMounted()
    })
  },
  watch: {
    opened: function (opened) {
      //console.log(fixColumns)
      //hot = this.getHot()
      
      if (opened === true) {
        $('#welcomePlaceholder').addClass('hide')
        $('#handsontableContainer').removeClass('hide')
      }
    },
    hasFilter: function (hasFilter) {
      if (hasFilter === false) {
        this.clearFilter()
      }
    },
    hasSort: function (hasSort) {
      if (hasSort === false) {
        this.clearSort()
      }
    }
  },
  computed: {
    sheetNameDescription: function () {
      let name = this.sheetName
      if (typeof(name) === 'string' && name.length > 10) {
        name = name.slice(0, 7) + '...' + name.slice(-3)
      }
      return name
    },
    saveAsOnly: function () {
      if (typeof(this.filepath) !== 'string') {
        return false
      }
      else {
        return this.filepath.endsWith('.sav')
      }
    },
    recentFilesData: function () {
      let data = []
      this.recentFiles.forEach((filepath, i) => {
        let unixms = this.recentFilesUnixMS[i]
        data.push({
          filepath: filepath,
          unixms: unixms
        })
      })
      return data
    }
  },
  methods: {
    open: function () {
      //console.log('TODO OPEN')
      //this.showLoading()
      let dir
      if (typeof(this.filepath) === 'string') {
        dir = path.dirname(path.join(__dirname, '../' , this.filepath))
      }
      
      //console.log(dir)
      
      ipc.send('open-file-dialog', win, dir)
    },
    openFiles: function (filepaths) {
      for (let i = 0; i < filepaths.length; i++) {
        let filepath = filepaths[i]
        //console.log(filepath)
        
        if (i === 0 && this.filepath === null) {
          this.openCallback(filepath)
          continue
        }
        
        ipc.send('open-another-win', filepath)
      }
    },
    openCallback: function (filepath) {
      
      //let filepath = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.ods"
      //let filepath = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.csv"
      //let filepath = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.xls"
      //let filepath = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.xlsx"
      
      const buffer = readChunk.sync(filepath, 0, fileType.minimumBytes);
      let fileTypeResult = fileType(buffer)
      
      let ext = filepath.slice(filepath.lastIndexOf('.') + 1)
      
      //console.log(fileTypeResult)
      //if (["application/vnd.oasis.opendocument.spreadsheet"].indexOf(fileTypeResult.mime) > -1) {
      if ( (fileTypeResult === undefined && ext === 'csv')
              || (fileTypeResult === undefined && ext === 'arff')
              || (fileTypeResult === undefined && ext === 'sav')
              || (fileTypeResult.mime === 'application/x-msi' && ext === 'xls')
              || (fileTypeResult.mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && ext === 'xlsx')
              || (fileTypeResult.mime === 'application/vnd.oasis.opendocument.spreadsheet' && ext === 'ods') ) {
        //this.handsontableContainer.src = this.handsontableContainer.src
        if (this.changed === false) {
          this.filepath = filepath
          this.showLoading()
          this.handsontableContainer.contentWindow.location.reload(true)
          this.opened = true
          this.changeTitle(filepath)
          //document.title = workbook.filename
          //ipc.send('change-icon', ext)
        }
        else {
          ipc.send('open-another-win', filepath)
        }
      }
    },
    _openIframeReloadCallback: function () {
      if (typeof(this.filepath) !== 'string') {
        return this
      }
      
      ElectronSheetHelper.loadFile(this.filepath, (workbook) => {
        if (typeof(workbook) === 'object') {
          this.sheetName = workbook.sheetName
          
          let config = {
            data: workbook.data,
            colHeaders: workbook.colHeaders,
            hotkeysConfig: this.hotkeysConfig,
            hotkeysHandler: this.hotkeysHandler,
            fileDragNDropConfig: this.getFileDragNDropConfig(),
            fileDragNDropHandler: this.fileDragNDropHandler,
          }
          
          this.handsontableContainer.contentWindow.initHandsometable(config, (width, height) => {
            this.hideLoading()
            setTimeout(() => {
              this.initHotEvent()
              this.changed = false
              this.resizeWindow(width, height)
              this.addToRecentFile(this.filepath)
              
              this.initHotkeys(this.handsontableContainer.contentWindow)
            }, 100)
          })
        }
        else {
          this.hideLoading()
        }
      })
    },
    resizeWindow: function (width, height) {
      if (this.resized === true) {
        return this
      }
      
      //console.log(height, width)
      height = height + 40 + 42
      if (mode === 'development') {
        height = height + 20
      }
      if (height > screen.availHeight) {
        height = screen.availHeight
      }
      else if (height < this.minHeight) {
        height = this.minHeight
      }

      width = width + 20
      if (width > screen.availWidth) {
        width = screen.availWidth
      }
      else if (width < this.minWidth) {
        width = this.minWidth
      }
      //console.log(height, width)
      //ipc.send('set-window-size', width, height)
      win.setSize(width, height)
      win.center()
      
      this.resized = true
    },
    displayFilePath: function (filepath) {
      let display = path.basename(filepath)
      if (display.length > 20) {
        display = display.slice(0, 20) + '...'
      }
      return display
    },
    displayFileExt: function (filepath) {
      let ext = ''
      if (filepath.lastIndexOf('.') > -1) {
        ext = filepath.slice(filepath.lastIndexOf('.') + 1)
      }
      return ext
    },
    addToRecentFile: function (filepath) {
      let unixms = DayjsHelper.getUnixMS()
      
      if (this.recentFiles.indexOf(filepath) === -1) {
        //this.recentFiles.push(filepath)
        this.recentFiles.unshift(filepath)
        this.recentFilesUnixMS.unshift(unixms)
      }
      else {
        for (var i = this.recentFiles.length - 1; i >= 0; i--) {
          if (this.recentFiles[i] === filepath) {
            this.recentFiles.splice(i, 1)
            this.recentFilesUnixMS.splice(i, 1)
            break;       //<-- Uncomment  if only the first term has to be removed
          }
        }
        this.recentFiles.unshift(filepath)
        this.recentFilesUnixMS.unshift(unixms)
      }
      
      if (this.recentFiles.length > 10) {
        this.recentFiles.shift()
        this.recentFilesUnixMS.shift()
      }
      
      this.persist()
    },
    changeTitle: function (filepath) {
      document.title = path.basename(filepath)
      let ext = filepath.slice(filepath.lastIndexOf('.') + 1)
      //ipc.send('change-icon', ext)
      //let win
      let iconPath = path.join(__dirname, `imgs/${ext}.ico`)
      //console.log(iconPath)
      win.setOverlayIcon(iconPath, '')
      return this
    },
    save: function (callback) {
      if (this.changed === false) {
        return this
      }
      //console.log(data)
      
      //console.log('TODO save')
      
      //let bookType = this.ext
      //let filepath = "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\save.csv"
      this._saveCallback = callback
      let filepath = this.filepath
      return this.saveAsCallback(filepath)
    },
    saveAs: function () {
      //console.log('TODO save as')
      let filepath = path.resolve(this.filepath)
      
      //console.log([filepath, path.resolve(filepath)])
      
      if (fs.existsSync(filepath)) {
        // 幫他加個名字
        let header = filepath.slice(0, filepath.lastIndexOf('.'))
        let footer = filepath.slice(filepath.lastIndexOf('.'))
        let time = DateHelper.getMMDDHHmm('_') // MMDD HHmm
        filepath = header + '-' + time + footer
      }
      
      ipc.send('open-file-dialog-save', win, filepath)
      return this
      //console.log(process.platform)
  
      /*
      let options = {
        title: 'Please select a spread sheet file',
        properties: ['openFile']
      }

      if (typeof(dir) === 'string' && dir !== '' && fs.existsSync(dir)) {
        options.defaultPath = dir
      }

      if (process.platform === 'win32') {
        options.filters = [
          { name: 'Spread sheets', extensions: ['ods', 'csv', 'xlsx', 'xls'] },
          { name: 'OpenDocument Format', extensions: ['ods'] },
          { name: 'Comma-Separated Values', extensions: ['csv'] },
          { name: 'Microsoft Excel 2007–2019', extensions: ['xlsx'] },
          { name: 'MicrosoftExcel 97–2003', extensions: ['xls'] }
        ]
      }

      dialog.showOpenDialog(win, options, (files) => {
        if (files && typeof(files[0]) === 'string') {

          let filepath = files[0]
          this.saveAsCallback(filepath)
        }
      })
      */
    },
    saveAsCallback: function (filepath, callback) {
      this.showLoading()
      //console.log(filepath)
      let bookType = filepath.slice(filepath.lastIndexOf('.') + 1)
      
      let data = this.handsontableContainer.contentWindow.getData()
      //console.log(data)
      //return
      
      if (['csv', 'ods', 'xls', 'xlsx'].indexOf(bookType) > -1) {
        return this.saveAsSheet(filepath, bookType, data)
      }
      else if (bookType === 'arff') {
        return this.saveAsARFF(filepath, bookType, data)
      }
    },
    saveAsSheet: function (filepath, bookType, data) {
      let wboutBase64 = JSXlsxHelper.buildBase64File(bookType, this.sheetName, data)
      ElectronHelper.saveFileBase64(filepath, wboutBase64, () => {
        this.saveAsComplete(filepath)
      })
      return this
    },
    saveAsComplete: function (filepath) {
      this.changeTitle(filepath)

      this.changed = false
      this.hideLoading()
      this.filepath = filepath
      
      if (typeof(this._saveCallback) === 'function') {
        this._saveCallback()
      }
    },
    saveAsARFF: function (filepath, bookType, data) {
      ArffHelper.write(filepath, data, () => {
        this.saveAsComplete(filepath)
      })
    },
    saveAndClose: function () {
      this.save(() => {
        win.destroy()
      })
    },
    _afterMounted: function () {
      this.initDropdown()
      this.initHotkeys()
      this.initIpc()
      this.handsontableContainer = document.getElementById("handsontableContainer")
      this.handsontableContainer.onload = () => {
        //console.log('onload')
        this._openIframeReloadCallback()
      }
      //document.getElementById("handsontableContainer").contentWindow.ElectronHelper = ElectronHelper
      
      $('#welcomePlaceholder').click(() => {
        this.open()
      })
      
      if (typeof(filepath) === 'string') {
        this.openCallback(filepath)
        //setTimeout(() => {
          //this.open()
          //this._openCallback(null, "D:\\xampp\\htdocs\\projects-electron\\Electron-Simple-Spreadsheet-Editor\\[test\\file_example_ODS_10.utf8.csv")
        //}, 1000)
      }
      //this.initDragNDropEvent()
      
      //setTimeout(() => {
      //  this.saveAs()
      //}, 1000)
    },
    initDropdown: function () {
      $('.ui.dropdown')
        .dropdown({
          clearable: true,
          placeholder: 'any'
        })
    },
    initHotkeys: function () {
      //console.log(this.hotkeyConfig)
      hotkeys(this.hotkeysConfig, (event, handler) => {
        this.hotkeysHandler(handler)
      });
    },
    hotkeysHandler: function (handler) {

      //console.log(handler.key)
      switch(handler.key) {
        case "ctrl+o":
        case "o":
          this.open();break;
        case "ctrl+shift+o": 
        case "O": 
          this.reopen();break;
        case "ctrl+s": 
        case "s": 
          this.save();break;
        case "ctrl+shift+s": 
        case "S": 
          this.saveAs();break;
        case "ctrl+w": 
        case "w": 
          this.exit();break;
        case "ctrl+d": 
        case "d": 
          this.openFileLocation();break;
        case "ctrl+p": 
        case "p": 
          this.copyFilePath();break;
        case "ctrl+f": 
        case "f": 
          this.$refs.searchInput.focus();break;
      }
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
    //initDragNDropEvent: function () {
    //  FileDragNDropHelper.getFilePaths(this.getFileDragNDropConfig(), (filepaths) => {
    //    this.fileDragNDropHandler(filepaths)
    //  })
    //},
    getFileDragNDropConfig: function () {
      return "Drag a sheet file<br />into here"
    },
    fileDragNDropHandler: function (filepaths) {
      //this.open(files)
      //console.log(filepaths)
      this.openFiles(filepaths)
    },
    getHot: function () {
      return document.getElementById("handsontableContainer").contentWindow.hot
    },
    getData: function () {
      let data = document.getElementById("handsontableContainer").contentWindow.getData()
      console.log(data)
    },
    persist: function () {
      //console.log([this._enablePersist, this._debugDemo])
      //if (this._enablePersist) {
        ElectronHelper.persist(this, this.persistAttrs)
      //}
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
      hot = this.handsontableContainer.contentWindow.hot
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
      
      hot.addHook('afterDocumentKeyDown', (event) => {
        //console.log(hotkeys.isPressed("ctrl")); //=> true
        //console.log(hotkeys.isPressed("shift")); //=> true
        //console.log([event.ctrlKey, event.shiftKey, event.keyCode])
        
        let handler = []
        if (event.ctrlKey) {
          handler.push('ctrl')
        }
        if (event.shiftKey) {
          handler.push('shift')
        }
        switch (event.keyCode) {
          case 79: handler.push('o');break;
          case 83: handler.push('s');break;
          case 87: handler.push('w');break;
          case 70: handler.push('f');break;
          case 68: handler.push('d');break;
          case 80: handler.push('p');break;
        }
        this.hotkeysHandler({
          key: handler.join('+')
        })
      })
    },
    reopen: function () {
      this.openCallback(this.filepath)
    },
    clearSort: function () {
      if (this.hasSort === false) {
        return this
      }
      this.getHot().getPlugin('columnSorting').clearSort()
      this.hasSort = false
    },
    clearFilter: function () {
      if (this.hasFilter === false) {
        return this
      }
      
      let hot = this.getHot()
      let filters = hot.getPlugin('Filters')
      filters.clearConditions()
      filters.filter()
      hot.render()
      this.hasFilter = false
    },
    search : function (event) {
      //console.log(r)
      let hot = this.getHot()
      if (hot === undefined) {
        return this
      }
      let search = hot.getPlugin('search');
      let queryResult = search.query(event.srcElement.value);
      hot.render()
      return this
    },
    changeSheetName: function () {
      ElectronHelper.prompt('Change sheet name', this.sheetName, (newSheetName) => {
        if (typeof(newSheetName) === 'string' && newSheetName.trim() !== '') {
          this.sheetName = newSheetName
        }
      })
    },
    openFileLocation: function () {
      let dirname = path.dirname(this.filepath)
      exec(`start "" "${dirname}"`)
    },
    copyFilePath: function () {
      clipboard.writeText(this.filepath)
    },
    exit: function () {
      remote.getCurrentWindow().close()
    },
    downloadEditor: function (event) {
      ElectronHelper.openURL('https://www.libreoffice.org/download/download/')
    },
    openProject: function () {
      ElectronHelper.openURL('https://github.com/pulipulichen/Electron-Simple-Spreadsheet-Editor')
    },
    openIssues: function () {
      ElectronHelper.openURL('https://github.com/pulipulichen/Electron-Simple-Spreadsheet-Editor/issues')
    },
    openAboutAuthor: function () {
      ElectronHelper.openURL('http://blog.pulipuli.info/p/about_38.html')
    }
  }
}

window.ViewInit = new Vue(ViewInitConfig)

$(() => {
  //ViewInit.initDropdown()
})

//$('#handsontableContainer').load(() => {
//  console.log('load')
  //document.getElementById("handsontableContainer").contentWindow.ElectronHelper = ElectronHelper
//})

