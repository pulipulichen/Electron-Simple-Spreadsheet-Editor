//console.log('@TODO OK')
const exec = require('child_process').exec
const path = require('path')
const DateHelper = require('./app/helpers/DateHelper.js').default
const fs = require('fs')
const os = require('os')
const getLastLine = require('./build-scripts/fileTools.js').getLastLine
const getSize = require('get-folder-size')

const pjson = require('./package.json')
//console.log(pjson.name);

let proejctName = pjson.name

let OpenDist = {
  start: function () {
    this.removePackageDir(() => {
      this.wrtieLog()
    })
  },
  removePackageDir: function (callback) {

    // ------------------------------
    // 先把檔案換位置
    /**
     * Remove directory recursively
     * @param {string} dir_path
     * @see https://stackoverflow.com/a/42505874/3027390
     */
    var deleteFolderRecursive = function(path) {
      if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
          var curPath = path + "/" + file;
          if (fs.lstatSync(curPath).isDirectory()) { // recurse
            deleteFolderRecursive(curPath);
          } else { // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(path);
      }
    };

    if (process.platform === 'win32') {
      let pathDistWinUnpacked = path.join(__dirname, 'dist', 'win-unpacked')
      //console.log(pathDistWinUnpacked)
      let pathDistTarget = path.join(__dirname, 'dist', proejctName)
      //console.log(pathDistTarget)
      deleteFolderRecursive(pathDistTarget)

      setTimeout(() => {
        if (fs.existsSync(pathDistWinUnpacked)) {
          fs.rename(pathDistWinUnpacked, pathDistTarget, callback)
        }
      }, 3000)
        
    }
  },
  wrtieLog: function () {
    
    // ------------------------------
    // 記錄檔案大小 
    let distPath
    let distDirPath = path.join('dist', proejctName)
    if (process.platform === 'win32') {
      distPath = path.join(__dirname, 'dist', proejctName, proejctName + '.exe')
    }
    else if (process.platform === 'linux') {
      distPath = path.join('dist', proejctName + '_1.0.0_amd64.deb')
    }
    let logPath = path.join(__dirname, 'dist/log.txt')
    let timeString = DateHelper.getCurrentTimeString()
    let sizeInterval = 0
    getSize(distDirPath, (err, size) => {
      //let size = fs.statSync(distPath).size
      
      readLog(size)

      if (process.platform === 'win32') {

        //console.log(distPath)
        exec(distPath, () => {})
      }
      else if (process.platform === 'linux') {
        this.execLinux()
      }
    })
    
    // 先讀取最後一行
    let readLog = (size) => {
      if (fs.existsSync(logPath) === false) {
        writeLog()
        return
      }

      getLastLine(logPath, 1)
            .then((lastLine) => {
              //console.log(lastLine)
              if (lastLine.lastIndexOf('\t') > 0) {
                let lastSize = lastLine.slice(lastLine.indexOf('\t') + 1, lastLine.lastIndexOf('\t')).trim()
                lastSize = parseInt(lastSize, 10)
                sizeInterval = size - lastSize
              }

              writeLog(size, sizeInterval)
            })
            .catch((err) => {
              console.error(err)
            })
    }

    let writeLog = (size, sizeInterval) => {
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
        //console.log(logPath)
        fs.appendFile(logPath, line, function (err) {
          if (err) throw err;
          console.log(line)
          //console.log('log saved!');
        });
      }
    }

    
  },
  execLinux: function () {
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
}

OpenDist.start()