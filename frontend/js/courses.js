// 1. SELECT ALL HTML ELEMENTS
const addCourseBtn = document.querySelector('.add-btn');
const courseModal = document.getElementById('courseModal');
const closeCourseModalBtn = document.getElementById('closeCourseModal');
const saveCourseBtn = document.getElementById('saveCourse');
const courseTableBody = document.getElementById('courseTable');

// Input fields including our new Class selector
const courseClassStandardInput = document.getElementById('courseClassStandard');
const courseIdInput = document.getElementById('courseId');
const courseNameInput = document.getElementById('courseName');
const courseDurationInput = document.getElementById('courseDuration');
const courseTeacherInput = document.getElementById('courseTeacher');

// 2. OPEN AND CLOSE MODAL BOX FUNCTIONS
addCourseBtn.addEventListener('click', function() {
    courseModal.style.display = 'flex';
});

closeCourseModalBtn.addEventListener('click', function() {
    clearCourseInputs();
    courseModal.style.display = 'none';
});

// 3. SAVE SUBJECT ROUTINE (CREATE & READ)
saveCourseBtn.addEventListener('click', function(e) {
    e.preventDefault();

    const classStandard = courseClassStandardInput.value;
    const id = courseIdInput.value.trim();
    const name = courseNameInput.value.trim();
    const duration = courseDurationInput.value.trim();
    const teacher = courseTeacherInput.value.trim();

    if (classStandard === "" || id === "" || name === "" || duration === "" || teacher === "") {
        alert("Please fill out all field paths before continuing.");
        return;
    }

    // Create entry row
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${id}</td>
        <td><strong>${classStandard}</strong> - ${name}</td>
        <td>${duration}</td>
        <td>${teacher}</td>
        <td>
            <button class="delete-btn grid-delete-btn" style="padding: 6px 12px; background-color: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
        </td>
    `;

    courseTableBody.appendChild(newRow);

    // Close and reset
    clearCourseInputs();
    courseModal.style.display = 'none';
});

// 4. DELETE SELECTION LOGIC (DELETE)
// Using an event listener on the table body to catch delete clicks instantly
courseTableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('grid-delete-btn')) {
        if (confirm("Are you sure you want to remove this subject definition?")) {
            const rowSelected = e.target.closest('tr');
            rowSelected.remove();
        }
    }
});

function clearCourseInputs() {
    courseClassStandardInput.value = "";
    courseIdInput.value = "";
    courseNameInput.value = "";
    courseDurationInput.value = "";
    courseTeacherInput.value = "";
}
