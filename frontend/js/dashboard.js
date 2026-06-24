document.addEventListener("DOMContentLoaded", () => {
    fetchDashboardStats();
});

async function fetchDashboardStats() {
    try {
        // Fetch active students array from backend
        const studentResponse = await fetch("http://127.0.0.1:8080/students");
        if (studentResponse.ok) {
            const students = await studentResponse.get_json() || await studentResponse.json();
            document.getElementById("totalStudentsCount").textContent = students.length;
        } else {
            document.getElementById("totalStudentsCount").textContent = "0";
        }

        // Fetch active teachers array from backend (Placeholder endpoint until teachers blueprint is added)
        // If your teacher endpoint isn't built yet, it safely falls back to 0 instead of hardcoded 3
        try {
            const teacherResponse = await fetch("http://127.0.0.1:8080/teachers");
            if (teacherResponse.ok) {
                const teachers = await teacherResponse.json();
                document.getElementById("totalTeachersCount").textContent = teachers.length;
            } else {
                document.getElementById("totalTeachersCount").textContent = "0";
            }
        } catch (e) {
            document.getElementById("totalTeachersCount").textContent = "0";
        }

    } catch (error) {
        console.error("Error loading dashboard data updates:", error);
    }
}
