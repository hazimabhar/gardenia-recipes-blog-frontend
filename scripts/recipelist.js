if (window.localStorage.getItem("userId")) {
    document.querySelector("#authSection").innerHTML = `
    <a href="profile.html" class="login">${window.localStorage.getItem(
        "username"
    )}</a>
    `;
}

const containerOtherMenu = document.querySelector("div.othermenu");

const renderDetails = async () => {
    const resRecipes = await fetch("http://localhost:3000/recipes", {
        method: "GET",
    });

    const recipes = await resRecipes.json();

    const resRating = await fetch(`http://localhost:3000/ratings`);

    const ratings = await resRating.json();

    const resUsers = await fetch(`http://localhost:3000/users`);

    const users = await resUsers.json();

    let templateMenuGrid = "";

    recipes.forEach((recipe) => {
        if (recipe.isVerified) {
            let allRating = 0;
            let countRating = 0;

            ratings.forEach((rating) => {
                if (rating.recipeId === recipe.id) {
                    countRating += 1;
                    allRating += rating.star;
                }
            });

            let averageRating = allRating / countRating;
            averageRating = averageRating.toFixed(1);

            let fullName = "";

            users.forEach((user) => {
                if (user.id === recipe.userId) {
                    fullName = user.fullName;
                    return;
                }
            });

            templateMenuGrid += `
            <div class="menugrid">
                <a href="recipedetail.html?recipeId=${recipe.id}">
                    <img
                        class="menuimg"
                        src="${recipe.recipeImg}"
                        alt=""
                    />
                    <span class="menu-title">${recipe.recipeName}</span>
                    <span class="menu-rating"
                        ><i class="fa-solid fa-star"></i>${averageRating}
                        (${countRating})</span
                    >
                    <div class="menu-estimated-budget">
                        <span>
                            <div class="dollarsign">
                                <i
                                    class="fa-sharp fa-solid fa-dollar-sign"
                                ></i
                                ><i
                                    class="fa-sharp fa-solid fa-dollar-sign"
                                ></i>
                            </div>
                            Estimated Budget:
                            <span class="menu-price">
                                RM ${recipe.estimatedBudget}
                            </span>
                        </span>
                    </div>
                    <span class="menu-recipe-by"
                        ><i class="fa-solid fa-user"></i>Recipe
                        By:</span
                    ><span class="chef-name"> ${fullName}</span>
                </a>
            </div>
            `;
        }
    });

    document.querySelector("div.othermenu").innerHTML = templateMenuGrid;

    console.log(templateMenuGrid);
};

window.addEventListener("DOMContentLoaded", () => renderDetails());
