// ======================================
// COLLEGE MANAGEMENT SYSTEM
// HOME.JS
// ======================================

document.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // Mobile Menu
  // ==============================

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // ==============================
  // Sticky Navbar Shadow
  // ==============================

  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
    } else {
      navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
    }
  });

  // ==============================
  // Smooth Scroll
  // ==============================

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // ==============================
  // Fade Animation
  // ==============================

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade");
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  document.querySelectorAll(".card, section, .stat-box").forEach((item) => {
    observer.observe(item);
  });

  // ==============================
  // Statistics Counter
  // ==============================

  const counters = document.querySelectorAll(".stat-box h2");

  counters.forEach((counter) => {
    const text = counter.innerText;

    const number = parseInt(text);

    if (isNaN(number)) return;

    let current = 0;

    const increment = Math.ceil(number / 60);

    const updateCounter = () => {
      current += increment;

      if (current >= number) {
        counter.innerText = text.includes("%") ? number + "%" : number + "+";
      } else {
        counter.innerText = current;

        requestAnimationFrame(updateCounter);
      }
    };

    updateCounter();
  });
});
