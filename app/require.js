
const path = require ('path')
const fs = require('fs');

const remote = require('electron').remote;
const electronApp = remote.app;
const ipc = require('electron').ipcRenderer

const shell = remote.shell
const homedir = require('os').homedir()

let exec = require('child_process').exec

const getPath = require('platform-folders').default
//console.log(getPath('desktop'));

const { clipboard } = require('electron')

window.$ = window.jQuery = require('jquery')

const readChunk = require('read-chunk')
const fileType = require('file-type')

const iconv = require('iconv-lite')
const csv = require('csv-parser');
const stripBomStream = require('strip-bom-stream');

const detect = require('charset-detector');

const jschardet = require("jschardet")

const win = remote.getCurrentWindow()
const mode = win.mode
const filepath = win.filepath
