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
    const star = document.querySelector("input[name='rating']:checked").value;

    if (!star) {
        return;
    }

    const newRating = {
        star,
        recipeId,
    };

    await fetch("https://localhost:7296/api/ratings", {
        method: "POST",
        body: JSON.stringify(newRating),
        headers: { "Content-Type": "application/json" },
        mode: "cors",
    });

    window.localStorage.setItem(`isRate${recipeId}`, "true");

    alert("You have successfully rated this recipe.");

    window.location.href = "recipedetail.html";
}

const renderDetails = async () => {

    const resRecipe = await fetch(
        `https://localhost:7296/api/recipes/id/${recipeId}`,
        { mode: "cors" }
    );

    const recipe = await resRecipe.json();

    const resUser = await fetch(
        `https://localhost:7296/api/recipes/id/${recipeId}/user`,
        { mode: "cors" }
    );

    const user = await resUser.json();

    const resRating = await fetch(
        `https://localhost:7296/api/ratings/recipeId/${recipeId}/info`,
        {
            mode: "cors",
        }
    );

    const ratingInfo = await resRating.json();
    const { count, average } = ratingInfo;

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
                ><i class="fa-solid fa-star"></i>${average} (${count})</span
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

    document.querySelector("ul.breadcrumb").innerHTML = `
    <li class="home"><a href="index.html">Home</a></li>
    <li class="home"><a href="recipelist.html?category=${recipe[0].category}">${recipe[0].category}</a></li>
    <li class="current">${recipeName}</li>
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
