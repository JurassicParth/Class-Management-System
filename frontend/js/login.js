// js/login.js
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // Stop page from reloading automatically

    const usernameField = document.getElementById('username').value.trim();
    const passwordField = document.getElementById('password').value;

    // Reset standard styles and provide a processing hint
    errorMessage.textContent = "Checking credentials with backend...";
    errorMessage.style.color = "#2563eb";

    // 1. DETERMINE THE ROLE INTERNALLY TO SIMULATE THE FRONTEND NAVIGATION SWAP
    let targetRole = "student";
    if (usernameField.toLowerCase() === "admin") {
        targetRole = "admin";
    } else if (usernameField.toLowerCase().startsWith("t_")) {
        targetRole = "teacher";
    }

    try {
        // 2. DISPATCH A FETCH POLLING POST COMMAND TO FLASK SERVER
        const response = await fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameField,
                password: passwordField
            })
        });

        const resultData = await response.json();

        // 3. IF FLASK THROWS A NOT-OK RESPONSE STATUS
        if (!response.ok) {
            throw new Error(resultData.error || "Login verification failed.");
        }

        // 4. IF LOGIN IS SUCCESSFUL
        // Save the correct verified role string inside browser memory for main.js to pick up
        localStorage.setItem('currentUserRole', targetRole);

        errorMessage.style.color = "#10b981";
        errorMessage.textContent = "Authentication complete! Entering system dashboard...";

        // Redirect to dashboard layout after a short 1 second delay
        setTimeout(function() {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (err) {
        // Handle runtime connection errors or invalid inputs
        errorMessage.style.color = "#ef4444";
        errorMessage.textContent = err.message;
    }
});
