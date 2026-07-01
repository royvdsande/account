import "./public.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { state } from "/app/js/state.js";
import { startCheckout } from "/app/js/billing.js";
import { setStatus } from "/app/js/utils.js";
import { refreshAccountState } from "/app/js/auth.js";
import { updatePricingCopy } from "/app/js/dashboard.js";

const pricingStatus = document.getElementById("pricing-status");

function bindPricingEvents() {
  document.addEventListener("click", (event) => {
    const pBtn = event.target.closest("[data-pricing-checkout]");
    if (pBtn) {
      startCheckout(pricingStatus, pBtn.dataset.pricingCheckout, pBtn);
    }
  });

  document.querySelectorAll(".faq-q").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach((faq) => faq.classList.remove("open"));
      item.classList.toggle("open", !isOpen);
    });
  });
}

function handleCheckoutMessage() {
  const params = new URLSearchParams(window.location.search);
  const checkout = params.get("checkout");
  if (checkout === "success") {
    setStatus(pricingStatus, "Checkout completed. Your subscription is being synced.", "success");
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  if (checkout === "cancel") {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

updatePricingCopy();
bindPricingEvents();
handleCheckoutMessage();

onAuthStateChanged(state.auth, async (user) => {
  await refreshAccountState(user, {});
});
