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

    // Generate a salt, random bytes that will mix with hashed password
    const randomuuid =
        self.crypto.randomUUID() + "-" + self.crypto.randomUUID();
    const arrrandomuuid = randomuuid.split("-");
    const salt = arrrandomuuid.reduce(function (x, y) {
        return x + y;
    }, 0);

    // Hash the password, and mix it with the salt
    const encodedPassword = new TextEncoder().encode(
        password + salt.toString()
    );
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedPassword);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    const storedPassword = `${salt}:${hashHex}`;

    const newUser = {
        fullName,
        email,
        username,
        password: storedPassword, // Store the password with the original salt and hashed password
        role,
    };

    await fetch("https://localhost:7296/api/users", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: { "Content-Type": "application/json" },
        mode: "cors",
    });

    document.querySelector("#signupForm").style.cursor = "default";

    window.localStorage.setItem("userId", id);
    window.localStorage.setItem("fullName", fullName);
    window.localStorage.setItem("email", email);
    window.localStorage.setItem("username", username);
    window.localStorage.setItem("role", role);

    window.location.href = "profile.html";
});
