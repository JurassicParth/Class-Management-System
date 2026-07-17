// ==========================================
// COLLEGE MANAGEMENT SYSTEM
// ANNOUNCEMENTS.JS
// ==========================================

const API = "http://127.0.0.1:5000/announcements";

// ==========================================
// ELEMENTS
// ==========================================

const tableBody = document.getElementById("announcementTable");

const modal = document.getElementById("announcementModal");

const addBtn = document.getElementById("addAnnouncementBtn");

const closeBtn = document.getElementById("closeAnnouncementModal");

const form = document.getElementById("announcementForm");

const modalTitle = document.getElementById("announcementModalTitle");

const titleInput = document.getElementById("announcementTitle");

const messageInput = document.getElementById("announcementMessage");

const dateInput = document.getElementById("announcementDate");

const toast = document.getElementById("toast");

const searchInput = document.getElementById("searchAnnouncement");

let editId = null;

// ==========================================
// TOAST
// ==========================================

function showToast(message, success = true) {

    toast.textContent = message;

    toast.className = success
        ? "toast success show"
        : "toast error show";

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}

// ==========================================
// MODAL
// ==========================================

addBtn.addEventListener("click", () => {

    editId = null;

    modalTitle.textContent = "New Announcement";

    form.reset();

    modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {

    modal.style.display = "none";
});

window.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.style.display = "none";
    }
});

// ==========================================
// LOAD ANNOUNCEMENTS
// ==========================================

async function loadAnnouncements() {

    try {

        const response = await fetch(API);

        const announcements = await response.json();

        renderTable(announcements);

    }

    catch (error) {

        console.error(error);

        showToast("Unable to connect to the server.", false);
    }
}
// ==========================================
// RENDER TABLE
// ==========================================

function renderTable(announcements) {

    tableBody.innerHTML = "";

    if (announcements.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    No announcements found.
                </td>
            </tr>
        `;

        return;
    }

    announcements.forEach((announcement) => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${announcement.title}</td>

            <td>${announcement.message.substring(0, 80)}...</td>

            <td>${announcement.announcement_date}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editAnnouncement(${announcement.id})">

                    <i class="fa-solid fa-pen"></i>

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteAnnouncement(${announcement.id})">

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

            </td>

        `;

        tableBody.appendChild(row);

    });

}

// ==========================================
// EDIT ANNOUNCEMENT
// ==========================================

async function editAnnouncement(id) {

    try {

        const response = await fetch(API);

        const announcements = await response.json();

        const announcement = announcements.find(a => a.id === id);

        if (!announcement) return;

        editId = id;

        modalTitle.textContent = "Edit Announcement";

        titleInput.value = announcement.title;

        messageInput.value = announcement.message;

        dateInput.value = announcement.announcement_date.split("T")[0];

        modal.style.display = "flex";

    }

    catch (error) {

        console.error(error);

        showToast("Unable to load announcement.", false);

    }

}

// ==========================================
// DELETE ANNOUNCEMENT
// ==========================================

async function deleteAnnouncement(id) {

    if (!confirm("Are you sure you want to delete this announcement?")) {

        return;

    }

    try {

        const response = await fetch(`${API}/${id}`, {

            method: "DELETE"

        });

        const result = await response.json();

        showToast(result.message);

        loadAnnouncements();

    }

    catch (error) {

        console.error(error);

        showToast("Unable to delete announcement.", false);

    }

}
// ==========================================
// SAVE ANNOUNCEMENT
// ==========================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const announcement = {

        title: titleInput.value.trim(),

        message: messageInput.value.trim(),

        announcement_date: dateInput.value

    };

    try {

        let response;

        if (editId === null) {

            response = await fetch(API, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(announcement)

            });

        }

        else {

            response = await fetch(`${API}/${editId}`, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(announcement)

            });

        }

        const result = await response.json();

        showToast(result.message);

        modal.style.display = "none";

        form.reset();

        editId = null;

        loadAnnouncements();

    }

    catch (error) {

        console.error(error);

        showToast("Unable to save announcement.", false);

    }

});
// ==========================================
// SEARCH ANNOUNCEMENTS
// ==========================================

searchInput.addEventListener("keyup", async () => {

    const keyword = searchInput.value.trim();

    try {

        if (keyword === "") {

            loadAnnouncements();

            return;

        }

        const response = await fetch(`${API}/search/${keyword}`);

        const announcements = await response.json();

        renderTable(announcements);

    }

    catch (error) {

        console.error(error);

        showToast("Search failed.", false);

    }

});

// ==========================================
// INITIALIZE
// ==========================================

loadAnnouncements();