// 1. SELECT THE HTML ELEMENTS WE NEED
const addAttendanceBtn = document.querySelector('.add-btn');
const attendanceModal = document.getElementById('attendanceModal');
const closeAttendanceModalBtn = document.getElementById('closeAttendanceModal');
const saveAttendanceBtn = document.getElementById('saveAttendance');
const attendanceTableBody = document.getElementById('attendanceTable');

// Input fields from the attendance modal popup box
const attendanceStudentInput = document.getElementById('attendanceStudent');
const attendanceDateInput = document.getElementById('attendanceDate');
const attendanceStatusInput = document.getElementById('attendanceStatus');

// 2. OPEN THE POPUP BOX WHEN "ADD ATTENDANCE" IS CLICKED
addAttendanceBtn.addEventListener('click', function() {
    attendanceModal.style.display = 'flex'; // Shows the modal box
});

// 3. CLOSE THE POPUP BOX WHEN "CANCEL" IS CLICKED
closeAttendanceModalBtn.addEventListener('click', function() {
    clearAttendanceInputs();
    attendanceModal.style.display = 'none'; // Hides the modal box
});

// 4. SAVE THE ATTENDANCE RECORD WHEN "SAVE" IS CLICKED
saveAttendanceBtn.addEventListener('click', function(e) {
    e.preventDefault(); // Keeps the page from reloading automatically

    // Grab values typed or selected by the user
    const student = attendanceStudentInput.value.trim();
    const date = attendanceDateInput.value;
    const status = attendanceStatusInput.value;

    // Basic Validation: Ensure no inputs are empty
    if (student === "" || date === "" || status === "") {
        alert("Please fill out all fields and select a status!");
        return;
    }

    // 5. CREATE A NEW ROW ELEMENT DYNAMICALLY
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${student}</td>
        <td>${date}</td>
        <td>${status}</td>
        <td>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </td>
    `;

    // 6. APPEND THE NEW ROW INTO YOUR TABLE BODY
    attendanceTableBody.appendChild(newRow);

    // 7. CLEAN UP THE INPUTS AND HIDE THE POPUP
    clearAttendanceInputs();
    attendanceModal.style.display = 'none';
});

// Helper function to empty out all input boxes and reset dropdown selection
function clearAttendanceInputs() {
    attendanceStudentInput.value = "";
    attendanceDateInput.value = "";
    attendanceStatusInput.value = ""; // Resets back to "Select Status"
}
