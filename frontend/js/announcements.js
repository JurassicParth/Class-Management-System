const addBtn = document.querySelector(".add-btn");

const modal =
    document.getElementById("announcementModal");

const closeBtn =
    document.getElementById("closeAnnouncementModal");

const saveBtn =
    document.getElementById("saveAnnouncement");

let announcements =
    JSON.parse(
        localStorage.getItem("announcements")
    );

if (!announcements) {
    announcements = [];
}

let editIndex = -1;

addBtn.addEventListener("click", () => {

    editIndex = -1;

    document.getElementById(
        "announcementModalTitle"
    ).textContent = "Add Announcement";

    document.getElementById(
        "announcementTitle"
    ).value = "";

    document.getElementById(
        "announcementMessage"
    ).value = "";

    document.getElementById(
        "announcementDate"
    ).value = "";

    modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {

    modal.style.display = "none";

});

saveBtn.addEventListener("click", () => {

    const title =
        document.getElementById(
            "announcementTitle"
        ).value.trim();

    const message =
        document.getElementById(
            "announcementMessage"
        ).value.trim();

    const date =
        document.getElementById(
            "announcementDate"
        ).value;

    if (!title || !message || !date) {

        alert("Please fill all fields");
        return;
    }

    const announcement = {
        title,
        message,
        date
    };

    if (editIndex === -1) {

        announcements.push(announcement);

    } else {

        announcements[editIndex] =
            announcement;

    }

    localStorage.setItem(
        "announcements",
        JSON.stringify(announcements)
    );

    renderAnnouncements();

    modal.style.display = "none";
});

function renderAnnouncements() {

    const container =
        document.getElementById(
            "announcementContainer"
        );

    container.innerHTML = "";

    announcements.forEach(
        (announcement, index) => {

        container.innerHTML += `

        <div class="announcement-card">

            <h3>${announcement.title}</h3>

            <p class="announcement-date">
                ${announcement.date}
            </p>

            <p class="announcement-message">
                ${announcement.message}
            </p>

            <div class="card-actions">

                <button
                    class="edit-btn"
                    onclick="editAnnouncement(${index})">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteAnnouncement(${index})">

                    Delete

                </button>

            </div>

        </div>
        `;
    });
}

function editAnnouncement(index) {

    editIndex = index;

    const announcement =
        announcements[index];

    document.getElementById(
        "announcementModalTitle"
    ).textContent = "Edit Announcement";

    document.getElementById(
        "announcementTitle"
    ).value = announcement.title;

    document.getElementById(
        "announcementMessage"
    ).value = announcement.message;

    document.getElementById(
        "announcementDate"
    ).value = announcement.date;

    modal.style.display = "flex";
}

function deleteAnnouncement(index) {

    if (
        confirm(
            "Delete this announcement?"
        )
    ) {

        announcements.splice(index, 1);

        localStorage.setItem(
            "announcements",
            JSON.stringify(announcements)
        );

        renderAnnouncements();
    }
}

document
.getElementById("searchAnnouncement")
.addEventListener("keyup", function () {

    const filter =
        this.value.toLowerCase();

    const cards =
        document.querySelectorAll(
            ".announcement-card"
        );

    cards.forEach(card => {

        if (
            card.textContent
            .toLowerCase()
            .includes(filter)
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

});

renderAnnouncements();
