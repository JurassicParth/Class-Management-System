document.addEventListener("DOMContentLoaded", () => {

    const students =
        JSON.parse(localStorage.getItem("students")) || [];

    const teachers =
        JSON.parse(localStorage.getItem("teachers")) || [];

    const courses =
        JSON.parse(localStorage.getItem("courses")) || [];

    document.getElementById("studentCount").textContent =
        students.length;

    document.getElementById("teacherCount").textContent =
        teachers.length;

    document.getElementById("courseCount").textContent =
        courses.length;

    document.getElementById("attendancePercent").textContent =
        "0%";

    const username =
        localStorage.getItem("username") || "Administrator";

    const welcomeText =
        document.getElementById("welcomeText");

    if (welcomeText) {

        welcomeText.textContent =
            `Welcome, ${username}`;

    }

});
