// js/profile.js
document.addEventListener("DOMContentLoaded", function() {
    const roleTitle = document.getElementById("displayUserRole");
    const nameInput = document.getElementById("profileName");
    const emailInput = document.getElementById("profileEmail");
    const profileForm = document.getElementById("profileForm");

    // Fetch active session credentials out of the browser memory cache
    const currentRole = localStorage.getItem("currentUserRole") || "student";

    // Display the active tier profile tag cleanly
    roleTitle.textContent = `${currentRole} Profile Card`;

    // Put mock template data based on who logged in
    if (currentRole === "admin") {
        nameInput.value = "System Administrator";
        emailInput.value = "admin@cms.edu";
    } else if (currentRole === "teacher") {
        nameInput.value = "Faculty Professor";
        emailInput.value = "teacher@cms.edu";
    } else {
        nameInput.value = "Parth";
        emailInput.value = "parth@cms.edu";
    }

    // Save configuration form changes
    profileForm.addEventListener("submit", function(e) {
        e.preventDefault();
        alert("Success! Your profile information has been locally updated.");
    });
});
