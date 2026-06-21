// js/main.js
document.addEventListener("DOMContentLoaded", function() {
    // 1. Get the role of the logged-in user
    const userRole = localStorage.getItem('currentUserRole') || 'student'; // Fallback to student for safety

    // 2. Apply rules across the application UI
    applyRoleBasedUI(userRole);
});

function applyRoleBasedUI(role) {
    const body = document.body;
    
    // Add a helper class to the body tag so we can use CSS to hide/show things instantly
    body.classList.add(`role-${role}`);

    // Find all sidebar links
    const sidebarLinks = document.querySelectorAll(".sidebar ul li a");

    sidebarLinks.forEach(link => {
        const href = link.getAttribute("href");

        // --- STUDENT RESTRICTIONS ---
        if (role === "student") {
            // Students can only see Dashboard, Marks, Courses (Subjects), and Announcements
            if (href.includes("students.html") || href.includes("teachers.html") || href.includes("attendance.html")) {
                link.parentElement.style.display = "none";
            }
        }

        // --- TEACHER RESTRICTIONS ---
        if (role === "teacher") {
            // Teachers can see everything except managing other Teachers or Student base accounts
            if (href.includes("teachers.html") || href.includes("students.html")) {
                link.parentElement.style.display = "none";
            }
        }
    });

    // 3. Hide interactive action controls from students
    if (role === "student") {
        // Hide all "Add New" buttons globally on screens they can view
        const addButtons = document.querySelectorAll(".add-btn");
        addButtons.forEach(btn => btn.style.display = "none");

        // Hide table Action columns (Edit/Delete) completely
        const actionHeaders = document.querySelectorAll("th");
        actionHeaders.forEach(th => {
            if (th.textContent.trim() === "Actions") th.style.display = "none";
        });

        // Hide action button columns in rows if they load
        setTimeout(() => {
            const actionCells = document.querySelectorAll("td button");
            actionCells.forEach(btn => {
                if (btn.classList.contains("edit-btn") || btn.classList.contains("delete-btn")) {
                    btn.parentElement.style.display = "none";
                }
            });
        }, 100);
    }
}

// LOGOUT BUTTON HANDLER
document.addEventListener("DOMContentLoaded", function() {
    // Look for any link that points to login.html inside our sidebar
    const logoutLink = document.querySelector('.sidebar a[href="login.html"]');
    
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault(); // Stop the immediate redirect so we can clean memory first
            
            // Clear the active session role out of the browser
            localStorage.removeItem('currentUserRole');
            
            // Show a friendly alert to confirm logout
            alert("Logging out safely... Session cleared!");
            
            // Redirect the user back to the login screen
            window.location.href = "login.html";
        });
    }
});
