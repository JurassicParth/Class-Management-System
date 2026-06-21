// js/login.js
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    // SIMULATED ROLES FOR FRONTEND TESTING
    if (username === "admin" && password === "admin123") {
        localStorage.setItem('currentUserRole', 'admin');
        window.location.href = "dashboard.html";
    } 
    else if (username.startsWith("t_") && password === "teacher123") {
        // Teachers can log in with a username starting with t_ (e.g., t_parth)
        localStorage.setItem('currentUserRole', 'teacher');
        window.location.href = "dashboard.html";
    } 
    else if (username.startsWith("ca") && password === "student123") {
        // Students log in using their SRN format (e.g., ca101)
        localStorage.setItem('currentUserRole', 'student');
        window.location.href = "dashboard.html";
    } 
    else {
        errorMessage.style.color = "#ef4444";
        errorMessage.textContent = "Invalid Username or Password";
    }
});
