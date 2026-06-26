document.addEventListener("DOMContentLoaded", () => {
    // Run the statistics loader setup immediately when the dashboard page loads
    fetchDashboardStatistics();
});

async function fetchDashboardStatistics() {
    // Target your local Flask backend analytics endpoint
    const statsUrl = "http://127.0.0.1:8080/dashboard/stats";

    try {
        const response = await fetch(statsUrl);
        if (!response.ok) throw new Error("Could not fetch dashboard metrics endpoint");

        const data = await response.json();

        // Target the individual statistic text containers on your dashboard HTML page
        const studentsContainer = document.getElementById("totalStudentsCount");
        const teachersContainer = document.getElementById("totalTeachersCount");
        const attendanceContainer = document.getElementById("averageAttendance");
        const coursesContainer = document.getElementById("totalTestsCount"); // Maps to the Courses statistic card

        // Update the card counts smoothly with live data if the elements exist in your HTML
        if (studentsContainer) {
            studentsContainer.textContent = data.totalStudents !== undefined ? data.totalStudents : "0";
        }
        if (teachersContainer) {
            teachersContainer.textContent = data.totalTeachers !== undefined ? data.totalTeachers : "0";
        }
        if (attendanceContainer) {
            attendanceContainer.textContent = data.averageAttendance || "0%";
        }
        if (coursesContainer) {
            coursesContainer.textContent = data.totalCourses !== undefined ? data.totalCourses : "0";
        }

    } catch (err) {
        console.error("Dashboard metric engine connection error:", err);
        
        // Safe fallback values in case the backend server is temporarily unreachable
        const studentsContainer = document.getElementById("totalStudentsCount");
        const teachersContainer = document.getElementById("totalTeachersCount");
        
        if (studentsContainer) studentsContainer.textContent = "0";
        if (teachersContainer) teachersContainer.textContent = "0";
    }
}
