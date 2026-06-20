// 1. SELECT ELEMENTS FROM THE HTML
const addStudentBtn = document.querySelector('.add-btn');
const studentModal = document.getElementById('studentModal');
const closeModalBtn = document.getElementById('closeModal');
const saveStudentBtn = document.getElementById('saveStudent');
const studentTableBody = document.getElementById('studentTable');

// Input fields from modal
const studentIdInput = document.getElementById('studentId');
const studentNameInput = document.getElementById('studentName');
const studentClassInput = document.getElementById('studentClass');
const studentEmailInput = document.getElementById('studentEmail');

// 2. EVENT LISTENER TO OPEN MODAL
addStudentBtn.addEventListener('click', function() {
    studentModal.style.display = 'flex'; // Show modal layout template
});

// 3. EVENT LISTENER TO CLOSE MODAL
closeModalBtn.addEventListener('click', function() {
    clearStudentInputs();
    studentModal.style.display = 'none'; // Hide modal template
});

// 4. SAVE BUTTON LOGIC
saveStudentBtn.addEventListener('click', function(e) {
    e.preventDefault(); // Stop page reload

    const id = studentIdInput.value.trim();
    const name = studentNameInput.value.trim();
    const sClass = studentClassInput.value.trim();
    const email = studentEmailInput.value.trim();

    // Field Check Guard
    if (id === "" || name === "" || sClass === "" || email === "") {
        alert("Please fill in all fields before saving.");
        return;
    }

    // Strict ID Validation: Must be "CA" followed by exactly 3 digits (e.g., CA101)
    const idPattern = /^CA\d{3}$/;
    if (!idPattern.test(id)) {
        alert("Invalid Student ID format! It must start with 'CA' followed by exactly 3 numbers (e.g., CA101).");
        return;
    }

    // 5. CREATE AND INSERT TABLE ROW
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${sClass}</td>
        <td>${email}</td>
        <td>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </td>
    `;

    studentTableBody.appendChild(newRow);

    // 6. CLEAN UP AND CLOSE
    clearStudentInputs();
    studentModal.style.display = 'none';
});

// Helper function to empty fields
function clearStudentInputs() {
    studentIdInput.value = "";
    studentNameInput.value = "";
    studentClassInput.value = "";
    studentEmailInput.value = "";
}
