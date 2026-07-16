// ==========================================
// COLLEGE MANAGEMENT SYSTEM
// COURSES.JS
// ==========================================

const API = "http://127.0.0.1:5000/courses";

const tableBody = document.getElementById("courseTable");

const modal = document.getElementById("courseModal");

const addBtn = document.getElementById("addCourseBtn");

const closeBtn = document.getElementById("closeCourseModal");

const modalTitle = document.getElementById("courseModalTitle");

const toast = document.getElementById("toast");

const searchBox = document.getElementById("searchCourse");

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

  modalTitle.textContent = "Add Course";

  document.getElementById("courseForm").reset();

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
// LOAD COURSES
// ==========================================

async function loadCourses() {
  try {
    const response = await fetch(API);

    const courses = await response.json();

    renderTable(courses);
  } catch (error) {
    console.error(error);

    showToast("Unable to load courses.", false);
  }
}

// ==========================================
// RENDER TABLE
// ==========================================

function renderTable(courses) {
  tableBody.innerHTML = "";

  courses.forEach((course) => {
    tableBody.innerHTML += `

        <tr>

            <td>${course.course_code}</td>

            <td>${course.course_name}</td>

            <td>${course.duration}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editCourse(${course.id})">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteCourse(${course.id})">

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

    const courses = await response.json();

    renderTable(courses);
  } catch (error) {
    console.error(error);
  }
});

// ==========================================
// INITIAL LOAD
// ==========================================

loadCourses();
// ==========================================
// EDIT COURSE
// ==========================================

async function editCourse(id) {
  try {
    const response = await fetch(API + "/" + id);

    const course = await response.json();

    editId = id;

    modalTitle.textContent = "Edit Course";

    document.getElementById("courseCode").value = course.course_code;

    document.getElementById("courseName").value = course.course_name;

    document.getElementById("courseDuration").value = course.duration;

    modal.style.display = "flex";
  } catch (error) {
    console.error(error);

    showToast("Unable to load course details.", false);
  }
}

// ==========================================
// DELETE COURSE
// ==========================================

async function deleteCourse(id) {
  const confirmDelete = confirm("Are you sure you want to delete this course?");

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

      loadCourses();
    } else {
      showToast(result.message, false);
    }
  } catch (error) {
    console.error(error);

    showToast("Unable to delete course.", false);
  }
}

// ==========================================
// SAVE COURSE
// ==========================================

document
  .getElementById("courseForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const course = {
      course_code: document.getElementById("courseCode").value.trim(),

      course_name: document.getElementById("courseName").value.trim(),

      duration: document.getElementById("courseDuration").value.trim(),
    };

    try {
      let response;

      if (editId === null) {
        response = await fetch(API, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(course),
        });
      } else {
        response = await fetch(API + "/" + editId, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(course),
        });
      }

      const result = await response.json();

      if (result.success) {
        showToast(result.message);

        modal.style.display = "none";

        document.getElementById("courseForm").reset();

        editId = null;

        loadCourses();
      } else {
        showToast(result.message, false);
      }
    } catch (error) {
      console.error(error);

      showToast("Unable to save course.", false);
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

loadCourses();
