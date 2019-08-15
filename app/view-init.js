let ViewInit = {
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
  }
}

$(() => {
  ViewInit.initDropdown()
})

