const form = document.querySelector('#form')
const submitButton = document.querySelector('#submit')

submitButton.addEventListener('click', function onSubmitButtonClicked(event) {
  form.classList.add('was-validated')
})

form.addEventListener('submit', function onFormSubmit(event) {
  // for testing 
  // event.preventDefault()
  // event.stopPropagation()
  if (!form.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  }
})