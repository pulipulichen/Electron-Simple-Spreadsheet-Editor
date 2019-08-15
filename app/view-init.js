let ViewInitConfig = {
  el: '#toolbarContainer',
  data: {
    fixColumns: 3,
    sheetName: "AAA",
    
    _enablePersist: true,
    persistAttrs: ['fixColumns']
  },
  mounted: function () {
    this._afterMounted()
  },
  watch: {
    fixColumns: function (fixColumns) {
      console.log(fixColumns)
    }
  },
  methods: {
    open: function () {
      console.log('TODO OPEN')
      this.showLoading()
    },
    save: function () {
      console.log('TODO save')
    },
    saveAs: function () {
      console.log('TODO save as')
    },
    
    _afterMounted: function () {
      this.initDropdown()
    },
    initDropdown: function () {
      $('.ui.dropdown')
        .dropdown({
          clearable: true,
          placeholder: 'any'
        })
    },
    getHot: function () {
      return document.getElementById("handsometableContainer").contentWindow.hot
    },
    getData: function () {
      let data = document.getElementById("handsometableContainer").contentWindow.getData()
      console.log(data)
    },
    persist: function () {
      //console.log([this._enablePersist, this._debugDemo])
      if (this._enablePersist && (this._debugDemo === false || this._debugDemo === undefined)) {
        ElectronHelper.persist(this, this.persistAttrs)
      }
    },
    showLoading: function () {
      $('body').dimmer('show')
    },
    hideLoading: function () {
      $('body').dimmer('hide')
    }
  }
}

new Vue(ViewInitConfig)

$(() => {
  //ViewInit.initDropdown()
})

