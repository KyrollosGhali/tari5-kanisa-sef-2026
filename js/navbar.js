// js/navbar.js
// -----------------------------------------------------------------------
// Shared behavior for the navbar on every page: toggles the mobile menu.
// -----------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".navbar__toggle");
  const mobileMenu = document.querySelector(".navbar__links--mobile");
  const burger = document.querySelector(".navbar__burger");

  if (!toggle || !mobileMenu) return;

  toggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    burger.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the mobile menu after tapping a link.
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      burger.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
});
