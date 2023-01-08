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
        userId
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
