// This function reads data from localStorage and updates the UI boxes
function updateDashboardStats() {
    // 1. Grab elements from the page
    const studentsBox = document.getElementById('totalStudentsCount');
    const teachersBox = document.getElementById('totalTeachersCount');
    const testsBox = document.getElementById('totalTestsCount');
    const attendanceBox = document.getElementById('averageAttendance');

    // 2. Fetch the student array from localStorage (fallback to empty list if none exist)
    const studentsList = JSON.parse(localStorage.getItem('students')) || [];
    studentsBox.innerText = studentsList.length; // Set total count

    // 3. Fetch the teacher array from localStorage
    const teachersList = JSON.parse(localStorage.getItem('teachers')) || [];
    teachersBox.innerText = teachersList.length; // Set total count

    // 4. Fetch the marks array to calculate total tests conducted
    const marksList = JSON.parse(localStorage.getItem('marks')) || [];
    testsBox.innerText = marksList.length; // Each entry counts as a record/test

    // 5. Fetch attendance records to display an average percentage
    const attendanceList = JSON.parse(localStorage.getItem('attendance')) || [];
    if (attendanceList.length > 0) {
        // Count how many records are marked "Present"
        const presentCount = attendanceList.filter(record => record.status === 'Present').length;
        const average = ((presentCount / attendanceList.length) * 100).toFixed(0);
        attendanceBox.innerText = `${average}%`;
    } else {
        attendanceBox.innerText = "0%"; // Fallback if no attendance marked yet
    }
}

// Run this logic immediately when the dashboard screen opens
document.addEventListener('DOMContentLoaded', updateDashboardStats);
