// Dom References
const studentTable = document.getElementById("studentTable");
const studentModal = document.getElementById("studentModal");
const modalTitle = document.getElementById("modalTitle");
const searchStudent = document.getElementById("searchStudent");

// Form Inputs
const studentIdInput = document.getElementById("studentId");
const studentNameInput = document.getElementById("studentName");
const studentClassInput = document.getElementById("studentClass");
const studentEmailInput = document.getElementById("studentEmail");

// Buttons
const addBtn = document.querySelector(".add-btn");
const saveStudentBtn = document.getElementById("saveStudent");
const closeModalBtn = document.getElementById("closeModal");

let isEditMode = false;
let currentEditId = null;

// Initial Load Tracking
document.addEventListener("DOMContentLoaded", () => {
    loadStudentsList();
    
    // Event Wireups
    if (addBtn) addBtn.addEventListener("click", openAddModal);
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeFormModal);
    if (saveStudentBtn) saveStudentBtn.addEventListener("click", handleSaveData);
    if (searchStudent) searchStudent.addEventListener("input", filterTableData);
});

// 1. FETCH ALL RECORDS FROM BACKEND DB
async function loadStudentsList() {
    try {
        const response = await fetch("http://127.0.0.1:8080/students");
        if (!response.ok) throw new Error("Failed to reach student API endpoint");
        
        const data = await response.json();
        renderTableRows(data);
    } catch (err) {
        console.error("Error loading table data rows:", err);
        studentTable.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Could not load student database records.</td></tr>`;
    }
}

// 2. RENDER THE DATABASE DATA INTO THE TABLE
function renderTableRows(studentsArray) {
    studentTable.innerHTML = "";
    
    if (studentsArray.length === 0) {
        studentTable.innerHTML = `<tr><td colspan="5" style="text-align:center;">No student records found in your database. Click 'Add Student' to insert one!</td></tr>`;
        return;
    }

    studentsArray.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>${student.email}</td>
            <td>
                <button class="edit-btn" onclick="openEditModal('${student.id}', '${student.name}', '${student.class}', '${student.email}')" style="background:#2563eb; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; margin-right:5px;"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteStudentRecord('${student.id}')" style="background:#ef4444; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash"></i></button>
            </td>
        `;
        studentTable.appendChild(row);
    });
}

// 3. OPEN MODAL FOR ADDING
function openAddModal() {
    isEditMode = false;
    currentEditId = null;
    modalTitle.textContent = "Add Student";
    studentIdInput.disabled = false;
    clearFormFields();
    studentModal.style.display = "flex";
}

// 4. OPEN MODAL FOR EDITING
window.openEditModal = function(id, name, className, email) {
    isEditMode = true;
    currentEditId = id;
    modalTitle.textContent = "Edit Student Profile";
    
    studentIdInput.value = id;
    studentIdInput.disabled = true; // Keep primary keys protected
    studentNameInput.value = name;
    studentClassInput.value = className;
    studentEmailInput.value = email;
    
    studentModal.style.display = "flex";
};

function closeFormModal() {
    studentModal.style.display = "none";
    clearFormFields();
}

function clearFormFields() {
    studentIdInput.value = "";
    studentNameInput.value = "";
    studentClassInput.value = "";
    studentEmailInput.value = "";
}

// 5. SAVE DATA (POST OR PUT SUBMISSION HANDLING)
async function handleSaveData(e) {
    e.preventDefault();

    const idValue = studentIdInput.value.trim();
    const nameValue = studentNameInput.value.trim();
    const classValue = studentClassInput.value.trim();
    const emailValue = studentEmailInput.value.trim();

    // Structural input validation check
    if (!idValue || !nameValue || !classValue || !emailValue) {
        alert("Please completely fill out all input boxes.");
        return;
    }

    // SRN Validation match layout check: Must be 'CA' followed by exactly 3 digits
    const idRegex = /^CA\d{3}$/;
    if (!idRegex.test(idValue)) {
        alert("Invalid Student ID format. Must be 'CA' followed by exactly 3 numeric digits (e.g., CA101).");
        return;
    }

    const payload = {
        id: idValue,
        name: nameValue,
        class: classValue,
        email: emailValue
    };

    const targetUrl = isEditMode 
        ? `http://127.0.0.1:8080/students/${currentEditId}` 
        : `http://127.0.0.1:8080/students`;
        
    const targetMethod = isEditMode ? "PUT" : "POST";

    try {
        const response = await fetch(targetUrl, {
            method: targetMethod,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || "Operation processed successfully!");
            closeFormModal();
            loadStudentsList(); // Auto update live tables view layout instantly
        } else {
            alert(result.error || "An backend error occurred.");
        }
    } catch (err) {
        console.error("Networking connection transaction failed:", err);
        alert("Could not reach backend API processes server configuration setups.");
    }
}

// 6. DELETE SELECTION SUBMISSION PIPELINE WIRING
window.deleteStudentRecord = async function(studentId) {
    if (!confirm(`Are you absolutely sure you want to remove student profile entry: ${studentId}?`)) return;

    try {
        const response = await fetch(`http://127.0.0.1:8080/students/${studentId}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || "Record successfully cleared out.");
            loadStudentsList();
        } else {
            alert(result.error || "Could not complete deletion target pipeline requests.");
        }
    } catch (err) {
        console.error("Operation transaction failed connection properties tracking:", err);
    }
};

// 7. LOCALS FRONTEND UI DINAMIC INPUT TEXT FILTERS MAPPING
function filterTableData() {
    const filterText = searchStudent.value.toLowerCase();
    const tableRows = studentTable.getElementsByTagName("tr");

    for (let row of tableRows) {
        const cells = row.getElementsByTagName("td");
        if (cells.length < 4) continue; // Skip informational or error single-cell alert placeholders
        
        const matchesId = cells[0].textContent.toLowerCase().includes(filterText);
        const matchesName = cells[1].textContent.toLowerCase().includes(filterText);
        const matchesClass = cells[2].textContent.toLowerCase().includes(filterText);
        const matchesEmail = cells[3].textContent.toLowerCase().includes(filterText);

        if (matchesId || matchesName || matchesClass || matchesEmail) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }
}
