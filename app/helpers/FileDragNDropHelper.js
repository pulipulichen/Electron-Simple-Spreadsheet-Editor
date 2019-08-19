let FileDragNDropHelper = {
  getFiles: function (message, callback) {
    this.init(message,(e) => {
      callback(this.getFilesFromEvent(e))
    })
  },
  getFilePaths: function (message, callback) {
    this.init(message,(e) => {
      callback(this.getFilePathsFromEvent(e))
    })
  },
  init: function (message, callback) {
    let dragoverClassname = 'dragover'
    
    //let doc = $('body')
    let doc = $(document)
    let body = $('body')
    
    //let timer = null
    
    doc.on('dragenter', (e) => {
      e.preventDefault()
      e.stopPropagation()
      body.addClass(dragoverClassname)
      //console.log('body dragenter')
    })
    
    doc.on('dragover', (e) => {
      e.preventDefault()
      e.stopPropagation()
    })
    
    doc.on('drop', (e) => {
      //body.addClass(dragoverClassname)
      //console.log('body dragenter')
      e.preventDefault()
      e.stopPropagation()
      body.removeClass(dragoverClassname)
      if (typeof(callback) === 'function') {
        callback(e)
      }
      return false
    })
    /*
    doc.on('dragover', () => {
      if (timer !== null) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        body.removeClass(dragoverClassname)
        timer = null
        console.log('body dragleave')
      }, 1000)
    })
    */
    doc.on('dragleave', (e) => {
      //console.log(e)
      //console.log([e.clientX, e.clientY])
      if (e.clientX === 0 || e.clientY === 0) {
        body.removeClass(dragoverClassname)
        //console.log('body dragleave')
      }
    })
    
    $(`<div class="drag-n-drop-layer">
      ${message}
    </div>`).appendTo('body')
  },
  getFilesFromEvent: function (event) {
    let files
    //console.log(event)
    if (typeof(event) === 'object' 
            && typeof(event.originalEvent) === 'object'
            && typeof(event.originalEvent.dataTransfer) === 'object'
            && typeof(event.originalEvent.dataTransfer.files) !== 'undefined') {
      files = event.originalEvent.dataTransfer.files
    }
    if (files.length === 0 
            && typeof(event) === 'object' 
            && typeof(event.originalEvent) === 'object'
            && typeof(event.originalEvent.dataTransfer) === 'object'
            && typeof(event.originalEvent.dataTransfer.getData) !== 'undefined') {
      files = event.originalEvent.dataTransfer.getData('Text')
      console.log(files)
    }
    return files
  },
  getFilePathsFromEvent: function (event) {
    let items
    //console.log(event)
    if (typeof(event) === 'object' 
            && typeof(event.originalEvent) === 'object'
            && typeof(event.originalEvent.dataTransfer) === 'object'
            && typeof(event.originalEvent.dataTransfer.items) !== 'undefined') {
      items = event.originalEvent.dataTransfer.items;
    }
    let filepaths = []
    for (var i = 0; i < items.length; i++) {
        // Get the dropped item as a 'webkit entry'.
        var entry = items[i].webkitGetAsEntry();

        // Get the same dropped item, but as a File.
        var file = items[i].getAsFile();
        if (typeof(file.path) === 'string') {
          filepaths.push(file.path)
        }

        //if (entry.isDirectory) 
        //{
        //    alert(file.path);
        //}
    }
    return filepaths
  }
}

window.FileDragNDropHelper = FileDragNDropHelper