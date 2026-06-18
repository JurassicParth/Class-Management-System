const addBtn = document.querySelector(".add-btn");
const modal = document.getElementById("courseModal");
const closeBtn = document.getElementById("closeCourseModal");
const saveBtn = document.getElementById("saveCourse");

let courses =
    JSON.parse(localStorage.getItem("courses"));

if (!courses || courses.length === 0) {

    courses = [

        {
            id: "C101",
            name: "Database Systems",
            duration: "6 Months",
            teacher: "Dr. Sharma"
        },

        {
            id: "C102",
            name: "Python Programming",
            duration: "4 Months",
            teacher: "Prof. Patel"
        }

    ];
}

let editIndex = -1;

addBtn.addEventListener("click", () => {

    editIndex = -1;

    document.getElementById("courseModalTitle").textContent =
        "Add Course";

    document.getElementById("courseId").value = "";
    document.getElementById("courseName").value = "";
    document.getElementById("courseDuration").value = "";
    document.getElementById("courseTeacher").value = "";

    modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {

    modal.style.display = "none";

});

saveBtn.addEventListener("click", () => {

    const id =
        document.getElementById("courseId").value.trim();

    const name =
        document.getElementById("courseName").value.trim();

    const duration =
        document.getElementById("courseDuration").value.trim();

    const teacher =
        document.getElementById("courseTeacher").value.trim();

    if (!id || !name || !duration || !teacher) {

        alert("Please fill all fields.");
        return;
    }

    const course = {
        id,
        name,
        duration,
        teacher
    };

    if (editIndex === -1) {

        courses.push(course);

    } else {

        courses[editIndex] = course;

    }

    localStorage.setItem(
        "courses",
        JSON.stringify(courses)
    );

    renderCourses();

    modal.style.display = "none";
});

function renderCourses() {

    const tbody =
        document.getElementById("courseTable");

    tbody.innerHTML = "";

    courses.forEach((course, index) => {

        tbody.innerHTML += `
            <tr>
                <td>${course.id}</td>
                <td>${course.name}</td>
                <td>${course.duration}</td>
                <td>${course.teacher}</td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editCourse(${index})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteCourse(${index})">
                        Delete
                    </button>

                </td>

            </tr>
        `;

    });

}

function editCourse(index) {

    editIndex = index;

    const course = courses[index];

    document.getElementById("courseModalTitle").textContent =
        "Edit Course";

    document.getElementById("courseId").value =
        course.id;

    document.getElementById("courseName").value =
        course.name;

    document.getElementById("courseDuration").value =
        course.duration;

    document.getElementById("courseTeacher").value =
        course.teacher;

    modal.style.display = "flex";
}

function deleteCourse(index) {

    if (confirm("Delete this course?")) {

        courses.splice(index, 1);

        localStorage.setItem(
            "courses",
            JSON.stringify(courses)
        );

        renderCourses();
    }
}

document
.getElementById("searchCourse")
.addEventListener("keyup", function () {

    const filter =
        this.value.toLowerCase();

    const rows =
        document.querySelectorAll(
            "#courseTable tr"
        );

    rows.forEach(row => {

        if (
            row.textContent
            .toLowerCase()
            .includes(filter)
        ) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

});

renderCourses();
