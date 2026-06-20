// 1. SELECT THE HTML ELEMENTS WE NEED
const addAnnouncementBtn = document.querySelector('.add-btn');
const announcementModal = document.getElementById('announcementModal');
const closeAnnouncementModalBtn = document.getElementById('closeAnnouncementModal');
const saveAnnouncementBtn = document.getElementById('saveAnnouncement');
const announcementContainer = document.getElementById('announcementContainer');

// Input fields inside the announcement popup modal box
const announcementTitleInput = document.getElementById('announcementTitle');
const announcementMessageInput = document.getElementById('announcementMessage');
const announcementDateInput = document.getElementById('announcementDate');

// 2. OPEN THE POPUP BOX WHEN "ADD ANNOUNCEMENT" IS CLICKED
addAnnouncementBtn.addEventListener('click', function() {
    announcementModal.style.display = 'flex'; // Shows the modal box cleanly
});

// 3. CLOSE THE POPUP BOX WHEN "CANCEL" IS CLICKED
closeAnnouncementModalBtn.addEventListener('click', function() {
    clearAnnouncementInputs();
    announcementModal.style.display = 'none'; // Hides the modal box
});

// 4. SAVE THE NOTICE CARD WHEN "SAVE" IS CLICKED
saveAnnouncementBtn.addEventListener('click', function(e) {
    e.preventDefault(); // Prevents browser from reloading the page

    // Grab values typed or selected by the admin
    const title = announcementTitleInput.value.trim();
    const message = announcementMessageInput.value.trim();
    const date = announcementDateInput.value;

    // Basic Validation: Stop if any details are missing
    if (title === "" || message === "" || date === "") {
        alert("Please fill out the title, message, and select a date!");
        return;
    }

    // 5. CREATE A NEW CARD DIV ELEMENT DYNAMICALLY
    const newCard = document.createElement('div');
    newCard.className = 'feature-card'; // Reuses your awesome grid card styles!
    newCard.style.textAlign = 'left';   // Align text to the left for clean reading
    
    // Inject the structured layout text safely
    newCard.innerHTML = `
        <h3 style="color: #2563eb; margin-bottom: 5px;">${title}</h3>
        <small style="color: #94a3b8; display: block; margin-bottom: 15px;">
            <i class="fas fa-calendar-alt"></i> Posted on: ${date}
        </small>
        <p style="color: #475569; line-height: 1.6;">${message}</p>
        <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
            <button class="edit-btn" style="padding: 6px 12px; font-size: 0.85rem;">Edit</button>
            <button class="delete-btn" style="padding: 6px 12px; font-size: 0.85rem;">Delete</button>
        </div>
    `;

    // 6. APPEND THE NEW BULLETIN CARD INTO YOUR CONTAINER GRID AREA
    announcementContainer.appendChild(newCard);

    // 7. WIPE THE INPUT BOXES CLEAN AND DISMISS MODAL
    clearAnnouncementInputs();
    announcementModal.style.display = 'none';
});

// Helper function to empty out all the form input boxes
function clearAnnouncementInputs() {
    announcementTitleInput.value = "";
    announcementMessageInput.value = "";
    announcementDateInput.value = "";
}
