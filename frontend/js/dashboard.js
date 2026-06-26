document.addEventListener("DOMContentLoaded", () => {
    // Run the statistics loader setup right away
    fetchDashboardStatistics();
});

async function fetchDashboardStatistics() {
    // Target your local Flask server stats link
    const statsUrl = "http://127.0.0.1:8080/dashboard/stats";

    try {
        const response = await fetch(statsUrl);
        if (!response.ok) throw new Error("Could not fetch dashboard metrics endpoint");

        const data = await response.json();

        // Target the element containers on dashboard.html and assign counts
        const studentsContainer = document.getElementById("totalStudentsCount");
        const teachersContainer = document.getElementById("totalTeachersCount");
        const attendanceContainer = document.getElementById("averageAttendance");
        const coursesContainer = document.getElementById("totalTestsCount"); // Re-purposed as courses count or tests

        if (studentsContainer) studentsContainer.textContent = data.totalStudents;
        if (teachersContainer) teachersContainer.textContent = data.totalTeachers;
        if (attendanceContainer) attendanceContainer.textContent = data.averageAttendance;
        if (coursesContainer) coursesContainer.textContent = data.totalCourses;

    } catch (err) {
        console.error("Dashboard engine connection error:", err);
    }
}
