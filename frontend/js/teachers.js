console.log("teachers.js loaded");

const addBtn = document.querySelector(".add-btn");
const modal = document.getElementById("teacherModal");
const closeBtn = document.getElementById("closeTeacherModal");
const saveBtn = document.getElementById("saveTeacher");

let teachers =
    JSON.parse(localStorage.getItem("teachers")) || [];

if (teachers.length === 0) {

    teachers = [

        {
            id: "T101",
            name: "Dr. Sharma",
            subject: "Database Management Systems",
            email: "sharma@cms.com"
        },

        {
            id: "T102",
            name: "Prof. Patel",
            subject: "Python Programming",
            email: "patel@cms.com"
        }

    ];

    localStorage.setItem(
        "teachers",
        JSON.stringify(teachers)
    );
}

let editIndex = -1;

addBtn.addEventListener("click", () => {

    editIndex = -1;

    document.getElementById(
        "teacherModalTitle"
    ).textContent = "Add Teacher";

    document.getElementById("teacherId").value = "";
    document.getElementById("teacherName").value = "";
    document.getElementById("teacherSubject").value = "";
    document.getElementById("teacherEmail").value = "";

    modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {

    modal.style.display = "none";
});

window.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.style.display = "none";
    }
});

saveBtn.addEventListener("click", () => {

    const id =
        document.getElementById("teacherId")
            .value
            .trim();

    const name =
        document.getElementById("teacherName")
            .value
            .trim();

    const subject =
        document.getElementById("teacherSubject")
            .value
            .trim();

    const email =
        document.getElementById("teacherEmail")
            .value
            .trim();

    if (
        !id ||
        !name ||
        !subject ||
        !email
    ) {

        alert("Please fill all fields.");
        return;
    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        alert("Please enter a valid email address.");
        return;
    }

    const duplicateTeacher =
        teachers.find((teacher, index) =>
            teacher.id === id &&
            index !== editIndex
        );

    if (duplicateTeacher) {

        alert("Teacher ID already exists.");
        return;
    }

    const teacher = {id, name, subject, email};

    if (editIndex === -1) {

        teachers.push(teacher);

    } else {

        teachers[editIndex] = teacher;
    }
    localStorage.setItem(
        "teachers",
        JSON.stringify(teachers)
    );
    renderTeachers();
    modal.style.display = "none";
});

function renderTeachers() {
    const tbody = document.getElementById("teacherTable");
    tbody.innerHTML = "";
    if (teachers.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    No teachers found.
                </td>
            </tr>
        `;
        return;
    }

    teachers.forEach((teacher, index) => {

        tbody.innerHTML += `
            <tr>
                <td>${teacher.id}</td>
                <td>${teacher.name}</td>
                <td>${teacher.subject}</td>
                <td>${teacher.email}</td>

                <td>

                    <button class="edit-btn" onclick="editTeacher(${index})">
                        Edit
                    </button>

                    <button class="delete-btn" onclick="deleteTeacher(${index})">
                        Delete
                    </button>
                </td>
            </tr>`;
    });
}

function editTeacher(index) 
{
    editIndex = index;
    const teacher = teachers[index];
    document.getElementById("teacherModalTitle").textContent = "Edit Teacher";
    document.getElementById("teacherId").value = teacher.id;
    document.getElementById("teacherName").value = teacher.name;
    document.getElementById("teacherSubject").value = teacher.subject;
    document.getElementById("teacherEmail").value = teacher.email;
    modal.style.display = "flex";
}

function deleteTeacher(index) {
    const confirmDelete = confirm("Are you sure you want to delete this teacher?");
    if (!confirmDelete) 
    {
        return;
    }
    teachers.splice(index, 1);
    localStorage.setItem(
        "teachers",
        JSON.stringify(teachers)
    );
    renderTeachers();
}

document.getElementById("searchTeacher").addEventListener("keyup", function () {
        const filter = this.value.toLowerCase();
        const rows = document.querySelectorAll("#teacherTable tr");
        rows.forEach(row => {
            if (row.textContent.toLowerCase().includes(filter)) 
            {
                row.style.display = "";
            } 
            else 
            {
                row.style.display = "none";
            }
        });
    });

renderTeachers();
