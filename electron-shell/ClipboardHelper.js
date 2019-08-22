const fs = require('fs')
const path = require('path')
const {clipboard} = require('electron')

let ClipboardHelper = {
  getFilePaths: function () {
    let filepaths = []
    
    let clipboardText = clipboard.readText('clipboard')
    if (fs.existsSync(clipboardText)) {
      filepaths.push(clipboardText)
    }

    let clipboardRawFilePath = clipboard.read('FileNameW');
    //console.log(clipboardRawFilePath)
    let clipboardFilePath = clipboardRawFilePath.replace(new RegExp(String.fromCharCode(0), 'g'), '')
    if (fs.existsSync(clipboardFilePath)) {
      filepaths.push(path.resolve(clipboardFilePath))
    }
    
    return filepaths
  }
}

module.exports = ClipboardHelper