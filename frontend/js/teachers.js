// 1. SELECT ALL THE ELEMENTS WE NEED FROM THE HTML
const addTeacherBtn = document.querySelector('.add-btn');
const teacherModal = document.getElementById('teacherModal');
const closeTeacherModalBtn = document.getElementById('closeTeacherModal');
const saveTeacherBtn = document.getElementById('saveTeacher');
const teacherTableBody = document.getElementById('teacherTable');

// Input fields inside the modal popup box
const teacherIdInput = document.getElementById('teacherId');
const teacherNameInput = document.getElementById('teacherName');
const teacherSubjectInput = document.getElementById('teacherSubject');
const teacherEmailInput = document.getElementById('teacherEmail');

// 2. OPEN THE MODAL POPUP WHEN "ADD TEACHER" IS CLICKED
addTeacherBtn.addEventListener('click', function() {
    teacherModal.style.display = 'flex'; // Shows the modal box
});

// 3. CLOSE THE MODAL POPUP WHEN "CANCEL" IS CLICKED
closeTeacherModalBtn.addEventListener('click', function() {
    clearTeacherInputs();
    teacherModal.style.display = 'none'; // Hides the modal box
});

// 4. SAVE THE DETAILS WHEN "SAVE" IS CLICKED
saveTeacherBtn.addEventListener('click', function(e) {
    e.preventDefault(); // Prevents the browser from reloading the page

    // Grab the values typed in by the user
    const id = teacherIdInput.value.trim();
    const name = teacherNameInput.value.trim();
    const subject = teacherSubjectInput.value.trim();
    const email = teacherEmailInput.value.trim();

    // Basic Validation Check: Ensure no empty boxes are submitted
    if (id === "" || name === "" || subject === "" || email === "") {
        alert("Please fill out all fields before saving!");
        return;
    }

    // 5. CREATE A NEW ROW ELEMENT DYNAMICALLY
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${subject}</td>
        <td>${email}</td>
        <td>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </td>
    `;

    // 6. APPEND THE ROW DIRECTLY INTO YOUR TABLE BODY CONTAINER
    teacherTableBody.appendChild(newRow);

    // 7. HIDE MODAL AND WIPE BOXES CLEAN FOR NEXT TIME
    clearTeacherInputs();
    teacherModal.style.display = 'none';
});

// Helper function to empty out all the text input fields
function clearTeacherInputs() {
    teacherIdInput.value = "";
    teacherNameInput.value = "";
    teacherSubjectInput.value = "";
    teacherEmailInput.value = "";
}
