// ==========================================
// COLLEGE MANAGEMENT SYSTEM
// TEACHERS.JS
// ==========================================

const API = "http://127.0.0.1:5000/teachers";

const tableBody = document.getElementById("teacherTable");

const modal = document.getElementById("teacherModal");

const addBtn = document.getElementById("addTeacherBtn");

const closeBtn = document.getElementById("closeTeacherModal");

const saveBtn = document.getElementById("saveTeacher");

const searchBox = document.getElementById("searchTeacher");

const modalTitle = document.getElementById("teacherModalTitle");

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

  modalTitle.textContent = "Add Teacher";

  document.getElementById("teacherForm").reset();

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
// LOAD TEACHERS
// ==========================================

async function loadTeachers() {
  try {
    const response = await fetch(API);

    const teachers = await response.json();

    renderTable(teachers);
  } catch (error) {
    console.error(error);

    showToast("Unable to load teachers.", false);
  }
}

// ==========================================
// RENDER TABLE
// ==========================================

function renderTable(teachers) {
  tableBody.innerHTML = "";

  teachers.forEach((teacher) => {
    tableBody.innerHTML += `

        <tr>

            <td>${teacher.teacher_id}</td>

            <td>${teacher.name}</td>

            <td>${teacher.subject}</td>

            <td>${teacher.email}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editTeacher(${teacher.id})">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTeacher(${teacher.id})">

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

    const teachers = await response.json();

    renderTable(teachers);
  } catch (error) {
    console.error(error);
  }
});

// ==========================================
// LOAD INITIAL DATA
// ==========================================

loadTeachers();

// ==========================================
// EDIT TEACHER
// ==========================================

async function editTeacher(id) {
  try {
    const response = await fetch(API + "/" + id);

    const teacher = await response.json();

    editId = id;

    modalTitle.textContent = "Edit Teacher";

    document.getElementById("teacherId").value = teacher.teacher_id;

    document.getElementById("teacherName").value = teacher.name;

    document.getElementById("teacherSubject").value = teacher.subject;

    document.getElementById("teacherEmail").value = teacher.email;

    modal.style.display = "flex";
  } catch (error) {
    console.error(error);

    showToast("Unable to load teacher details.", false);
  }
}

// ==========================================
// DELETE TEACHER
// ==========================================

async function deleteTeacher(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this teacher?",
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

      loadTeachers();
    } else {
      showToast(result.message, false);
    }
  } catch (error) {
    console.error(error);

    showToast("Unable to delete teacher.", false);
  }
}

// ==========================================
// SAVE TEACHER
// ==========================================

document
  .getElementById("teacherForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const teacher = {
      teacher_id: document.getElementById("teacherId").value.trim(),

      name: document.getElementById("teacherName").value.trim(),

      subject: document.getElementById("teacherSubject").value.trim(),

      email: document.getElementById("teacherEmail").value.trim(),
    };

    try {
      let response;

      if (editId === null) {
        response = await fetch(API, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(teacher),
        });
      } else {
        response = await fetch(API + "/" + editId, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(teacher),
        });
      }

      const result = await response.json();

      if (result.success) {
        showToast(result.message);

        modal.style.display = "none";

        document.getElementById("teacherForm").reset();

        editId = null;

        loadTeachers();
      } else {
        showToast(result.message, false);
      }
    } catch (error) {
      console.error(error);

      showToast("Unable to save teacher.", false);
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

loadTeachers();
