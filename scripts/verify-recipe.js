if (!window.localStorage.getItem("userId")) {
    window.location.href = "login.html";
} else {
    document.querySelector("#authSection").innerHTML = `
    <a href="profile.html" class="login">${window.localStorage.getItem(
        "username"
    )}</a>
    `;
}

function logout() {
    window.localStorage.removeItem("userId", "");
    window.localStorage.removeItem("fullName", "");
    window.localStorage.removeItem("email", "");
    window.localStorage.removeItem("username", "");
    window.localStorage.removeItem("role", "");

    window.location.href = "login.html";
}

const modal = document.querySelector(".modal-verify-recipe");
const openModal = document.querySelector(".verify-btn-post");
const cancelModal = document.querySelector(".modal-cancel-btn");
const closeModal = document.querySelector(".modal-close-btn");

openModal.addEventListener("click", () => {
    modal.showModal();
});

closeModal.addEventListener("click", () => {
    modal.close();
});

cancelModal.addEventListener("click", () => {
    modal.close();
});
