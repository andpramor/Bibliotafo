let inputsOneWritesOn = document.querySelectorAll('input[type="text"],input[type="password"],input[type="number"],input[type="email"],input[type="url"],input[type="file"')
let everySelectInput = document.querySelectorAll('select')

for (let elem of inputsOneWritesOn) {
  elem.classList.add("form-control")
}
for (let elem of everySelectInput) {
    elem.classList.add("form-select")
}