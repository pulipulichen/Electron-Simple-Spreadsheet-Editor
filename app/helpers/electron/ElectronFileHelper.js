let ElectronFileHelper = {
  inited: false,
  lib: {
    readChunk: null,
    fileType: null,
    path: null,
    fs: null,
  },
  init: function () {
    if (this.inited === true) {
      return
    }
    
    this.lib.readChunk = RequireHelper.require('read-chunk')
    this.lib.fileType = RequireHelper.require('file-type')
    this.lib.path = RequireHelper.require('path')
    this.lib.fs = RequireHelper.require('fs')
    
    this.inited = true
  },
  getExt: function (filepath) {
    this.init()
    
    let ext
    if (typeof(filepath) === 'string') {
      ext = filepath.slice(filepath.lastIndexOf('.') + 1)
    }
    return ext
  },
  getFileType: function (filepath) {
    this.init()
    
    const buffer = this.lib.readChunk.sync(filepath, 0, this.lib.fileType.minimumBytes);
    let fileTypeResult = this.lib.fileType(buffer)
    return fileTypeResult
  },
  basename: function (filepath) {
    this.init()
    return this.lib.path.basename(filepath)
  },
  existsSync: function (filepath) {
    this.init()
    return this.lib.fs.existsSync(filepath)
  },
}

//ElectronFileHelper.init()

if (typeof(window) === 'object') {
  window.ElectronFileHelper = ElectronFileHelper
}
if (typeof(module) === 'object') {
  module.exports = ElectronFileHelper
}