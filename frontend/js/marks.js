let marks = JSON.parse(localStorage.getItem("marks")) || [];
let editIndex = -1;

const marksTable = document.getElementById("marksTable");
const modal = document.getElementById("marksModal");
const addBtn = document.getElementById("addMarksBtn");
const saveBtn = document.getElementById("saveMarks");
const closeBtn = document.getElementById("closeModal");
const searchInput = document.getElementById("searchMarks");

function calculateGrade(percentage) 
{
    if (percentage >= 90) 
    {
        return "A+";
    }
    if (percentage >= 80) 
    {
        return "A";
    }
    if (percentage >= 70) 
    {
        return "B";
    }
    if (percentage >= 60) 
    {
        return "C";
    }
    if (percentage >= 50) 
    {
        return "D";
    }
    return "F";
}

function renderMarks(data = marks) 
{
    marksTable.innerHTML = "";
    data.forEach((mark, index) => {
        marksTable.innerHTML += `
        <tr>
            <td>${mark.id}</td>
            <td>${mark.name}</td>
            <td>${mark.subject}</td>
            <td>${mark.obtained}</td>
            <td>${mark.total}</td>
            <td>${mark.percentage}%</td>
            <td>${mark.grade}</td>

            <td>
                <button
                    class="edit-btn"
                    onclick="editMark(${index})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteMark(${index})">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });
}

addBtn.onclick = () => {
    modal.style.display = "flex";
    editIndex = -1;
};

closeBtn.onclick = () => {
    modal.style.display = "none";
};

saveBtn.onclick = () => {
    const id = document.getElementById("studentId").value;
    const name = document.getElementById("studentName").value;
    const subject = document.getElementById("subject").value;
    const obtained = Number(document.getElementById("marksObtained").value);
    const total = Number(document.getElementById("totalMarks").value);
    const percentage = ((obtained / total) * 100).toFixed(2);
    const grade = calculateGrade(percentage);
    const markData = {id, name, subject, obtained, total, percentage, grade};

    if (editIndex === -1) 
    {
        marks.push(markData);
    } 
    else 
    {
        marks[editIndex] = markData;
    }

    localStorage.setItem(
        "marks",
        JSON.stringify(marks)
    );

    renderMarks();

    modal.style.display = "none";
};

function deleteMark(index)
{
    if(confirm("Delete this record?"))
    {
        marks.splice(index, 1);
        localStorage.setItem("marks", JSON.stringify(marks));
        renderMarks();
    }
}

function editMark(index)
{
    editIndex = index;
    let mark = marks[index];
    document.getElementById("studentId").value = mark.id;
    document.getElementById("studentName").value = mark.name;
    document.getElementById("subject").value = mark.subject;
    document.getElementById("marksObtained").value = mark.obtained;
    document.getElementById("totalMarks").value = mark.total;
    modal.style.display = "flex";
}

searchInput.addEventListener("keyup", () => {
    let value = searchInput.value.toLowerCase();
    let filtered = marks.filter(mark => mark.name.toLowerCase().includes(value));
    renderMarks(filtered);
});

renderMarks();
