// ==========================================================================
// 1. SELECTING ALL REQUIRED HTML ELEMENTS
// ==========================================================================
const addStudentBtn = document.querySelector('.add-btn');
const studentModal = document.getElementById('studentModal');
const closeModalBtn = document.getElementById('closeModal');
const saveStudentBtn = document.getElementById('saveStudent');
const studentTableBody = document.getElementById('studentTable');
const searchInput = document.getElementById('searchStudent');

// Modal Input Fields
const studentIdInput = document.getElementById('studentId');
const studentNameInput = document.getElementById('studentName');
const studentClassInput = document.getElementById('studentClass');
const studentEmailInput = document.getElementById('studentEmail');

// Variable to keep track of whether we are editing a student or adding a new one
let editIndex = -1;

// ==========================================================================
// 2. MODAL VISIBILITY FUNCTIONS (OPEN / CLOSE)
// ==========================================================================

// Open Modal when "Add Student" is clicked
addStudentBtn.addEventListener('click', function() {
    editIndex = -1; // Reset to -1 so it knows we are adding new, not editing
    document.getElementById('modalTitle').innerText = "Add Student";
    clearModalInputs();
    studentModal.style.display = 'flex';
});

// Close Modal when "Cancel" is clicked
closeModalBtn.addEventListener('click', function() {
    clearModalInputs();
    studentModal.style.display = 'none';
});

// Close Modal if user clicks anywhere outside the form container box
window.addEventListener('click', function(event) {
    if (event.target === studentModal) {
        clearModalInputs();
        studentModal.style.display = 'none';
    }
});

// Helper function to empty out fields for next time
function clearModalInputs() {
    studentIdInput.value = "";
    studentNameInput.value = "";
    studentClassInput.value = "";
    studentEmailInput.value = "";
}

// ==========================================================================
// 3. CORE LOGIC - SAVING & RENDERING DATA WITH LOCALSTORAGE
// ==========================================================================

// Load and render students from localStorage as soon as the page opens
document.addEventListener('DOMContentLoaded', displayStudents);

// Function to pull data from browser memory and populate the table
function displayStudents() {
    // Fetch the student array from storage (fallback to empty list if none exist)
    const studentsList = JSON.parse(localStorage.getItem('students')) || [];
    
    // Clear the table body first to prevent duplication
    studentTableBody.innerHTML = "";

    // Loop through each student item and generate a table row
    studentsList.forEach(function(student, index) {
        const row = document.createElement('tr');
        
        // ADDED BOTH EDIT AND DELETE BUTTONS BACK HERE
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>${student.email}</td>
            <td>
                <button class="edit-btn" onclick="openEditModal(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteStudent(${index})">Delete</button>
            </td>
        `;
        
        studentTableBody.appendChild(row);
    });
}

// Function triggered when clicking the "Save" button
saveStudentBtn.addEventListener('click', function(e) {
    e.preventDefault(); // Prevents page from refreshing unexpectedly

    // Grab values from form inputs
    const idValue = studentIdInput.value.trim();
    const nameValue = studentNameInput.value.trim();
    const classValue = studentClassInput.value.trim();
    const emailValue = studentEmailInput.value.trim();

    // Validation check: Ensure no empty inputs
    if (idValue === "" || nameValue === "" || classValue === "" || emailValue === "") {
        alert("Please fill out all the student details before saving!");
        return;
    }

    // Build a structured object for our student
    const studentData = {
        id: idValue,
        name: nameValue,
        class: classValue,
        email: emailValue
    };

    let currentStudents = JSON.parse(localStorage.getItem('students')) || [];

    if (editIndex === -1) {
        // Mode: Adding a brand new student
        currentStudents.push(studentData);
    } else {
        // Mode: Overwriting an existing student at the tracked edit index position
        currentStudents[editIndex] = studentData;
    }

    // Save back to memory
    localStorage.setItem('students', JSON.stringify(currentStudents));

    // Refresh layout, reset inputs, and close window panel
    displayStudents();
    clearModalInputs();
    studentModal.style.display = 'none';
});

// Function to open modal and pre-fill fields when clicking "Edit"
function openEditModal(index) {
    let currentStudents = JSON.parse(localStorage.getItem('students')) || [];
    const student = currentStudents[index];

    // Set tracker to the item we clicked
    editIndex = index;

    // Change title text so user knows they are updating records
    document.getElementById('modalTitle').innerText = "Edit Student Details";

    // Pre-fill fields with existing values
    studentIdInput.value = student.id;
    studentNameInput.value = student.name;
    studentClassInput.value = student.class;
    studentEmailInput.value = student.email;

    // Open the popup box panel
    studentModal.style.display = 'flex';
}

// Function to delete a student record by its placement position index
function deleteStudent(index) {
    if (confirm("Are you sure you want to remove this student record?")) {
        let currentStudents = JSON.parse(localStorage.getItem('students')) || [];
        
        // Splice removes exactly 1 element at the given index position
        currentStudents.splice(index, 1);
        
        // Push the altered array back to memory storage
        localStorage.setItem('students', JSON.stringify(currentStudents));
        
        // Refresh the visual display
        displayStudents();
    }
}

// ==========================================================================
// 4. SEARCH & FILTERING LOGIC
// ==========================================================================
searchInput.addEventListener('keyup', function() {
    const query = searchInput.value.toLowerCase();
    const rows = studentTableBody.getElementsByTagName('tr');

    // Loop through each row in the table body
    for (let i = 0; i < rows.length; i++) {
        const rowText = rows[i].textContent.toLowerCase();
        
        // If the row text includes our typed search characters, keep it visible
        if (rowText.includes(query)) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none"; // Hide row from list view
        }
    }
});
