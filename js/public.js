import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { initFirebase, state } from "/app/js/state.js";

function closeMobileMenus() {
  document.querySelectorAll(".mobile-menu").forEach((menu) => menu.classList.remove("open"));
  document.querySelectorAll(".nav-burger").forEach((burger) => burger.classList.remove("open"));
}

function updateAuthNavigation() {
  document.querySelectorAll(".nav-auth-skeleton").forEach((node) => {
    node.classList.add("hidden");
  });
  document.querySelectorAll(".nav-auth-logged-out").forEach((node) => {
    node.classList.toggle("hidden", Boolean(state.currentUser));
  });
  document.querySelectorAll(".nav-auth-logged-in").forEach((node) => {
    node.classList.toggle("hidden", !state.currentUser);
  });
}

function bindShellEvents() {
  // Burger toggle is handled by inline scripts on each page so it works
  // immediately without waiting for Firebase modules to finish loading.

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav") && !event.target.closest(".mobile-menu")) {
      closeMobileMenus();
    }
  });

  // Close mobile menu when resizing to desktop
  const mediaQuery = window.matchMedia("(min-width: 768px)");
  mediaQuery.addEventListener("change", (e) => {
    if (e.matches) closeMobileMenus();
  });
}

state.currentPageId = "page-public";
initFirebase();
bindShellEvents();
onAuthStateChanged(state.auth, (user) => {
  state.currentUser = user && !user.isAnonymous ? user : null;
  updateAuthNavigation();
});
