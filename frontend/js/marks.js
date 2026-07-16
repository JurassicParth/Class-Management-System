// ==========================================
// COLLEGE MANAGEMENT SYSTEM
// MARKS.JS
// ==========================================

const API = "http://127.0.0.1:5000/marks";

const tableBody = document.getElementById("marksTable");

const modal = document.getElementById("marksModal");

const addBtn = document.getElementById("addMarksBtn");

const closeBtn = document.getElementById("closeMarksModal");

const modalTitle = document.getElementById("marksModalTitle");

const toast = document.getElementById("toast");

const searchBox = document.getElementById("searchMarks");

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

  modalTitle.textContent = "Add Marks";

  document.getElementById("marksForm").reset();

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
// CALCULATE PERCENTAGE & GRADE
// ==========================================

function calculateMarks() {
  const obtained = Number(document.getElementById("marksObtained").value);

  const total = Number(document.getElementById("totalMarks").value);

  if (obtained > 0 && total > 0) {
    const percentage = ((obtained / total) * 100).toFixed(2);

    document.getElementById("percentage").value = percentage;

    let grade = "";

    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 60) grade = "C";
    else if (percentage >= 50) grade = "D";
    else grade = "F";

    document.getElementById("grade").value = grade;
  }
}

document
  .getElementById("marksObtained")
  .addEventListener("input", calculateMarks);

document.getElementById("totalMarks").addEventListener("input", calculateMarks);

// ==========================================
// LOAD MARKS
// ==========================================

async function loadMarks() {
  try {
    const response = await fetch(API);

    const marks = await response.json();

    renderTable(marks);
  } catch (error) {
    console.error(error);

    showToast("Unable to load marks.", false);
  }
}

// ==========================================
// RENDER TABLE
// ==========================================

function renderTable(marks) {
  tableBody.innerHTML = "";

  marks.forEach((record) => {
    tableBody.innerHTML += `

        <tr>

            <td>${record.student_name}</td>

            <td>${record.subject}</td>

            <td>${record.marks_obtained}</td>

            <td>${record.total_marks}</td>

            <td>${record.percentage}%</td>

            <td>${record.grade}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editMarks(${record.id})">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteMarks(${record.id})">

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

    const marks = await response.json();

    renderTable(marks);
  } catch (error) {
    console.error(error);
  }
});

// ==========================================
// INITIAL LOAD
// ==========================================

loadMarks();
// ==========================================
// EDIT MARKS
// ==========================================

async function editMarks(id) {
  try {
    const response = await fetch(API + "/" + id);

    const record = await response.json();

    editId = id;

    modalTitle.textContent = "Edit Marks";

    document.getElementById("studentName").value = record.student_name;

    document.getElementById("subject").value = record.subject;

    document.getElementById("marksObtained").value = record.marks_obtained;

    document.getElementById("totalMarks").value = record.total_marks;

    document.getElementById("percentage").value = record.percentage;

    document.getElementById("grade").value = record.grade;

    modal.style.display = "flex";
  } catch (error) {
    console.error(error);

    showToast("Unable to load marks details.", false);
  }
}

// ==========================================
// DELETE MARKS
// ==========================================

async function deleteMarks(id) {
  const confirmDelete = confirm("Are you sure you want to delete this record?");

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

      loadMarks();
    } else {
      showToast(result.message, false);
    }
  } catch (error) {
    console.error(error);

    showToast("Unable to delete marks.", false);
  }
}

// ==========================================
// SAVE MARKS
// ==========================================

document
  .getElementById("marksForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const marks = {
      student_name: document.getElementById("studentName").value.trim(),

      subject: document.getElementById("subject").value.trim(),

      marks_obtained: Number(document.getElementById("marksObtained").value),

      total_marks: Number(document.getElementById("totalMarks").value),

      percentage: Number(document.getElementById("percentage").value),

      grade: document.getElementById("grade").value,
    };

    try {
      let response;

      if (editId === null) {
        response = await fetch(API, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(marks),
        });
      } else {
        response = await fetch(API + "/" + editId, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(marks),
        });
      }

      const result = await response.json();

      if (result.success) {
        showToast(result.message);

        modal.style.display = "none";

        document.getElementById("marksForm").reset();

        editId = null;

        loadMarks();
      } else {
        showToast(result.message, false);
      }
    } catch (error) {
      console.error(error);

      showToast("Unable to save marks.", false);
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

loadMarks();
