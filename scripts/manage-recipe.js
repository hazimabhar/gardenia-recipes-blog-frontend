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
            ><i class="fa-regular fa-circle-check"></i>&nbsp;&nbsp;Verify
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
const openModal = document.querySelector("#recipe-add-new");
const cancelModal = document.querySelector("#modal-cancel-btn");
const closeModal = document.querySelector("#modal-close-btn");
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
    const recipeName = document.querySelector("#recipeName").value;
    const gardeniaProduct = document.querySelector("#gardeniaProduct").value;
    const estimatedBudget = document.querySelector("#estimatedBudget").value;
    const description = document.querySelector("#description").value;
    const ingredients = document.querySelector("#ingredients").value;
    const cookInstruct = document.querySelector("#cookInstruct").value;
    const category = document.querySelector("#category").value;
    const recipeImg = document.querySelector("#recipeImg").files[0];
    let formData = new FormData();
    formData.set("image", recipeImg);
    const createdDate = dayjs().format("DD MMMM YYYY");
    const userId = window.localStorage.getItem("userId");

    // upload image to get path
    const createdRecord = await pb.collection("recipeImage").create(formData);

    // create new recipe object
    const newRecipe = {
        recipeName,
        gardeniaProduct,
        estimatedBudget,
        description,
        ingredients,
        cookInstruct,
        category,
        recipeImg:
            "http://127.0.0.1:8090/api/files/" +
            createdRecord.collectionId +
            "/" +
            createdRecord.id +
            "/" +
            createdRecord.image,
        createdDate,
        isVerified:
            window.localStorage.getItem("role") === "admin" ? true : false,
        userId,
    };

    modal.innerHTML = `<div class="modal-loading"></div>`;

    await fetch(`https://localhost:7296/api/recipes`, {
        method: "POST",
        body: JSON.stringify(newRecipe),
        headers: { "Content-Type": "application/json" },
        mode: "cors",
    });

    modal.close();

    modal.innerHTML = formModal;

    alert("Successfully added new recipe");

    window.location.href = "manage-recipe.html";
});

const renderDetails = async () => {
    // fetch api to get all recipe with userId
    const resRecipe = await fetch(
        `https://localhost:7296/api/recipes/userId/${window.localStorage.getItem(
            "userId"
        )}`,
        {
            mode: "cors",
        }
    );

    // convert using json func
    const recipes = await resRecipe.json();

    const latestContainer = document.querySelector("#latestContainer");
    const allContainer = document.querySelector("#allContainer");
    let templateLatest = ``;
    let templateAll = ``;

    if (recipes.length === 0) {
        latestContainer.innerHTML = `<h4>No latest recipe posted...</h4>`;
        allContainer.innerHTML = `<h4>No recipe posted...</h4>`;
        return;
    }

    if (recipes.length < 4) {
        recipes.forEach(recipe => {
            templateLatest += `
        <div class="recipe-one-post">
            <img
                src="${recipe.recipeImg}"
                alt="recipe-post-img"
                class="recipe-post-img"
            />
            <div class="recipe-post-detail">
                <h6 class="recipe-post-detail-title">
                    ${recipe.recipeName}
                </h6>
                <p class="recipe-post-price">
                    <i class="fa-solid fa-money-bill"></i
                    >&nbsp;&nbsp;RM ${
                        recipe.estimatedBudget
                    }
                </p>
                <p class="recipe-post-date-posted">
                    <i class="fa-solid fa-calendar-week"></i
                    >&nbsp;&nbsp;${recipe.createdDate}
                </p>
            </div>
        </div>
        `;
        });
    } else {
        // using for loop to display latest 4 recipes from last position of array
        for (let index = 1; index < 4; index++) {
            templateLatest += `
        <div class="recipe-one-post">
            <img
                src="${recipes[recipes.length - index].recipeImg}"
                alt="recipe-post-img"
                class="recipe-post-img"
            />
            <div class="recipe-post-detail">
                <h6 class="recipe-post-detail-title">
                    ${recipes[recipes.length - index].recipeName}
                </h6>
                <p class="recipe-post-price">
                    <i class="fa-solid fa-money-bill"></i
                    >&nbsp;&nbsp;RM ${
                        recipes[recipes.length - index].estimatedBudget
                    }
                </p>
                <p class="recipe-post-date-posted">
                    <i class="fa-solid fa-calendar-week"></i
                    >&nbsp;&nbsp;${recipes[recipes.length - index].createdDate}
                </p>
            </div>
        </div>
        `;
        }
    }

    // using foreach loop to diplay all recipes
    recipes.forEach((recipe) => {
        templateAll += `
        <div class="recipe-one-post">
            <img
                src="${recipe.recipeImg}"
                alt="recipe-post-img"
                class="recipe-post-img"
            />
            <div class="recipe-post-detail">
                <h6 class="recipe-post-detail-title">
                    ${recipe.recipeName}
                </h6>
                <p class="recipe-post-price">
                    <i class="fa-solid fa-money-bill"></i
                    >&nbsp;&nbsp;RM ${recipe.estimatedBudget}
                </p>
                <p class="recipe-post-date-posted">
                    <i class="fa-solid fa-calendar-week"></i
                    >&nbsp;&nbsp;${recipe.createdDate}
                </p>
                <div class="recipe-btn-group">
                    <button class="recipe-btn-edit" onclick="openEditModal('${
                        recipe.id
                    }')">
                        Edit
                    </button>
                    <button class="recipe-btn-delete" onclick="deleteRecipe('${
                        recipe.id
                    }')">
                        Delete
                    </button>
                </div>
            </div>
        </div>
        <dialog class="modal-addnew-recipe" id="modal-addnew-recipe-${
            recipe.id
        }">
            <h2 class="recipe-title">Manage Recipes</h2>
            <br />
            <label for="">Recipe Name</label>
            <input
                type="text"
                class="modal-input-block"
                placeholder="Enter your new recipe name"
                id="recipeName-${recipe.id}"
                value="${recipe.recipeName}"
            />
            <div class="modal-input-two">
                <div>
                    <label for="">Gardenia Product</label>
                    <select name="" id="gardeniaProduct-${recipe.id}">
                        <option value="">Choose Gardenia product used</option>
                        <option value="Gardenia Original Classic" ${
                            recipe.gardeniaProduct ===
                            "Gardenia Original Classic"
                                ? "selected"
                                : ""
                        }>
                            Gardenia Original Classic
                        </option>
                        <option value="Gardenia A.Rosie's Kaya" ${
                            recipe.gardeniaProduct === "Gardenia A.Rosie's Kaya"
                                ? "selected"
                                : ""
                        }>
                            Gardenia A.Rosie's Kaya
                        </option>
                        <option value="Gardenia Roll-Up Wraps" ${
                            recipe.gardeniaProduct === "Gardenia Roll-Up Wraps"
                                ? "selected"
                                : ""
                        }>
                            Gardenia Roll-Up Wraps
                        </option>
                        <option value="NuMee Gardenia" ${
                            recipe.gardeniaProduct === "NuMee Gardenia"
                                ? "selected"
                                : ""
                        }>NuMee Gardenia</option>
                    </select>
                </div>
                <div>
                    <label for="">Estimated Budget</label>
                    <input
                        type="number"
                        placeholder="Enter your estimated budget"
                        id="estimatedBudget-${recipe.id}"
                        value="${recipe.estimatedBudget}"
                    />
                </div>
            </div>
            <label for="">Description</label>
            <textarea
                name=""
                id="description-${recipe.id}"
                class="modal-input-block"
            >${recipe.description}</textarea>
            <div class="modal-input-two">
                <div>
                    <label for="">Ingredients</label>
                    <textarea
                        name=""
                        id="ingredients-${recipe.id}"
                        placeholder="1. Ingredient A&#10;2. Ingredient B&#10;3. Ingredient C&#10;..."
                    >${recipe.ingredients}</textarea>
                </div>
                <div>
                    <label for="">Cooking Instructions</label>
                    <textarea
                        name=""
                        id="cookInstruct-${recipe.id}"
                        placeholder="1. Step A&#10;2. Step B&#10;3. Step C&#10;..."
                    >${recipe.cookInstruct}</textarea>
                </div>
            </div>
            <label for="">Recipe Category</label>
            <select name="" id="category-${
                recipe.id
            }" class="modal-input-block">
                <option value="">Choose cateogry of recipe</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
            </select>
            <div class="modal-group-btn">
                <button class="modal-cancel-btn" id="modal-cancel-btn-${
                    recipe.id
                }" onclick="closeEditModal('${recipe.id}')">Cancel</button
                ><button class="modal-add-btn" id="modal-add-btn" onclick="submitEditRecipe('${
                    recipe.id
                }')">
                    Modify Recipe
                </button>
            </div>
            <span class="modal-close-btn" id="modal-close-btn-${
                recipe.id
            }" onclick="closeEditModal('${recipe.id}')">X</span>
        </dialog>
        `;
    });

    // change innerHTML of latest and all container
    latestContainer.innerHTML = templateLatest;
    allContainer.innerHTML = templateAll;
};

window.addEventListener("DOMContentLoaded", renderDetails());

function openEditModal(recipeId) {
    document.querySelector(`#modal-addnew-recipe-${recipeId}`).showModal();
}

function closeEditModal(recipeId) {
    document.querySelector(`#modal-addnew-recipe-${recipeId}`).close();
}

async function submitEditRecipe(recipeId) {
    const recipeName = document.querySelector(`#recipeName-${recipeId}`).value;
    const gardeniaProduct = document.querySelector(
        `#gardeniaProduct-${recipeId}`
    ).value;
    const estimatedBudget = document.querySelector(
        `#estimatedBudget-${recipeId}`
    ).value;
    const description = document.querySelector(
        `#description-${recipeId}`
    ).value;
    const ingredients = document.querySelector(
        `#ingredients-${recipeId}`
    ).value;
    const cookInstruct = document.querySelector(
        `#cookInstruct-${recipeId}`
    ).value;

    const category = document.querySelector(`#category-${recipeId}`).value;

    const resRecipe = await fetch(
        `https://localhost:7296/api/recipes/id/${recipeId}`,
        { mode: "cors" }
    );

    const recipes = await resRecipe.json();

    const theRecipe = {
        id: recipeId,
        recipeName,
        gardeniaProduct,
        estimatedBudget,
        description,
        ingredients,
        cookInstruct,
        category,
        recipeImg: recipes[0].recipeImg,
        createdDate: recipes[0].createdDate,
        isVerified: recipes[0].isVerified,
        userId: recipes[0].userId,
    };

    await fetch(`https://localhost:7296/api/recipes/id/${recipeId}`, {
        method: "PATCH",
        body: JSON.stringify(theRecipe),
        headers: { "Content-Type": "application/json" },
        mode: "cors",
    });

    alert(`Successfully updated the ${theRecipe.gardeniaProduct} recipe`);

    window.location.href = "manage-recipe.html";
}

async function deleteRecipe(recipeId) {

    await fetch(`https://localhost:7296/api/recipes/id/${recipeId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
    });

    alert("Successfully deleted the recipe");

    window.location.href = "manage-recipe.html";
}
