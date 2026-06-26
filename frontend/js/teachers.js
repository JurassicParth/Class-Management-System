// DOM References
let teacherTable;
let teacherModal;
let modalTitle;
let searchTeacher;

// Form Inputs
let teacherIdInput;
let teacherNameInput;
let teacherSubjectSelect;
let teacherEmailInput;

// Buttons
let addBtn;
let saveTeacherBtn;
let closeTeacherModalBtn;

let isEditMode = false;
let currentEditId = null;

document.addEventListener("DOMContentLoaded", () => {
    // Look up DOM elements accurately
    teacherTable = document.getElementById("teacherTable");
    teacherModal = document.getElementById("teacherModal");
    modalTitle = document.getElementById("modalTitle");
    searchTeacher = document.getElementById("searchTeacher");

    teacherIdInput = document.getElementById("teacherId");
    teacherNameInput = document.getElementById("teacherName");
    teacherSubjectSelect = document.getElementById("teacherAssignedSubject");
    teacherEmailInput = document.getElementById("teacherEmail");

    addBtn = document.querySelector(".add-btn");
    saveTeacherBtn = document.getElementById("saveTeacher");
    closeTeacherModalBtn = document.getElementById("closeTeacherModal");

    // Load initial list rows
    loadTeachersList();

    // Event Wireups
    if (addBtn) addBtn.addEventListener("click", openAddModal);
    if (closeTeacherModalBtn) closeTeacherModalBtn.addEventListener("click", closeFormModal);
    if (saveTeacherBtn) saveTeacherBtn.addEventListener("click", handleSaveData);
    if (searchTeacher) searchTeacher.addEventListener("input", filterTableData);
});

// 1. FETCH ALL TEACHERS FROM FLASK API
async function loadTeachersList() {
    try {
        const response = await fetch("http://127.0.0.1:8080/teachers");
        if (!response.ok) throw new Error("Failed to reach teacher API endpoint");
        
        const data = await response.json();
        renderTableRows(data);
    } catch (err) {
        console.error("Error loading teacher rows:", err);
        if (teacherTable) {
            teacherTable.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Could not load teacher database records.</td></tr>`;
        }
    }
}

// 2. RENDER RECORDS IN HTML DATATABLE
function renderTableRows(teachersArray) {
    if (!teacherTable) return;
    teacherTable.innerHTML = "";
    
    if (teachersArray.length === 0) {
        teacherTable.innerHTML = `<tr><td colspan="5" style="text-align:center;">No teacher records found. Click 'Add Teacher' to create one!</td></tr>`;
        return;
    }

    teachersArray.forEach(teacher => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${teacher.id}</td>
            <td>${teacher.name}</td>
            <td>${teacher.subject || 'Not Assigned'}</td>
            <td>${teacher.email}</td>
            <td>
                <button class="edit-btn" onclick="openEditModal('${teacher.id}', '${teacher.name}', '${teacher.subject}', '${teacher.email}')" style="background:#2563eb; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; margin-right:5px;"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteTeacherRecord('${teacher.id}')" style="background:#ef4444; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash"></i></button>
            </td>
        `;
        teacherTable.appendChild(row);
    });
}

// 3. OPEN MODAL BOX FOR ADD ACTION
function openAddModal() {
    isEditMode = false;
    currentEditId = null;
    if (modalTitle) modalTitle.textContent = "Add Teacher";
    if (teacherIdInput) teacherIdInput.disabled = false;
    clearFormFields();
    if (teacherModal) teacherModal.style.display = "flex";
}

// 4. OPEN MODAL BOX FOR EDIT ACTION
window.openEditModal = function(id, name, subject, email) {
    isEditMode = true;
    currentEditId = id;
    if (modalTitle) modalTitle.textContent = "Edit Teacher Profile";
    
    if (teacherIdInput) {
        teacherIdInput.value = id;
        teacherIdInput.disabled = true;
    }
    if (teacherNameInput) teacherNameInput.value = name;
    if (teacherSubjectSelect) teacherSubjectSelect.value = subject;
    if (teacherEmailInput) teacherEmailInput.value = email;
    
    if (teacherModal) teacherModal.style.display = "flex";
};

function closeFormModal() {
    if (teacherModal) teacherModal.style.display = "none";
    clearFormFields();
}

function clearFormFields() {
    if (teacherIdInput) teacherIdInput.value = "";
    if (teacherNameInput) teacherNameInput.value = "";
    if (teacherSubjectSelect) teacherSubjectSelect.value = "";
    if (teacherEmailInput) teacherEmailInput.value = "";
}

// 5. POST SUBMISSION DATA ASSEMBLY
async function handleSaveData(e) {
    e.preventDefault();

    const idValue = teacherIdInput ? teacherIdInput.value.trim() : "";
    const nameValue = teacherNameInput ? teacherNameInput.value.trim() : "";
    const subjectValue = teacherSubjectSelect ? teacherSubjectSelect.value : "";
    const emailValue = teacherEmailInput ? teacherEmailInput.value.trim() : "";

    if (!idValue || !nameValue || !subjectValue || !emailValue) {
        alert("Please completely fill out all input fields.");
        return;
    }

    const payload = {
        id: idValue,
        name: nameValue,
        subject: subjectValue,
        email: emailValue
    };

    const targetUrl = isEditMode 
        ? `http://127.0.0.1:8080/teachers/${currentEditId}` 
        : `http://127.0.0.1:8080/teachers`;
        
    const targetMethod = isEditMode ? "PUT" : "POST";

    try {
        const response = await fetch(targetUrl, {
            method: targetMethod,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || "Operation successful!");
            closeFormModal();
            loadTeachersList();
        } else {
            alert(result.error || "An integration hurdle occurred.");
        }
    } catch (err) {
        console.error("Network interface pipeline error:", err);
        alert("Could not communicate with backend database links.");
    }
}

// 6. DELETE TEACHER FROM DATASTREAM
window.deleteTeacherRecord = async function(teacherId) {
    if (!confirm(`Are you absolutely sure you want to remove teacher entry: ${teacherId}?`)) return;

    try {
        const response = await fetch(`http://127.0.0.1:8080/teachers/${teacherId}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || "Record successfully cleared out.");
            loadTeachersList();
        } else {
            alert(result.error || "Could not execute structural record delete query.");
        }
    } catch (err) {
        console.error("Deletion communication error:", err);
    }
};

// 7. CLIENT UI SEARCH TABLE FILTERS
function filterTableData() {
    if (!searchTeacher || !teacherTable) return;
    const filterText = searchTeacher.value.toLowerCase();
    const tableRows = teacherTable.getElementsByTagName("tr");

    for (let row of tableRows) {
        const cells = row.getElementsByTagName("td");
        if (cells.length < 4) continue;
        
        const matchesId = cells[0].textContent.toLowerCase().includes(filterText);
        const matchesName = cells[1].textContent.toLowerCase().includes(filterText);
        const matchesSubject = cells[2].textContent.toLowerCase().includes(filterText);
        const matchesEmail = cells[3].textContent.toLowerCase().includes(filterText);

        if (matchesId || matchesName || matchesSubject || matchesEmail) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }
}
