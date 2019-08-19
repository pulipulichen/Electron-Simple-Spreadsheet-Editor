const SavReader = require('sav-reader')

let SavHelper = {
  read: function (filepath, callback) {
    (async () => {
      //console.log(filepath)
      let sav = new SavReader(filepath)

      // this opens the file and loads all metadata (but not the records a.k.a. cases)
      await sav.open()

      // print the header, which contains number of cases, encoding, etc.
      console.log(sav.meta.header)
      let encoding = sav.meta.header.encoding

      // print the vars
      sav.meta.sysvars.map(v => {

        // print the var, type, label and missing values specifications
        console.log(v)

        let name = v.name
        name = iconv.decode(name, 'Big5')
        console.log(name)

        // find and print value labels for this var if any
        let valueLabels = sav.meta.getValueLabels(v.name)
        if (valueLabels){
          console.log(valueLabels)
        }

      })

      // row iteration (only one row is used at a time)
      let row = null;
      do{
          row = await sav.readNextRow();
          if( row !== null ){
            console.log(row)
          }
      } while( row !== null );

      if (typeof(callback) === 'function') {
        callback()
      }
    })()
  }
}
window.SavHelper = SavHelper