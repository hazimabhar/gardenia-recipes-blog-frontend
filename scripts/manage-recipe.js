if (!window.localStorage.getItem("userId")) {
    window.location.href = "login.html";
} else {
    document.querySelector("#authSection").innerHTML = `
    <a href="profile.html" class="login">${window.localStorage.getItem(
        "username"
    )}</a>
    `;
}

if (window.localStorage.getItem("role") == "admin") {
    document.querySelector("section.sidenav").innerHTML = `
    <div class="username-section">
        <div class="username">
            <i class="fa-solid fa-circle-user"></i>
            <p class="username-title">Username</p>
        </div>
        <br /><br />
    </div>
    <div class="sidenav-link-container open-border-bottom-right">
        <a href="profile.html" class="sidenav-link"
            ><i class="fa-solid fa-user"></i>&nbsp;&nbsp;Profile</a
        >
    </div>
    <div class="sidenav-link-container">
        <a href="manage-recipe.html" class="sidenav-link active"
            ><i class="fa-solid fa-utensils"></i>&nbsp;&nbsp;Manage
            Recipes</a
        >
    </div>
    <div class="sidenav-link-container open-border-top-right">
        <a href="verify-recipe.html" class="sidenav-link"
            ><i class="fa-solid fa-utensils"></i>&nbsp;&nbsp;Verify
            Recipes</a
        >
    </div>
    <div class="sidenav-link-container ">
        <a href="#" class="sidenav-link"
            onclick="logout()"><i class="fa-solid fa-arrow-right-from-bracket"></i>&nbsp;&nbsp;Logout</a
        >
    </div>
    <div class="sidenav-overall"></div>
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

const pb = new PocketBase("http://127.0.0.1:8090");

const modal = document.querySelector("#modal-addnew-recipe");
const formModal = document.querySelector("#modal-addnew-recipe").innerHTML;
const openModal = document.querySelector(".recipe-add-new");
const cancelModal = document.querySelector(".modal-cancel-btn");
const closeModal = document.querySelector(".modal-close-btn");
const addRecipe = document.querySelector("#modal-add-btn");

const modalSuccess = document.querySelector("#modal-success");

openModal.addEventListener("click", () => {
    modal.showModal();
});

closeModal.addEventListener("click", () => {
    modal.close();
});

cancelModal.addEventListener("click", () => {
    modal.close();
});

addRecipe.addEventListener("click", async () => {
    // initialize all recipe data
    const id = self.crypto.randomUUID();
    const recipeName = document.querySelector("#recipeName").value;
    const gardeniaProduct = document.querySelector("#gardeniaProduct").value;
    const estimatedBudget = document.querySelector("#estimatedBudget").value;
    const description = document.querySelector("#description").value;
    const ingredients = document.querySelector("#ingredients").value;
    const cookInstruct = document.querySelector("#cookInstruct").value;
    const recipeImg = document.querySelector("#recipeImg").files[0];
    let formData = new FormData();
    formData.set("image", recipeImg);
    const createdDate = dayjs().format("DD MMMM YYYY");
    const userId = "55e3fca7-02f4-456a-acd7-d7851903a902";

    // upload image to get path
    const createdRecord = await pb.collection("recipeImage").create(formData);

    // create new recipe object
    const newRecipe = {
        id,
        recipeName,
        gardeniaProduct,
        estimatedBudget,
        description,
        ingredients,
        cookInstruct,
        imgPath:
            "http://127.0.0.1:8090/api/files/" +
            createdRecord.collectionId +
            "/" +
            createdRecord.id +
            "/" +
            createdRecord.image,
        createdDate,
        isVerified: false,
        userId,
    };

    modal.innerHTML = `<div class="modal-loading"></div>`;

    await fetch("http://localhost:3000/recipes", {
        method: "POST",
        body: JSON.stringify(newRecipe),
        headers: { "Content-Type": "application/json" },
    });

    modal.close();

    modal.innerHTML = formModal;

    modalSuccess.showModal();
});
