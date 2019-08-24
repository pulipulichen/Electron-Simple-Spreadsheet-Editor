let ElectronHelper = {
  inited: false,
  lib: {
    fs: null,
    path: null,
    clibboard: null,
    shell: null,
    
    ElectronFileHelper: null,
  },
  init: function () {
    if (this.inited === true) {
      return this
    }
    
    this.lib.ElectronFileHelper = RequireHelper.require('./ElectronFileHelper')
    this.lib.fs = RequireHelper.require('fs')
    this.lib.path = RequireHelper.require('path')
    let electron = RequireHelper.require('electron')
    this.lib.clipboard = electron.clipboard
    this.lib.shell = electron.remote.shell
    
    if (typeof(process) === 'object' && typeof(process.env) === 'object') {
      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    }
    
    this.inited = true
  },
  _configFilePath: 'config.json',
  mount: function (vue, attrs, callback) {
    this.init()
    
    if (Array.isArray(attrs) === false) {
      attrs = [attrs]
    }
    
    let configFilePath = this.lib.path.join(this.getBasePath(), this._configFilePath)
    configFilePath = this.lib.path.resolve(configFilePath)
    //console.log(configFilePath, fs.existsSync(configFilePath))
    
    if (this.lib.ElectronFileHelper.existsSync(configFilePath) === false) {
      if (typeof(callback) === 'function') {
        callback()
      }
      return this
    }
    
    this.lib.fs.readFile(configFilePath, function (err, data) {
      if (err) throw err;
      
      if (data === undefined) {
        if (typeof(callback) === 'function') {
          callback()
        }
        return this
      }
      
      data = data.toString().trim()
      if (data.startsWith('{') && data.endsWith('}')) {
        data = JSON.parse(data.toString())
      }
      else {
        data = {}
      }
      //console.log(data)
      //console.log(attrs)
      attrs.forEach(attr => {
        //console.log(attr)
        if (typeof(data[attr]) !== 'undefined') {
          //console.log(attr)
          vue[attr] = data[attr]
        }
      })
      
      if (typeof(callback) === 'function') {
        callback(data)
      }
    });
  },
  persist: function (vue, attrs, callback) {
    this.init()
    
    if (Array.isArray(attrs) === false) {
      attrs = [attrs]
    }
    
    let data = {}
    attrs.forEach(attr => {
      data[attr] = vue[attr]
    })
    
    let dataString = JSON.stringify(data, null, "\t")
    //console.log(dataString)
    
    this.lib.fs.writeFile(this.lib.path.join(this.getBasePath(), this._configFilePath), dataString, function (err) {
      if (err) throw err;
      if (typeof(callback) === 'function') {
        callback(data)
      }
    });
  },
  getBasePath: function () {
    this.init()
    
    if (this.basepath === null) {
      let basepath = './'
      if (typeof(process.env.PORTABLE_EXECUTABLE_DIR) === 'string') {
        basepath = process.env.PORTABLE_EXECUTABLE_DIR
      }
      this.basepath = basepath
    }
    return this.basepath
  },
  basepath: null,
  resolve: function (filePath) {
    this.init()
    
    let basepath = this.getBasePath()
    return this.lib.path.resolve(basepath, filePath)
  },
  _tmpDirChecked: false,
  getTmpDirPath: function (filePath) {
    this.init()
    
    let tmpDirPath
    if (this._tmpDirChecked === false) {
      tmpDirPath = this.resolve('tmp')
      if (this.lib.fs.existsSync(tmpDirPath) === false) {
        this.lib.fs.mkdirSync(tmpDirPath)
      }
      this._tmpDirChecked = true
    }
    
    if (typeof(filePath) === 'string') {
      filePath = 'tmp/' + filePath
      tmpDirPath = this.resolve(filePath)
    }
    else {
      tmpDirPath = this.resolve('tmp')
    }
    
    return tmpDirPath
  },
  resolveAppPath: function (filePath) {
    this.init()
    
    //console.log([process.env.PORTABLE_EXECUTABLE_DIR, filePath, __dirname])
    
    return this.lib.path.join(__dirname, filePath)
    /*
    if (typeof(process.env.PORTABLE_EXECUTABLE_DIR) === 'string') {
      //console.log(FileSet)
      //alert(['error', filePath ])
      //throw Error('resolveAppPath')
      //console.log(filePath)
      filePath = path.join(__dirname, '/resources/app.asar/app/', filePath)
      return filePath
    }
    else {
      return this.resolve('app/' + filePath)
    }
    */
  },
  getClipboardText: function () {
    this.init()
    
    return this.clipboard.readText('clipboard')
  },
  openDevTools: function () {
    this.init()
    
    this.remote.getCurrentWindow().openDevTools();
    return this
  },
  prompt: function (title, value, callback) {
    this.init()
    
    if (typeof(callback) !== 'function') {
      return this
    }
    
    let prompt = require('electron-prompt');
    prompt({
      title: title,
      label: '',
      value: value,
        //inputAttrs: {
        //    type: 'url'
        //}
    })
    .then((r) => {
        if(r === null) {
            console.log('user cancelled');
        } else {
            //console.log('result', r);
            callback(r)
        }
    })
    .catch(console.error);
  },
  saveFileBase64: function (filepath, base64, callback) {
    this.init()
    
    //fs.writeFileSync(filepath, blob)
    this.lib.fs.writeFile(filepath, base64, 'base64', function(err) {
      if (err) {
        console.log(err);
      }
      if (typeof(callback) === 'function') {
        callback(filepath)
      }
    })
  },
  saveFileText: function (filepath, text, callback) {
    this.init()
    
    //fs.writeFileSync(filepath, blob)
    this.lib.fs.writeFile(filepath, text, function(err) {
      if (err) {
        console.log(err);
      }
      if (typeof(callback) === 'function') {
        callback(filepath)
      }
    })
  },
  openURL: function (url) {
    this.init()
    
    this.lib.shell.openExternal(url);
  }
}

//EectronHelper.init()

if (typeof(window) === 'object') {
  window.ElectronHelper = ElectronHelper
}
if (typeof(module) === 'object') {
  module.exports = ElectronHelper
}