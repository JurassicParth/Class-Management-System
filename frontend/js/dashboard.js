// ==========================================
// COLLEGE MANAGEMENT SYSTEM
// DASHBOARD.JS
// ==========================================

const API = "http://127.0.0.1:5000";

// ==========================================
// Logged In User
// ==========================================

const username = localStorage.getItem("loggedInUser") || "Admin";

document.getElementById("username").textContent = username;

// ==========================================
// Current Date & Time
// ==========================================

function updateDateTime() {
  const now = new Date();

  document.getElementById("currentDate").textContent = now.toLocaleString();
}

updateDateTime();

setInterval(updateDateTime, 1000);

// ==========================================
// Dashboard Counts
// ==========================================

async function loadCounts() {
  try {
    // Students

    const studentResponse = await fetch(API + "/students");

    const students = await studentResponse.json();

    document.getElementById("studentCount").textContent = students.length;

    // Teachers

    const teacherResponse = await fetch(API + "/teachers");

    const teachers = await teacherResponse.json();

    document.getElementById("teacherCount").textContent = teachers.length;

    // Courses

    const courseResponse = await fetch(API + "/courses");

    const courses = await courseResponse.json();

    document.getElementById("courseCount").textContent = courses.length;

    // Announcements

    const announcementResponse = await fetch(API + "/announcements");

    const announcements = await announcementResponse.json();

    document.getElementById("announcementCount").textContent =
      announcements.length;
  } catch (error) {
    console.error(error);
  }
}

// ==========================================
// Recent Students
// ==========================================

async function loadStudents() {
  try {
    const response = await fetch(API + "/students");

    const students = await response.json();

    const table = document.getElementById("recentStudents");

    table.innerHTML = "";

    students
      .slice(-5)
      .reverse()
      .forEach((student) => {
        table.innerHTML += `

                <tr>

                    <td>${student.student_id}</td>

                    <td>${student.name}</td>

                    <td>${student.class_name}</td>

                    <td>${student.email}</td>

                </tr>

                `;
      });
  } catch (error) {
    console.error(error);
  }
}

// ==========================================
// Announcements
// ==========================================

async function loadAnnouncements() {
  try {
    const response = await fetch(API + "/announcements");

    const announcements = await response.json();

    const list = document.getElementById("announcementList");

    list.innerHTML = "";

    if (announcements.length === 0) {
      list.innerHTML = `

            <div class="announcement">

                <h3>

                    No Announcements

                </h3>

                <small>

                    Nothing to display.

                </small>

            </div>

            `;

      return;
    }

    announcements.reverse().forEach((item) => {
      list.innerHTML += `

                <div class="announcement">

                    <h3>

                        ${item.title}

                    </h3>

                    <p>

                        ${item.message}

                    </p>

                    <small>

                        ${item.announcement_date}

                    </small>

                </div>

                `;
    });
  } catch (error) {
    console.error(error);
  }
}

// ==========================================
// Student Chart
// ==========================================

new Chart(
  document.getElementById("studentChart"),

  {
    type: "bar",

    data: {
      labels: ["Students"],

      datasets: [
        {
          label: "Total",

          data: [0],
        },
      ],
    },

    options: {
      responsive: true,
    },
  },
);

// ==========================================
// Attendance Chart
// ==========================================

new Chart(
  document.getElementById("attendanceChart"),

  {
    type: "pie",

    data: {
      labels: ["Present", "Absent"],

      datasets: [
        {
          data: [
            0,

            0,
          ],
        },
      ],
    },

    options: {
      responsive: true,
    },
  },
);

// ==========================================
// Logout
// ==========================================

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
});

// ==========================================
// Initialize
// ==========================================

loadCounts();

loadStudents();

loadAnnouncements();
