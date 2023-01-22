/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("sidenav").style.width = "65vw";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("sidenav").style.width = "0";
}

document.querySelector("form.login-input-field").addEventListener("submit", async (e) => {
    e.preventDefault();

    // get username and password
    const username = document.querySelector("input#username").value;
    const passwordInput = document.querySelector("input#password").value;

    const resUser = await fetch(
        `https://localhost:7296/api/users/username/${username}`,
        { mode: "cors" }
    );

    const user = await resUser.json();

    if (user.length === 0) {
        alert("Username does not exists")
    }

    let passwordFromBackend = user[0].password;
    // Destructure salt and hashed password from database
    const [salt, hashed] = passwordFromBackend.split(":");

    // Convert the hashed password from database to hex
    const encodedPassword = new TextEncoder().encode(
        passwordInput + salt.toString()
    );
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedPassword);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    // Matching the hashed password from login and from database
    if (hashed !== hashHex) {
        alert("Wrong password");
        return;
    }

    window.localStorage.setItem("userId", user[0].id);
    window.localStorage.setItem("fullName", user[0].fullName);
    window.localStorage.setItem("username", user[0].username);
    window.localStorage.setItem("email", user[0].email);
    window.localStorage.setItem("role", user[0].role);
    window.location.href = "profile.html";
})
