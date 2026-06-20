// 1. SELECT THE FORM AND ERROR MESSAGE CONTAINER FROM THE HTML
const signupForm = document.getElementById('signupForm');
const errorMessage = document.getElementById('errorMessage');

// 2. LISTEN FOR THE SUBMIT EVENT ON THE FORM
signupForm.addEventListener('submit', function(e) {
    // Prevent the default behavior (stops the page from reloading automatically)
    e.preventDefault();

    // 3. GRAB THE VALUES ENTERED BY THE USER
    const fullName = document.getElementById('fullName').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // 4. RESET ERROR MESSAGE ON EVERY CLICK
    errorMessage.textContent = "";
    errorMessage.style.color = "#ef4444"; // Red color for errors

    // 5. VALIDATION CHECKS
    
    // Check if any field is empty (just a backup check)
    if (fullName === "" || username === "" || email === "" || password === "" || confirmPassword === "") {
        errorMessage.textContent = "Please fill in all fields.";
        return;
    }

    // Check if the password is too short
    if (password.length < 6) {
        errorMessage.textContent = "Password must be at least 6 characters long.";
        return;
    }

    // Check if Password and Confirm Password match exactly
    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match! Please check again.";
        return;
    }

    // 6. IF EVERYTHING IS PERFECT
    // Change text color to green for success
    errorMessage.style.color = "#10b981"; 
    errorMessage.textContent = "Account created successfully! Redirecting...";

    // Clear the form fields so it looks clean
    signupForm.reset();

    // Simulate a short delay, then send the admin to the login page
    setTimeout(function() {
        window.location.href = "login.html";
    }, 2000); // 2000 milliseconds = 2 seconds
});
