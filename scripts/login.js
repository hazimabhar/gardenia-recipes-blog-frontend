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
    const password = document.querySelector("input#password").value;

    const resUser = await fetch(
        `http://localhost:3000/users?username=${username}&password=${password}`
    );

    const user = await resUser.json();

    if (user.length === 0) {
        return;
    } else {
        window.localStorage.setItem("userId", user[0].id);
        window.localStorage.setItem("fullName", user[0].fullName);
        window.localStorage.setItem("username", user[0].username);
        window.localStorage.setItem("email", user[0].email);
        window.localStorage.setItem("role", user[0].role);
        window.location.href = "profile.html";
    }
})
