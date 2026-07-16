// ======================================
// COLLEGE MANAGEMENT SYSTEM
// SIGNUP.JS
// ======================================

const signupForm = document.getElementById("signupForm");
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

    togglePassword.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    passwordInput.type = "password";

    togglePassword.classList.replace("fa-eye-slash", "fa-eye");
  }
});

// ======================================
// SIGNUP
// ======================================

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();

  const email = document.getElementById("email").value.trim();

  const password = passwordInput.value.trim();

  if (!username || !email || !password) {
    showToast("Please fill all fields.", false);

    return;
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:5000/signup",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          email,
          password,
        }),
      },
    );

    const data = await response.json();

    if (response.ok && data.success) {
      showToast("Account created successfully!");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      showToast(
        data.message || "Signup failed.",

        false,
      );
    }
  } catch (error) {
    console.error(error);

    showToast("Unable to connect to the server.", false);
  }
});
