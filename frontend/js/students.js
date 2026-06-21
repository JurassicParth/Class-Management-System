// 1. SELECT HTML ELEMENTS
const addStudentBtn = document.querySelector('.add-btn');
const studentModal = document.getElementById('studentModal');
const closeStudentModalBtn = document.getElementById('closeStudentModal');
const saveStudentBtn = document.getElementById('saveStudent');
const studentTableBody = document.getElementById('studentTable');

// Input fields from modal popup box
const studentIdInput = document.getElementById('studentId');
const studentNameInput = document.getElementById('studentName');
const studentClassInput = document.getElementById('studentClass');
const studentEmailInput = document.getElementById('studentEmail');

// 2. OPEN AND CLOSE MODAL BOX FUNCTIONS
if (addStudentBtn) {
    addStudentBtn.addEventListener('click', function() {
        studentModal.style.display = 'flex';
    });
}

if (closeStudentModalBtn) {
    closeStudentModalBtn.addEventListener('click', function() {
        clearStudentInputs();
        studentModal.style.display = 'none';
    });
}

// 3. AUTOMATICALLY LOAD EXISTING STUDENTS ON PAGE LOAD (READ)
document.addEventListener("DOMContentLoaded", fetchStudents);

async function fetchStudents() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/students');
        const students = await response.json();
        
        studentTableBody.innerHTML = ""; // Clear old placeholder rows
        
        students.forEach(student => {
            appendStudentRow(student.student_id, student.name, student.class, student.email);
        });
    } catch (err) {
        console.error("Error loading student records:", err);
    }
}

// 4. SAVE NEW STUDENT TO BACKEND DATABASE (CREATE)
saveStudentBtn.addEventListener('click', async function(e) {
    e.preventDefault();

    const studentId = studentIdInput.value.trim();
    const name = studentNameInput.value.trim();
    const studentClass = studentClassInput.value.trim();
    const email = studentEmailInput.value.trim();

    // Basic frontend checks
    if (studentId === "" || name === "" || studentClass === "" || email === "") {
        alert("Please fill out all input fields!");
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                student_id: studentId,
                name: name,
                student_class: studentClass,
                email: email
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to save student record.");
        }

        // Successfully saved in database, now update frontend table view
        appendStudentRow(studentId, name, studentClass, email);
        
        // Clean up modal popup
        clearStudentInputs();
        studentModal.style.display = 'none';
        alert(data.message);

    } catch (err) {
        alert(err.message);
    }
});

// Helper function to draw a data row inside the table
function appendStudentRow(id, name, className, email) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${className}</td>
        <td>${email}</td>
        <td>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </td>
    `;
    studentTableBody.appendChild(newRow);
}

function clearStudentInputs() {
    studentIdInput.value = "";
    studentNameInput.value = "";
    studentClassInput.value = "";
    studentEmailInput.value = "";
}
