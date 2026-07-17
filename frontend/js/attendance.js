// ==========================================
// COLLEGE MANAGEMENT SYSTEM
// ATTENDANCE.JS
// ==========================================

const API = "http://127.0.0.1:5000/attendance";

const tableBody = document.getElementById("attendanceTable");

const modal = document.getElementById("attendanceModal");

const addBtn = document.getElementById("addAttendanceBtn");

const closeBtn = document.getElementById("closeAttendanceModal");

const modalTitle = document.getElementById("attendanceModalTitle");

const toast = document.getElementById("toast");

const searchBox = document.getElementById("searchAttendance");

let editId = null;

// ==========================================
// TOAST
// ==========================================

function showToast(message, success = true) {
  toast.textContent = message;

  toast.style.background = success ? "#16a34a" : "#dc2626";

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ==========================================
// OPEN MODAL
// ==========================================

addBtn.addEventListener("click", () => {
  editId = null;

  modalTitle.textContent = "Mark Attendance";

  document.getElementById("attendanceForm").reset();

  modal.style.display = "flex";
});

// ==========================================
// CLOSE MODAL
// ==========================================

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// ==========================================
// LOAD ATTENDANCE
// ==========================================

async function loadAttendance() {
  try {
    const response = await fetch(API);

    const attendance = await response.json();

    renderTable(attendance);
  } catch (error) {
    console.error(error);

    showToast("Unable to load attendance.", false);
  }
}

// ==========================================
// RENDER TABLE
// ==========================================

function renderTable(attendance) {
  tableBody.innerHTML = "";

  attendance.forEach((record) => {
    tableBody.innerHTML += `

        <tr>

            <td>${record.student_name}</td>

            <td>${record.attendance_date}</td>

            <td>${record.status}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editAttendance(${record.id})">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteAttendance(${record.id})">

                    Delete

                </button>

            </td>

        </tr>

        `;
  });
}

// ==========================================
// SEARCH
// ==========================================

searchBox.addEventListener("keyup", async function () {
  const keyword = this.value.trim();

  try {
    let response;

    if (keyword === "") {
      response = await fetch(API);
    } else {
      response = await fetch(API + "/search/" + encodeURIComponent(keyword));
    }

    const attendance = await response.json();

    renderTable(attendance);
  } catch (error) {
    console.error(error);
  }
});

// ==========================================
// INITIAL LOAD
// ==========================================

loadAttendance();
// ==========================================
// EDIT ATTENDANCE
// ==========================================

async function editAttendance(id) {
  try {
    const response = await fetch(API + "/" + id);

    const record = await response.json();

    editId = id;

    modalTitle.textContent = "Edit Attendance";

    document.getElementById("studentName").value = record.student_name;

    document.getElementById("attendanceDate").value = record.attendance_date;

    document.getElementById("attendanceStatus").value = record.status;

    modal.style.display = "flex";
  } catch (error) {
    console.error(error);

    showToast("Unable to load attendance details.", false);
  }
}

// ==========================================
// DELETE ATTENDANCE
// ==========================================

async function deleteAttendance(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this attendance record?",
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(API + "/" + id, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      showToast(result.message);

      loadAttendance();
    } else {
      showToast(result.message, false);
    }
  } catch (error) {
    console.error(error);

    showToast("Unable to delete attendance.", false);
  }
}

// ==========================================
// SAVE ATTENDANCE
// ==========================================

document
  .getElementById("attendanceForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const attendance = {
      student_name: document.getElementById("studentName").value.trim(),

      attendance_date: document.getElementById("attendanceDate").value,

      status: document.getElementById("attendanceStatus").value,
    };

    try {
      let response;

      if (editId === null) {
        response = await fetch(API, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(attendance),
        });
      } else {
        response = await fetch(API + "/" + editId, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(attendance),
        });
      }

      const result = await response.json();

      if (result.success) {
        showToast(result.message);

        modal.style.display = "none";

        document.getElementById("attendanceForm").reset();

        editId = null;

        loadAttendance();
      } else {
        showToast(result.message, false);
      }
    } catch (error) {
      console.error(error);

      showToast("Unable to save attendance.", false);
    }
  });

// ==========================================
// ESC KEY CLOSE MODAL
// ==========================================

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    modal.style.display = "none";
  }
});

// ==========================================
// INITIALIZE
// ==========================================

loadAttendance();