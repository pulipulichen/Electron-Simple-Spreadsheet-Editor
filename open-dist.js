//console.log('@TODO OK')
const exec = require('child_process').exec
const path = require('path')
const DateHelper = require('./app/helpers/DateHelper.js').default
const fs = require('fs')
const os = require('os')
const getLastLine = require('./build-scripts/fileTools.js').getLastLine

let proejctName = 'electron-simple-spreadsheet-editor'

// ------------------------------
// 記錄檔案大小 
let distPath
if (process.platform === 'win32') {
  distPath = path.join(__dirname, 'dist', proejctName + '.exe')
}
else if (process.platform === 'linux') {
  distPath = path.join('dist', proejctName + '_1.0.0_amd64.deb')
}
let logPath = path.join(__dirname, 'dist/log.txt')
let size = fs.statSync(distPath).size
let timeString = DateHelper.getCurrentTimeString()
let sizeInterval = 0

// 先讀取最後一行
let readLog = () => {
  if (fs.existsSync(logPath) === false) {
    writeLog()
    return
  }
  
  getLastLine(logPath, 1)
        .then((lastLine) => {
          console.log(lastLine)
          if (lastLine.lastIndexOf('\t') > 0) {
            let lastSize = lastLine.slice(lastLine.indexOf('\t') + 1, lastLine.lastIndexOf('\t')).trim()
            lastSize = parseInt(lastSize, 10)
            sizeInterval = size - lastSize
          }
          
          writeLog()
        })
        .catch((err) => {
          console.error(err)
        })
}

let writeLog = () => {
  let line = timeString + '\t' + size + '\t' + sizeInterval + '\n'

  if (process.platform === 'linux') {
    fs.open(logPath, 'a', 777, function( e, id ) {
      fs.write( id, line, null, 'utf8', function(){
       fs.close(id, function(){
        //console.log('file is updated');
        if (process.platform === 'linux') {
          fs.chmodSync(logPath, 0o777)
        }
        console.log(line)
       });
      });
     });
  }
  else {
    console.log(logPath)
    fs.appendFile(logPath, line, function (err) {
      if (err) throw err;
      console.log('log saved!');
    });
  }
}

readLog()

if (process.platform === 'win32') {
  
  console.log(distPath)
  exec(distPath, () => {})
}
else if (process.platform === 'linux') {
  let terminalBinsCandicates = [
    //'/usr/bin/xfce4-terminal',
    '/usr/bin/xterm',
    '/usr/bin/gnome-terminal',
    '/usr/bin/konsole',
    '/usr/bin/terminal'
  ]
  
  let terminalPath
  for (let i = 0; i < terminalBinsCandicates.length; i++) {
    let p = terminalBinsCandicates[i]
    if (fs.existsSync(p)) {
      terminalPath = p
      break
    }
  }
  
  if (terminalPath !== undefined) {
    let command = `${terminalPath} -e sudo dpkg -i ./${distPath} -y`
    exec(command, (error, stdout, stderr) => {
      
      if (error) {
        console.log(error)
      }
      if (stdout) {
        console.log(stdout)
      }
      if (stderr) {
        console.log(stderr)
      }
      
      exec('/opt/' + proejctName + '/' + proejctName, (error, stdout, stderr) => {
        if (error) {
          console.log(error)
        }
        if (stdout) {
          console.log(stdout)
        }
        if (stderr) {
          console.log(stderr)
        }
      })
    })
  }
}