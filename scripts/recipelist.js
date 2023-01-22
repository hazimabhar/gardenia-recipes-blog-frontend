if (window.localStorage.getItem("userId")) {
    document.querySelector("#authSection").innerHTML = `
    <a href="profile.html" class="login">${window.localStorage.getItem(
        "username"
    )}</a>
    `;
}

const category = new URLSearchParams(window.location.search).get("category");
document.querySelector("ul.breadcrumb").innerHTML = `
    <li class="home"><a href="index.html">Home</a></li>
    <li class="current"><a href="recipelist.html?category=${category}">${category}</a></li>
    `;

const renderDetails = async () => {

    const resRecipes = await fetch(
        `https://localhost:7296/api/recipes/category/${category}`,
        {
            mode: "cors",
        }
    );

    const recipes = await resRecipes.json();

    const shuffledRecipes = recipes[Math.floor(Math.random() * recipes.length)];

    const resRating = await fetch(
        `https://localhost:7296/api/ratings/recipeId/${shuffledRecipes.id}/info`,
        {
            mode: "cors",
        }
    );

    const ratingInfo = await resRating.json();
    const { count, average } = ratingInfo;

    const resUser = await fetch(
        `https://localhost:7296/api/recipes/id/${shuffledRecipes.id}/user`,
        { mode: "cors" }
    );

    const userInfo = await resUser.json();

    let templateMenuOfTheDay = `
    <img
        class="breakfastspotlight"
        src="${shuffledRecipes.recipeImg}"
        alt=""
    />
    <div class="title-menuoftheday-rating">
        <a href="recipedetail.html?recipeId=${shuffledRecipes.id}">
            <table class="info-top">
                <tr>
                    <td class="first-info">
                        ${shuffledRecipes.recipeName}
                    </td>
                </tr>
                <tr>
                    <td class="second-info">
                        <span class="menu-of-the-day"
                            >Menu of The Day!
                            <i
                                class="fa-solid fa-thumbs-up"
                            ></i
                        ></span>
                    </td>
                </tr>
                <tr>
                    <td class="third-info">
                        <span class="rating"
                            ><i class="fa-solid fa-star"></i
                            >${average} (${count})</span
                        >
                    </td>
                </tr>
            </table>
            <table class="info-bot">
                <tr>
                    <td>
                        <span
                            class="spotlight-estimated-budget"
                        >
                            <div class="dollarsign">
                                <i
                                    class="fa-sharp fa-solid fa-dollar-sign"
                                ></i
                                ><i
                                    class="fa-sharp fa-solid fa-dollar-sign"
                                ></i>
                            </div>
                            Estimated Budget:
                        </span>
                        <span class="spotlight-price">
                            RM ${shuffledRecipes.estimatedBudget}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span class="spotlight-recipe-by"
                            ><i class="fa-solid fa-user"></i
                            >Recipe By:</span
                        ><span class="date">
                            ${userInfo[0].fullName}</span
                        >
                    </td>
                </tr>
                <tr>
                    <td>
                        <span class="spotlight-date"
                            ><i
                                class="fa-solid fa-clock"
                            ></i
                            >Uploded On:</span
                        ><span class="date">
                            ${shuffledRecipes.createdDate}</span
                        >
                    </td>
                </tr>
            </table>
        </a>
    </div>
    `;

    recipes.forEach(async (recipe) => {
        if (recipe.isVerified) {

            const resRating = await fetch(
                `https://localhost:7296/api/ratings/recipeId/${recipe.id}/info`,
                {
                    mode: "cors",
                }
            );

            const ratingInfo = await resRating.json();
            const { count, average } = ratingInfo;

            const resUser = await fetch(
                `https://localhost:7296/api/recipes/id/${shuffledRecipes.id}/user`,
                { mode: "cors" }
            );

            const userInfo = await resUser.json();

            document.querySelector("div.othermenu").innerHTML += `
            <div class="menugrid">
                <a href="recipedetail.html?recipeId=${recipe.id}">
                    <img
                        class="menuimg"
                        src="${recipe.recipeImg}"
                        alt=""
                    />
                    <span class="menu-title">${recipe.recipeName}</span>
                    <span class="menu-rating"
                        ><i class="fa-solid fa-star"></i>${average}
                        (${count})</span
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
                    ><span class="chef-name"> ${userInfo[0].fullName}</span>
                </a>
            </div>
            `;
        }
    });

    document.querySelector("div.menuoftheday").innerHTML = templateMenuOfTheDay;

    document.querySelector("form.search-form").innerHTML = `
    <input
        class="search"
        type="text"
        name="q"
        placeholder="Search recipes and more..."
        value=""
    />
    <input type="hidden" name="category" value="${category}" />
    <button class="search-icon"
        ><i class="fa-solid fa-magnifying-glass"></i
    ></button>
    `;
};

const renderForSearch = async (query) => {

    let templateMenuGrid = "";

    recipes.forEach(async (recipe) => {
        if (recipe.isVerified) {

            const resRating = await fetch(
                `https://localhost:7296/api/ratings/recipeId/${shuffledRecipes.id}/info`,
                {
                    mode: "cors",
                }
            );

            const ratingInfo = await resRating.json();
            const { count, average } = ratingInfo;

            const resUser = await fetch(
                `https://localhost:7296/api/recipes/id/${shuffledRecipes.id}/user`,
                { mode: "cors" }
            );

            const userInfo = await resUser.json();

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
                        ><i class="fa-solid fa-star"></i>${average}
                        (${count})</span
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
                    ><span class="chef-name"> ${userInfo[0].fullName}</span>
                </a>
            </div>
            `;
        }
    });

    document.querySelector("div.othermenu").innerHTML = templateMenuGrid;

    document.querySelector("div.menuoftheday").innerHTML = "";

    document.querySelector("form.search-form").innerHTML = `
    <input
        class="search"
        type="text"
        name="q"
        placeholder="Search recipes and more..."
        value="${query}"
    />
    <input type="hidden" name="category" value="${category}" />
    <button class="search-icon"
        ><i class="fa-solid fa-magnifying-glass"></i
    ></button>
    `;
};

const query = new URLSearchParams(window.location.search).get("q");
window.addEventListener("DOMContentLoaded", () => {
    if (query) {
        renderForSearch(query);
    } else {
        renderDetails();
    }
});
