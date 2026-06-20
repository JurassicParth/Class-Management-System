// 1. SELECT ALL THE ELEMENTS WE NEED FROM THE HTML
const addMarksBtn = document.querySelector('.add-btn');
const marksModal = document.getElementById('marksModal');
const closeMarksModalBtn = document.getElementById('closeMarksModal');
const saveMarksBtn = document.getElementById('saveMarks');
const marksTableBody = document.getElementById('marksTable');

// Input fields from the modal
const studentNameInput = document.getElementById('studentName');
const subjectNameInput = document.getElementById('subjectName');
const marksObtainedInput = document.getElementById('marksObtained');
const totalMarksInput = document.getElementById('totalMarks');

// 2. EVENT LISTENER TO OPEN THE MODAL
addMarksBtn.addEventListener('click', function() {
    marksModal.style.display = 'flex'; // Shows the popup box
});

// 3. EVENT LISTENER TO CLOSE THE MODAL (CANCEL)
closeMarksModalBtn.addEventListener('click', function() {
    clearModalInputs();
    marksModal.style.display = 'none'; // Hides the popup box
});

// 4. EVENT LISTENER FOR THE SAVE BUTTON
saveMarksBtn.addEventListener('click', function(e) {
    e.preventDefault(); // Stops page from reloading

    // Grab values from inputs
    const student = studentNameInput.value.trim();
    const subject = subjectNameInput.value.trim();
    const obtained = parseFloat(marksObtainedInput.value);
    const total = parseFloat(totalMarksInput.value);

    // Basic Validation: Ensure no fields are empty
    if (student === "" || subject === "" || isNaN(obtained) || isNaN(total)) {
        alert("Please fill out all the fields correctly!");
        return; 
    }

    // Advanced Validation: Obtained marks shouldn't exceed total marks
    if (obtained > total) {
        alert("Marks obtained cannot be greater than total marks!");
        return;
    }

    // 5. CALCULATE PERCENTAGE AND GRADE
    const percentage = ((obtained / total) * 100).toFixed(2); // Rounds to 2 decimal places
    let grade = "";

    if (percentage >= 90) {
        grade = "A+";
    } else if (percentage >= 80) {
        grade = "A";
    } else if (percentage >= 70) {
        grade = "B";
    } else if (percentage >= 50) {
        grade = "C";
    } else {
        grade = "Fail";
    }

    // 6. CREATE A NEW ROW AND INSERT IT INTO THE TABLE
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${student}</td>
        <td>${subject}</td>
        <td>${obtained}</td>
        <td>${total}</td>
        <td>${percentage}%</td>
        <td>${grade}</td>
        <td>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </td>
    `;

    // Append our new row to the table body container
    marksTableBody.appendChild(newRow);

    // 7. HIDE MODAL AND CLEAN UP FIELDS FOR NEXT TIME
    clearModalInputs();
    marksModal.style.display = 'none';
});

// Helper function to empty out the boxes after saving or canceling
function clearModalInputs() {
    studentNameInput.value = "";
    subjectNameInput.value = "";
    marksObtainedInput.value = "";
    totalMarksInput.value = "";
}
