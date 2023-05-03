const modalSet = document.getElementById('modalSet')
modalSet.addEventListener('show.bs.modal', event => {
  // Button that triggered the modal
  const boton = event.relatedTarget
  // Extract info from data-bs-* attributes
  const numero = boton.getAttribute('data-bs-nset')
  // If necessary, you could initiate an AJAX request here
  // and then do the updating in a callback.
  //
  // Update the modal's content.
  const modalTitle = modalSet.querySelector('.modal-title')

  modalTitle.textContent = `Set Nº ${numero}`
})