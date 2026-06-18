const loginForm =
    document.getElementById("loginForm");

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    const errorMessage =
        document.getElementById("errorMessage");

    if (
        username === "admin" &&
        password === "admin123"
    ) {

        localStorage.setItem(
            "loggedIn",
            "true"
        );

        window.location.href =
            "dashboard.html";

    } else {

        errorMessage.textContent =
            "Invalid Username or Password";

    }

});
