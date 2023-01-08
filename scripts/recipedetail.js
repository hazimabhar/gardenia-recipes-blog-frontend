if (window.localStorage.getItem("isRate766d1e09-5ac5-48ea-8535-7b28e4ba9762")) {
    document.querySelector(
        ".feedback"
    ).innerHTML = `<p class="feedbackheadline">You have successfully rated this recipe.</p>`;
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

    document.querySelector(
        ".feedback"
    ).innerHTML = `<p class="feedbackheadline">You have successfully rated this recipe.</p>`;
}
