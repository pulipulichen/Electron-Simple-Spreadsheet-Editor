let ViewInitConfig = {
  el: '#toolbarContainer',
  data: {
    fixColumns: 3,
    _enablePersist: true,
    persistAttrs: ['fixColumns']
  },
  mounted: function () {
    this._afterMounted()
  },
  methods: {
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
  }
}

new Vue(ViewInitConfig)

$(() => {
  //ViewInit.initDropdown()
})

