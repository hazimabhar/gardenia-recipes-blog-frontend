const modal = document.querySelector(".modal-addnew-recipe");
const openModal = document.querySelector(".recipe-add-new");
const cancelModal = document.querySelector(".modal-cancel-btn");
const closeModal = document.querySelector(".modal-close-btn");

openModal.addEventListener("click", () => {
    modal.showModal();
})

closeModal.addEventListener("click", () => {
    modal.close();
})

cancelModal.addEventListener("click", () => {
    modal.close();
})