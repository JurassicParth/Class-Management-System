// ==========================================
// COLLEGE MANAGEMENT SYSTEM
// STUDENTS.JS
// ==========================================

const API = "http://127.0.0.1:5000/students";

const tableBody = document.getElementById("studentTable");

const modal = document.getElementById("studentModal");

const addBtn = document.getElementById("addStudentBtn");

const closeBtn = document.getElementById("closeStudentModal");

const saveBtn = document.getElementById("saveStudent");

const searchBox = document.getElementById("searchStudent");

const modalTitle = document.getElementById("studentModalTitle");

const toast = document.getElementById("toast");

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

  modalTitle.textContent = "Add Student";

  document.getElementById("studentForm").reset();

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
// LOAD STUDENTS
// ==========================================

async function loadStudents() {
  try {
    const response = await fetch(API);

    const students = await response.json();

    renderTable(students);
  } catch (error) {
    console.error(error);

    showToast("Unable to load students.", false);
  }
}

// ==========================================
// RENDER TABLE
// ==========================================

function renderTable(students) {
  tableBody.innerHTML = "";

  students.forEach((student) => {
    tableBody.innerHTML += `

        <tr>

            <td>${student.student_id}</td>

            <td>${student.name}</td>

            <td>${student.class_name}</td>

            <td>${student.email}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editStudent(${student.id})">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})">

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

    const students = await response.json();

    renderTable(students);
  } catch (error) {
    console.error(error);
  }
});

// ==========================================
// LOAD INITIAL DATA
// ==========================================

loadStudents();
// ==========================================
// EDIT STUDENT
// ==========================================

async function editStudent(id) {
  try {
    const response = await fetch(API + "/" + id);

    const student = await response.json();

    editId = id;

    modalTitle.textContent = "Edit Student";

    document.getElementById("studentId").value = student.student_id;

    document.getElementById("studentName").value = student.name;

    document.getElementById("studentClass").value = student.class_name;

    document.getElementById("studentEmail").value = student.email;

    modal.style.display = "flex";
  } catch (error) {
    console.error(error);

    showToast("Unable to load student details.", false);
  }
}

// ==========================================
// DELETE STUDENT
// ==========================================

async function deleteStudent(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this student?",
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

      loadStudents();
    } else {
      showToast(result.message, false);
    }
  } catch (error) {
    console.error(error);

    showToast("Unable to delete student.", false);
  }
}

// ==========================================
// SAVE STUDENT
// ==========================================

document
  .getElementById("studentForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const student = {
      student_id: document.getElementById("studentId").value.trim(),

      name: document.getElementById("studentName").value.trim(),

      class_name: document.getElementById("studentClass").value.trim(),

      email: document.getElementById("studentEmail").value.trim(),
    };

    try {
      let response;

      if (editId === null) {
        response = await fetch(API, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(student),
        });
      } else {
        response = await fetch(API + "/" + editId, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(student),
        });
      }

      const result = await response.json();

      if (result.success) {
        showToast(result.message);

        modal.style.display = "none";

        document.getElementById("studentForm").reset();

        editId = null;

        loadStudents();
      } else {
        showToast(result.message, false);
      }
    } catch (error) {
      console.error(error);

      showToast("Unable to save student.", false);
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

loadStudents();
