const {
  app,
  BrowserWindow,
  clipboard,
} = require('electron')

const url = require('url')
const path = require('path')

let mode = 'production'
if (process.argv.indexOf('--mode') - process.argv.indexOf('development') === -1) {
  mode = "development"
}
// For test
//mode = 'development'

module.exports = function (filepath, callback) {
  
  let iconPath = path.join(__dirname, '../app/imgs/icon256.ico')
  if (process.platform === 'linux') {
    iconPath = path.join(__dirname, '../app/imgs/icon256.png')
  }
  
  let optionBrowserWindow = {
    //fullscreen: true,
    icon: iconPath,
    //useContentSize: true,
    webPreferences: {
      nodeIntegration: true
    }
  }
  
  let win = new BrowserWindow(optionBrowserWindow)
  //win.maximize();
  
  if (mode === 'production') {
    win.setMenu(null)
    win.setMenuBarVisibility(false)
  }
  
  win.loadURL(url.format({
    pathname: path.join(__dirname, '../app/', 'electron-index.html'),
    protocol: 'file:',
    slashes: true
  }))
  
  //settings.set('mode', mode);
  
  if (mode === 'development') {
    win.webContents.openDevTools()
  }
  
  // When Window Close.
  win.on('close', function(e){
    //console.log('aaa')
    e.preventDefault();
    win.webContents.executeJavaScript('window.ViewInit.changed')
      .then(result => {
        if (result === false) {
          win.destroy()
        }
        else {
          //console.log(win.webContents)
          require('electron').dialog.showMessageBox(this,
            {
              type: 'question',
              buttons: ['Close without saving', 'Save and close', 'Cancel'],
              title: 'File is not saved',
              message: 'Are you sure you want to quit?'
           }, (response) => {
              if (response === 0){
                //e.preventDefault();
                win.destroy()
                win = null
              }
              else if (response === 1) {
                win.webContents.executeJavaScript('window.ViewInit.saveAndClose()')
              }
           });
        }
    });
          
  });
  
  //win.rendererSideName.filepath = filepath
  //win.rendererSideName.mode = mode
  win.mode = mode
  win.filepath = filepath
  
  //return win
  win.webContents.once('dom-ready', () => {
    if (typeof(callback) === 'function') {
      callback(win)
    }
  })
  return win
}