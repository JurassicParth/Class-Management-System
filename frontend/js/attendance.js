const addBtn = document.querySelector(".add-btn");
const modal = document.getElementById("attendanceModal");
const closeBtn =
    document.getElementById("closeAttendanceModal");
const saveBtn =
    document.getElementById("saveAttendance");

let attendance =
    JSON.parse(
        localStorage.getItem("attendance")
    );

if (!attendance) {
    attendance = [];
}

addBtn.addEventListener("click", () => {

    document.getElementById(
        "attendanceStudent"
    ).value = "";

    document.getElementById(
        "attendanceDate"
    ).value = "";

    document.getElementById(
        "attendanceStatus"
    ).value = "";

    modal.style.display = "flex";

});

closeBtn.addEventListener("click", () => {

    modal.style.display = "none";

});

saveBtn.addEventListener("click", () => {

    const student =
        document.getElementById(
            "attendanceStudent"
        ).value.trim();

    const date =
        document.getElementById(
            "attendanceDate"
        ).value;

    const status =
        document.getElementById(
            "attendanceStatus"
        ).value;

    if (!student || !date || !status) {

        alert("Please fill all fields");
        return;
    }

    attendance.push({
        student,
        date,
        status
    });

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );

    renderAttendance();

    modal.style.display = "none";

});

function renderAttendance() {

    const tbody =
        document.getElementById(
            "attendanceTable"
        );

    tbody.innerHTML = "";

    attendance.forEach((record, index) => {

        tbody.innerHTML += `
            <tr>

                <td>${record.student}</td>

                <td>${record.date}</td>

                <td class="${
                    record.status === "Present"
                    ? "present"
                    : "absent"
                }">
                    ${record.status}
                </td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="deleteAttendance(${index})">

                        Delete

                    </button>

                </td>

            </tr>
        `;
    });

}

function deleteAttendance(index) {

    if (
        confirm(
            "Delete this attendance record?"
        )
    ) {

        attendance.splice(index, 1);

        localStorage.setItem(
            "attendance",
            JSON.stringify(attendance)
        );

        renderAttendance();

    }

}

document
.getElementById("searchAttendance")
.addEventListener("keyup", function () {

    const filter =
        this.value.toLowerCase();

    const rows =
        document.querySelectorAll(
            "#attendanceTable tr"
        );

    rows.forEach(row => {

        if (
            row.textContent
            .toLowerCase()
            .includes(filter)
        ) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

});

renderAttendance();
