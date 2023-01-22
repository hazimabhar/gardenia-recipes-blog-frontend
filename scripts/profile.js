/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("sidenav").style.width = "65vw";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("sidenav").style.width = "0";
}

if (window.localStorage.getItem("role") == "admin") {
    document.querySelector("section.sidenav").innerHTML = `
    <div class="username-section open-border-bottom-right">
        <div class="username">
            <i class="fa-solid fa-circle-user"></i>
            <p class="username-title">Username</p>
        </div>
        <br /><br />
    </div>
    <div class="sidenav-link-container">
        <a href="profile.html" class="sidenav-link active"
            ><i class="fa-solid fa-user"></i>&nbsp;&nbsp;Profile</a
        >
    </div>
    <div class="sidenav-link-container open-border-top-right">
        <a href="manage-recipe.html" class="sidenav-link "
            ><i class="fa-solid fa-utensils"></i>&nbsp;&nbsp;Manage
            Recipes</a
        >
    </div>
    <div class="sidenav-link-container ">
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

if (!window.localStorage.getItem("userId")) {
    window.location.href = "login.html";
} else {
    document.querySelector("#authSection").innerHTML = `
    <a href="profile.html" class="login">${window.localStorage.getItem(
        "username"
    )}</a>
    `;
    document.querySelector(".username-title").textContent =
        window.localStorage.getItem("username");
    document.querySelector(".profile-username").textContent =
        "@" + window.localStorage.getItem("username");
    document.querySelector("#profile-detail-subtitle-username").textContent =
        "@" + window.localStorage.getItem("username");

    document.querySelector(".profile-fullname").textContent =
        window.localStorage.getItem("fullName");
    document.querySelector("#profile-detail-subtitle-fullname").textContent =
        window.localStorage.getItem("fullName");

    document.querySelector("#profile-detail-subtitle-email").textContent =
        window.localStorage.getItem("email");

    document.querySelector("#fullName").value =
        window.localStorage.getItem("fullName");
    document.querySelector("#email").value =
        window.localStorage.getItem("email");
    document.querySelector("#username").value =
        window.localStorage.getItem("username");

    updatePostsAndLikes();
}

async function updatePostsAndLikes() {
    const resRecipe = await fetch(
        `https://localhost:7296/api/recipes/userId/${window.localStorage.getItem(
            "userId"
        )}`,
        { mode: "cors" }
    );

    const recipes = await resRecipe.json();

    const resRating = await fetch(
        `https://localhost:7296/api/ratings/userId/${window.localStorage.getItem(
            "userId"
        )}/recipe/info`,
        {
            mode: "cors",
        }
    );

    const rating = await resRating.json();
    const { average, count } = rating;
    console.log(recipes, rating);

    document.querySelector(".likes-detail-total").textContent = average.toFixed(1);
    document.querySelector(".posts-detail-total").textContent = recipes.length;
}

const modal = document.querySelector("#modal-edit-profile");

function openModal() {
    modal.showModal();
}

function closeModal() {
    modal.close();
}

async function editProfileInfo() {
    const theUsername = window.localStorage.getItem("username");

    const resUser = await fetch(
        `https://localhost:7296/api/users/username/${theUsername}`,
        { mode: "cors" }
    );

    const user = await resUser.json();

    const fullName = document.querySelector("#fullName").value;
    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;

    const theUser = {
        id: window.localStorage.getItem("userId"),
        fullName,
        email,
        username,
        password: user[0].password,
        role: window.localStorage.getItem("role"),
    };

    await fetch(`https://localhost:7296/api/users/id/${theUser.id}`, {
        method: "PATCH",
        body: JSON.stringify(theUser),
        headers: { "Content-Type": "application/json" },
        mode: "cors",
    });

    window.localStorage.setItem("userId", theUser.id);
    window.localStorage.setItem("fullName", theUser.fullName);
    window.localStorage.setItem("username", theUser.username);
    window.localStorage.setItem("email", theUser.email);
    window.localStorage.setItem("role", theUser.role);

    alert("Successfully updated the user profile info");

    window.location.href = "profile.html";
}

async function editPassword() {
    const theUsername = window.localStorage.getItem("username");

    const resUser = await fetch(
        `https://localhost:7296/api/users/username/${theUsername}`,
        { mode: "cors" }
    );

    const user = await resUser.json();

    const currentPassword = document.querySelector("#currentPassword").value;
    const newPassword = document.querySelector("#newPassword").value;
    const confirmPassword = document.querySelector("#confirmPassword").value;

    if (currentPassword !== user[0].password) {
        document.querySelector(".error-msg").textContent =
            "Current password not match";
        return;
    }

    if (newPassword !== confirmPassword) {
        document.querySelector(".error-msg").textContent =
            "Confirm password not match to new password";
        return;
    }

    const theUser = {
        id: window.localStorage.getItem("userId"),
        fullName: window.localStorage.getItem("fullName"),
        email: window.localStorage.getItem("email"),
        username: window.localStorage.getItem("username"),
        password: newPassword,
        role: window.localStorage.getItem("role"),
    };

    await fetch(`https://localhost:7296/api/users/id/${theUser.id}`, {
        method: "PATCH",
        body: JSON.stringify(theUser),
        headers: { "Content-Type": "application/json" },
        mode: "cors",
    });

    window.localStorage.setItem("userId", theUser.id);
    window.localStorage.setItem("fullName", theUser.fullName);
    window.localStorage.setItem("username", theUser.username);
    window.localStorage.setItem("email", theUser.email);
    window.localStorage.setItem("role", theUser.role);

    alert("Successfully update the new password");

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
