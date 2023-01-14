if (!window.localStorage.getItem("userId")) {
    window.location.href = "login.html";
} else {
    document.querySelector("#authSection").innerHTML = `
    <a href="profile.html" class="login">${window.localStorage.getItem(
        "username"
    )}</a>
    `;
}

if (window.localStorage.getItem("role") !== "admin") {
    window.location.href = "profile.html";
}

function logout() {
    window.localStorage.removeItem("userId", "");
    window.localStorage.removeItem("fullName", "");
    window.localStorage.removeItem("email", "");
    window.localStorage.removeItem("username", "");
    window.localStorage.removeItem("role", "");

    window.location.href = "login.html";
}

const renderDetails = async () => {
    const verifyAllPostsContainer = document.querySelector(".verify-all-posts");

    const resRecipe = await fetch(
        `https://localhost:7296/api/recipes/isVerified/false`,
        { mode: "cors" }
    );

    const recipes = await resRecipe.json();

    if (recipes.length === 0) {
        verifyAllPostsContainer.innerHTML = `
        <h4>All posts successfully verified</h4>
        `;
        return;
    }

    recipes.forEach(async (recipe) => {

        const resUser = await fetch(
            `https://localhost:7296/api/recipes/id/${recipe.id}/user`,
            { mode: "cors" }
        );

        const theUser = await resUser.json();

        verifyAllPostsContainer.innerHTML += `
        <div class="verify-post-one">
            <div class="verify-post-info">
                <img
                    src="assets/user-profile-img.png"
                    alt="verify-userimg-post"
                    class="verify-userimg-post"
                />
                <div class="verify-detail-post">
                    <h3 class="verify-post-title">
                        ${recipe.recipeName}
                    </h3>
                    <p class="verify-username-post">
                        @${theUser[0].username}
                    </p>
                </div>
            </div>
            <div style="display: grid; align-items: center">
                <button class="verify-btn-post" id="verify-btn-post-${recipe.id}" onclick='openModal("${recipe.id}")'>Verify</button>
            </div>
        </div>
        <dialog class="modal-verify-recipe" id="modal-verify-recipe-${recipe.id}">
            <h2 class="verify-title">Manage Recipes</h2>
            <br />
            <div class="modal-info-div">
                <i class="fa-solid fa-user"></i>
                <p class="modal-info-desc">@${theUser[0].username}</p>
            </div>
            <br />
            <div class="modal-info-div">
                <i class="fa-solid fa-bread-slice"></i>
                <p class="modal-info-desc">${recipe.recipeName}</p>
            </div>
            <br />
            <div class="modal-info-div">
                <i class="fa-solid fa-seedling"></i>
                <p class="modal-info-desc">${recipe.gardeniaProduct}</p>
            </div>
            <br />
            <div class="modal-info-div">
                <i class="fa-solid fa-money-bill"></i>
                <p class="modal-info-desc">RM ${recipe.estimatedBudget}</p>
            </div>
            <br />
            <div class="modal-info-div">
                <i class="fa-solid fa-circle-info"></i>
                <p class="modal-info-desc">
                    ${recipe.description}
                </p>
            </div>
            <br />
            <div class="modal-info-div">
                <i class="fa-solid fa-cart-shopping"></i>
                <p class="modal-info-desc" style="white-space: pre-line;">
                    ${recipe.ingredients}
                </p>
            </div>
            <br />
            <div class="modal-info-div">
                <i class="fa-solid fa-book"></i>
                <p class="modal-info-desc" style="white-space: pre-line;">
                    ${recipe.cookInstruct}
                </p>
            </div>
            <br />
            <img src="${recipe.recipeImg}" style="height:auto;width:100%;" />
            <br />
            <br />
            <div class="modal-group-btn">
                <button class="modal-cancel-btn" id="modal-cancel-btn-${recipe.id}" onclick='closeModal("${recipe.id}")'>Cancel</button
                ><button class="modal-verify-btn" onclick='verifyRecipe("${recipe.id}")'>Verify Recipe</button>
            </div>
            <span class="modal-close-btn" id="modal-close-btn-${recipe.id}" onclick='closeModal("${recipe.id}")'>X</span>
        </dialog>
        `;
    });
};

window.addEventListener("DOMContentLoaded", () => renderDetails());

function openModal(recipeId) {
    document.querySelector(`#modal-verify-recipe-${recipeId}`).showModal();
}

function closeModal(recipeId) {
    document.querySelector(`#modal-verify-recipe-${recipeId}`).close();
}

async function verifyRecipe(recipeId) {

    const resRecipe = await fetch(
        `https://localhost:7296/api/recipes/id/${recipeId}`,
        { mode: "cors" }
    );

    const recipes = await resRecipe.json();

    const theRecipe = {
        id: recipeId,
        recipeName: recipes[0].recipeName,
        gardeniaProduct: recipes[0].gardeniaProduct,
        estimatedBudget: recipes[0].estimatedBudget,
        description: recipes[0].description,
        ingredients: recipes[0].ingredients,
        cookInstruct: recipes[0].cookInstruct,
        recipeImg: recipes[0].recipeImg,
        createdDate: recipes[0].createdDate,
        isVerified: true,
        category: recipes[0].category,
        userId: recipes[0].userId,
    };

    const res = await fetch(`https://localhost:7296/api/recipes/id/${recipeId}`, {
        method: "PATCH",
        body: JSON.stringify(theRecipe),
        headers: { "Content-Type": "application/json" },
        mode: "cors",
    });console.log(res);

    document.querySelector(`#modal-verify-recipe-${recipeId}`).close();

    alert("The recipe successfully verified");

    window.location.href = "verify-recipe.html";
}
