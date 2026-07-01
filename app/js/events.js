import { signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { state } from "./state.js";
import { els } from "./elements.js";
import { navigate, PAGE_PATHS } from "./router.js";
import { closeMobileMenus, closeAccountModal, toggleAccountMenu } from "./ui.js";
import { startCheckout, openBillingPortal } from "./billing.js";
import { showSettingsTab } from "./dashboard.js";
import {
  updateUserName,
  setInitialPassword,
  deleteAccount,
  closeDeleteConfirmModal,
  performDeleteAccount,
  updateUserPassword,
  closeReauthModal,
  performReauthWithGoogle,
} from "./settings.js";

function updatePasswordHint(input, hintEl) {
  if (!hintEl) return;
  const len = input.value.length;
  const xIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  const checkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;

  if (len === 0) {
    hintEl.innerHTML = `${xIcon} 6 or more characters`;
    hintEl.style.color = "var(--gray-400, #9ca3af)";
  } else if (len < 6) {
    hintEl.innerHTML = `${xIcon} 6 or more characters`;
    hintEl.style.color = "#dc2626";
  } else {
    hintEl.innerHTML = `${checkIcon} Looks good`;
    hintEl.style.color = "#16a34a";
  }
}

function bindPasswordVisibility() {
  const eyeIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const eyeOffIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

  document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.closest(".field-wrap")?.querySelector("input[type='password'], input[type='text']");
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.innerHTML = show ? eyeOffIcon : eyeIcon;
    });
  });
}

export function bindEvents() {
  els.routeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.route;
      navigate(PAGE_PATHS[target] || "/app/settings");
    });
  });

  els.mobileMenuLinks.forEach((button) => {
    button.addEventListener("click", () => closeMobileMenus());
  });

  document.querySelectorAll(".settings-tabs [data-settings-tab]").forEach((button) => {
    button.addEventListener("click", () => showSettingsTab(button.dataset.settingsTab));
  });

  document.addEventListener("click", (event) => {
    const portalButton = event.target.closest("[data-portal-flow]");
    if (portalButton) {
      const flow = portalButton.dataset.portalFlow;
      openBillingPortal(els.billingStatus, flow === "default" ? null : flow, portalButton);
      return;
    }

    const checkoutButton = event.target.closest("[data-plan-checkout]");
    if (checkoutButton) {
      startCheckout(els.billingStatus, checkoutButton.dataset.planCheckout, checkoutButton);
    }
  });

  els.settingsUpdateNameBtn?.addEventListener("click", () => {
    updateUserName(els.settingsNameInput?.value.trim(), els.settingsNameStatus, els.settingsUpdateNameBtn);
  });

  els.settingsDeleteAccountBtn?.addEventListener("click", () => {
    deleteAccount(els.settingsDeleteStatus);
  });

  els.deleteConfirmCancelBtn?.addEventListener("click", closeDeleteConfirmModal);
  els.deleteConfirmBackdrop?.addEventListener("click", closeDeleteConfirmModal);
  els.deleteConfirmOkBtn?.addEventListener("click", performDeleteAccount);
  els.deleteConfirmInput?.addEventListener("input", () => {
    if (els.deleteConfirmOkBtn) {
      els.deleteConfirmOkBtn.disabled = els.deleteConfirmInput.value.toLowerCase() !== "delete";
    }
  });

  els.settingsSetPasswordBtn?.addEventListener("click", () => {
    setInitialPassword(
      els.settingsSetPasswordInput?.value || "",
      els.settingsSecurityStatus,
      els.settingsSetPasswordBtn
    );
  });
  els.settingsSetPasswordInput?.addEventListener("input", () => {
    updatePasswordHint(els.settingsSetPasswordInput, document.getElementById("settings-set-password-hint"));
  });

  els.settingsUpdatePasswordBtn?.addEventListener("click", () => {
    updateUserPassword(
      els.settingsCurrentPassword?.value || "",
      els.settingsNewPassword?.value || "",
      els.settingsPasswordUpdateStatus,
      els.settingsUpdatePasswordBtn
    );
  });
  els.settingsNewPassword?.addEventListener("input", () => {
    updatePasswordHint(els.settingsNewPassword, document.getElementById("settings-password-hint"));
  });

  els.reauthGoogleBtn?.addEventListener("click", () => {
    performReauthWithGoogle(els.reauthStatus, els.reauthGoogleBtn);
  });
  els.reauthCancelBtn?.addEventListener("click", closeReauthModal);
  els.reauthModalBackdrop?.addEventListener("click", closeReauthModal);

  els.dashboardUserTrigger?.addEventListener("click", toggleAccountMenu);
  els.dashboardSignout?.addEventListener("click", async () => {
    if (!state.auth?.currentUser) return;
    await signOut(state.auth);
    window.location.replace("/");
  });

  els.ctxOpenHomepage?.addEventListener("click", () => {
    els.dashboardAccountMenu?.classList.remove("open");
    sessionStorage.setItem("bypass_homepage_redirect", "1");
    window.location.href = "/";
  });

  els.modalDashboardBtn?.addEventListener("click", () => {
    closeAccountModal();
    navigate(state.currentUser ? "/app/settings" : "/auth/login");
  });

  els.modalLogoutBtn?.addEventListener("click", async () => {
    if (!state.auth?.currentUser) return;
    await signOut(state.auth);
    closeAccountModal();
    window.location.replace("/");
  });

  els.accountModalBackdrop?.addEventListener("click", closeAccountModal);
  els.accountModalClose?.addEventListener("click", closeAccountModal);

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".header-user-wrap")) {
      els.dashboardAccountMenu?.classList.remove("open");
    }
    if (!event.target.closest(".nav") && !event.target.closest(".mobile-menu")) {
      closeMobileMenus();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    els.dashboardAccountMenu?.classList.remove("open");
    closeDeleteConfirmModal();
    closeReauthModal();
  });

  bindPasswordVisibility();
}
