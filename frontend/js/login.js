// ======================================
// COLLEGE MANAGEMENT SYSTEM
// LOGIN.JS
// ======================================

const loginForm = document.getElementById("loginForm");
const toast = document.getElementById("toast");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

// ======================================
// SHOW TOAST
// ======================================

function showToast(message, success = true) {
  toast.textContent = message;

  toast.style.background = success ? "#16a34a" : "#dc2626";

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ======================================
// SHOW / HIDE PASSWORD
// ======================================

togglePassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";

    togglePassword.classList.remove("fa-eye");
    togglePassword.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";

    togglePassword.classList.remove("fa-eye-slash");
    togglePassword.classList.add("fa-eye");
  }
});

// ======================================
// LOGIN
// ======================================

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();

  const password = passwordInput.value.trim();

  if (!username || !password) {
    showToast("Please enter username and password.", false);

    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showToast("Login Successful!");

      localStorage.setItem("loggedInUser", username);

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1200);
    } else {
      showToast(
        data.message || "Invalid username or password.",

        false,
      );
    }
  } catch (error) {
    console.error(error);

    showToast(
      "Unable to connect to server.",

      false,
    );
  }
});
