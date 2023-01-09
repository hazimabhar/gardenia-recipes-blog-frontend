if (window.localStorage.getItem("userId")) {
    document.querySelector("#authSection").innerHTML = `
    <a href="profile.html" class="login">${window.localStorage.getItem(
        "username"
    )}</a>
    `;
}

const recipeId = new URLSearchParams(window.location.search).get("recipeId");
const containerTopContent = document.querySelector(".topcontent");
const containerBotContent = document.querySelector(".botcontent");
const containerFeedback = document.querySelector(".feedback");
let ingredients = "";
let cookInstruct = "";
let recipeName = "";
let gardeniaProduct = "";
let description = "";

if (window.localStorage.getItem("isRate" + recipeId)) {
    containerFeedback.innerHTML = `<p class="feedbackheadline">You have successfully rated this recipe.</p>`;
}

async function submitFeedback(recipeId) {
    const id = self.crypto.randomUUID();
    const star = document.querySelector("input[name='rating']:checked").value;

    if (!star) {
        return;
    }

    const newRating = {
        id,
        star,
        recipeId,
    };

    await fetch("http://localhost:3000/ratings", {
        method: "POST",
        body: JSON.stringify(newRating),
        headers: { "Content-Type": "application/json" },
    });

    window.localStorage.setItem(`isRate${recipeId}`, "true");

    containerFeedback.innerHTML = `<p class="feedbackheadline">You have successfully rated this recipe.</p>`;
}

const renderDetails = async () => {
    const resRecipe = await fetch(
        `http://localhost:3000/recipes?id=${recipeId}`
    );

    const recipe = await resRecipe.json();
    console.log(recipe);

    const resUser = await fetch(
        `http://localhost:3000/users?id=${recipe[0].userId}`
    );

    const user = await resUser.json();

    const resRating = await fetch(
        `http://localhost:3000/ratings?recipeId=${recipeId}`
    );

    const ratings = await resRating.json();

    let allRating = 0;
    let countRating = 0;

    ratings.forEach((rating) => {
        countRating += 1;
        allRating += rating.star;
    });

    let averageRating = allRating / countRating;
    averageRating = averageRating.toFixed(1);

    let templateTopContent = `
    <div class="imgcontainer">
        <img
            class="recipeimg"
            src="${recipe[0].recipeImg}"
            alt=""
        />
    </div>
    <div class="recipedetail">
        <h3>${recipe[0].recipeName}</h3>
        <span class="menu-of-the-day"
            >Menu of The Day! <i class="fa-solid fa-thumbs-up"></i
        ></span>
        <div class="menu-estimated-budget">
            <span>
                <div class="dollarsign">
                    <i class="fa-sharp fa-solid fa-dollar-sign"></i
                    ><i
                        class="fa-sharp fa-solid fa-dollar-sign"
                    ></i>
                </div>
                Estimated Budget:
                <span class="menu-price"> RM ${recipe[0].estimatedBudget} </span>
            </span>
        </div>
        <span class="recipe-by"
            ><i class="fa-solid fa-user"></i>Recipe By:</span
        ><span class="chef-name">${user[0].fullName}</span>
        <div class="upload-rating">
            <span class="date"
                ><i class="fa-solid fa-clock"></i>Uploded On:</span
            ><span class="date">${recipe[0].createdDate}</span>
            <span class="rating"
                ><i class="fa-solid fa-star"></i>${averageRating} (${countRating})</span
            >
        </div>
    </div>
    `;

    let templateBotContent = `
    <script>
    
    </script>
    <div class="threebutton">
        <p><button class="ingredient" onclick="descIngredients()">Ingredients</button></p>
        <p>
            <button class="instruction" onclick="descCookInstruct()">Cooking Instruction</button>
        </p>
        <p><button class="detail" onclick="descRecipeDetails()">Recipe Details</button></p>
    </div>
    <div class="ingredient-instruction-detail" style="white-space: pre-line;transition: 0.5s;">
        ${recipe[0].ingredients}
    </div>
    `;

    ingredients = recipe[0].ingredients;
    cookInstruct = recipe[0].cookInstruct;
    recipeName = recipe[0].recipeName;
    gardeniaProduct = recipe[0].gardeniaProduct;
    description = recipe[0].description;

    let templateBtnSubmitFeedback = `
    <button class="submitfeedback" onclick="submitFeedback('${recipe[0].id}')">Submit</button>
    `;

    containerTopContent.innerHTML = templateTopContent;
    containerBotContent.innerHTML = templateBotContent;

    if (!window.localStorage.getItem("isRate" + recipeId)) {
        containerFeedback.innerHTML += templateBtnSubmitFeedback;
    }
};

window.addEventListener("DOMContentLoaded", () => renderDetails());

function descIngredients() {
    const containerDetail = document.querySelector(
        ".ingredient-instruction-detail"
    );
    containerDetail.innerHTML = "Ingredients\n" + ingredients;
}

function descCookInstruct() {
    const containerDetail = document.querySelector(
        ".ingredient-instruction-detail"
    );
    containerDetail.innerHTML = "Cooking Instructions\n" + cookInstruct;
}

function descRecipeDetails() {
    const containerDetail = document.querySelector(
        ".ingredient-instruction-detail"
    );
    containerDetail.innerHTML =
        "<div><strong>Recipe Name:</strong> " +
        recipeName +
        "</div>" +
        "<div><strong>Gardenia Product:</strong> " +
        gardeniaProduct +
        "</div>" +
        "<div><strong>Description:</strong> " +
        description;
    ("</div>");
}
