console.log("students.js loaded");

const addBtn = document.querySelector(".add-btn");
const modal = document.getElementById("studentModal");
const closeBtn = document.getElementById("closeModal");
const saveBtn = document.getElementById("saveStudent");

let students =
    JSON.parse(localStorage.getItem("students"));

if (!students || students.length === 0) {

    students = [

        {
            id: "101",
            name: "Rahul Sharma",
            className: "BCA 1A",
            email: "rahul@gmail.com"
        },

        {
            id: "102",
            name: "Priya Patel",
            className: "BCA 1A",
            email: "priya@gmail.com"
        }

    ];
}

let editIndex = -1;

addBtn.addEventListener("click", () => {

    editIndex = -1;

    document.getElementById("modalTitle").textContent =
        "Add Student";

    document.getElementById("studentId").value = "";
    document.getElementById("studentName").value = "";
    document.getElementById("studentClass").value = "";
    document.getElementById("studentEmail").value = "";

    modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {

    modal.style.display = "none";

});

saveBtn.addEventListener("click", () => {

    const id =
        document.getElementById("studentId").value.trim();

    const name =
        document.getElementById("studentName").value.trim();

    const className =
        document.getElementById("studentClass").value.trim();

    const email =
        document.getElementById("studentEmail").value.trim();

    if (
        !id ||
        !name ||
        !className ||
        !email
    ) {

        alert("Please fill all fields.");
        return;
    }

    const student = {
        id,
        name,
        className,
        email
    };

    if (editIndex === -1) {

        students.push(student);

    } else {

        students[editIndex] = student;

    }

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    renderStudents();

    modal.style.display = "none";

});

function renderStudents() {

    const tbody =
        document.getElementById("studentTable");

    tbody.innerHTML = "";

    students.forEach((student, index) => {

        tbody.innerHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.className}</td>
                <td>${student.email}</td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editStudent(${index})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteStudent(${index})">
                        Delete
                    </button>

                </td>
            </tr>
        `;

    });

}

function editStudent(index) {

    editIndex = index;

    const student = students[index];

    document.getElementById("modalTitle").textContent =
        "Edit Student";

    document.getElementById("studentId").value =
        student.id;

    document.getElementById("studentName").value =
        student.name;

    document.getElementById("studentClass").value =
        student.className;

    document.getElementById("studentEmail").value =
        student.email;

    modal.style.display = "flex";

}

function deleteStudent(index) {

    if (confirm("Delete this student?")) {

        students.splice(index, 1);

        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );

        renderStudents();

    }

}

document
    .getElementById("searchStudent")
    .addEventListener("keyup", function () {

        const filter =
            this.value.toLowerCase();

        const rows =
            document.querySelectorAll(
                "#studentTable tr"
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

renderStudents();
