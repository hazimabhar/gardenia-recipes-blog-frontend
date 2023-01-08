/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("sidenav").style.width = "65vw";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("sidenav").style.width = "0";
}

document.querySelector("#signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = self.crypto.randomUUID();
    const fullName = document.querySelector("#fullName").value;
    const email = document.querySelector("#email").value;
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirmPassword").value;
    const role = "contributor";

    if (confirmPassword !== password) {
        document.querySelector(
            "#confirmPasswordDiv"
        ).innerHTML += `<small style="color: red;">Password does not match!</small>`;
        return;
    }

    const newUser = {
        id,
        fullName,
        email,
        username,
        password,
        role
    };

    document.querySelector("#signupForm").style.cursor = "wait";

    await fetch("http://localhost:3000/users", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: { "Content-Type": "application/json" },
    });

    document.querySelector("#signupForm").style.cursor = "default";

    window.localStorage.setItem("userId", id);

    window.location.href = "profile.html";

    console.log(newUser);
});
