// 1. SELECT ALL THE ELEMENTS WE NEED FROM THE HTML
const addTeacherBtn = document.querySelector('.add-btn');
const teacherModal = document.getElementById('teacherModal');
const closeTeacherModalBtn = document.getElementById('closeTeacherModal');
const saveTeacherBtn = document.getElementById('saveTeacher');
const teacherTableBody = document.getElementById('teacherTable');

// Input fields inside our modified layout popup box
const teacherIdInput = document.getElementById('teacherId');
const teacherNameInput = document.getElementById('teacherName');
const teacherClassInput = document.getElementById('teacherAssignedClass');
const teacherSubjectInput = document.getElementById('teacherAssignedSubject');
const teacherEmailInput = document.getElementById('teacherEmail');

// 2. OPEN THE MODAL POPUP WHEN "ADD TEACHER" IS CLICKED
addTeacherBtn.addEventListener('click', function() {
    teacherModal.style.display = 'flex'; // Shows the popup box
});

// 3. CLOSE THE MODAL POPUP WHEN "CANCEL" IS CLICKED
closeTeacherModalBtn.addEventListener('click', function() {
    clearTeacherInputs();
    teacherModal.style.display = 'none'; // Hides the popup box
});

// 4. SAVE AND DISCARD INTERACTIVE COMPONENT ACTION ROUTINES (CREATE & READ)
saveTeacherBtn.addEventListener('click', function(e) {
    e.preventDefault(); // Prevents page reload

    // Grab the values typed/selected by the user
    const id = teacherIdInput.value.trim();
    const name = teacherNameInput.value.trim();
    const assignedClass = teacherClassInput.value;
    const assignedSubject = teacherSubjectInput.value;
    const email = teacherEmailInput.value.trim();

    // Check if any options are left unselected
    if (id === "" || name === "" || assignedClass === "" || assignedSubject === "" || email === "") {
        alert("Please fill out all fields and complete assignments before saving.");
        return;
    }

    // 5. CREATE A NEW ROW ELEMENT DYNAMICALLY
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td><strong>${assignedClass}</strong> - ${assignedSubject}</td>
        <td>${email}</td>
        <td>
            <button class="delete-btn grid-delete-btn" style="padding: 6px 12px; background-color: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
        </td>
    `;

    // 6. APPEND THE ROW DIRECTLY INTO YOUR TABLE BODY CONTAINER
    teacherTableBody.appendChild(newRow);

    // 7. HIDE MODAL AND WIPE BOXES CLEAN FOR NEXT TIME
    clearTeacherInputs();
    teacherModal.style.display = 'none';
});

// 8. INTERACTIVE DELETE HANDLER (DELETE)
teacherTableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('grid-delete-btn')) {
        if (confirm("Are you sure you want to remove this teacher record and assignments?")) {
            const rowTarget = e.target.closest('tr');
            rowTarget.remove(); // Drops the row dynamically out of your dashboard table view
        }
    }
});

// Helper function to empty out all input selections
function clearTeacherInputs() {
    teacherIdInput.value = "";
    teacherNameInput.value = "";
    teacherClassInput.value = "";
    teacherSubjectInput.value = "";
    teacherEmailInput.value = "";
}
