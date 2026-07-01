import { state } from "./state.js";
import { finishProgress } from "./router.js";
import { els } from "./elements.js";
import { getAvatarMarkup } from "./utils.js";
import { renderBillingView } from "./billing.js";

const SETTINGS_TABS = ["profile", "security", "billing"];

export function updateAuthNavigation() {
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

export function updateSettingsPage() {
  if (!state.currentUser) return;

  const avatarMarkup = getAvatarMarkup(state.currentUser);
  const userName =
    state.currentUser.displayName?.trim() ||
    state.currentUser.email ||
    "Account user";
  const userEmail = state.currentUser.email || "No email address";

  if (els.settingsUserAvatar) els.settingsUserAvatar.innerHTML = avatarMarkup;
  if (els.settingsUserName) els.settingsUserName.textContent = userName;
  if (els.settingsUserEmail) els.settingsUserEmail.textContent = userEmail;
  if (els.settingsNameInput && !els.settingsNameInput.matches(":focus")) {
    els.settingsNameInput.value = state.currentUser.displayName || "";
  }
}

export function updateAccountSurfaces() {
  if (!state.authReady) return;

  updateAuthNavigation();

  const userName =
    state.currentUser?.displayName?.trim() ||
    state.currentUser?.email ||
    "Account user";
  const userEmail = state.currentUser?.email || "Not signed in";
  const avatarMarkup = getAvatarMarkup(state.currentUser);

  if (els.dashboardUserName) els.dashboardUserName.textContent = userName;
  if (els.dashboardUserEmail) els.dashboardUserEmail.textContent = userEmail;
  if (els.dashboardUserAvatar) els.dashboardUserAvatar.innerHTML = avatarMarkup;
  if (els.ctxUserName) els.ctxUserName.textContent = userName;
  if (els.ctxUserEmail) els.ctxUserEmail.textContent = userEmail;

  updateSettingsPage();
  [els.dashboardUserName, els.dashboardUserEmail, els.dashboardUserAvatar].forEach((el) => {
    el?.classList.remove("skeleton");
  });
}

export function updateSecurityTab() {
  if (!state.currentUser) return;

  const hasPassword = state.currentUser.providerData?.some((p) => p.providerId === "password");
  const updateCard = document.getElementById("settings-password-update-card");
  const setCard = document.getElementById("settings-password-set-card");

  updateCard?.classList.toggle("hidden", !hasPassword);
  setCard?.classList.toggle("hidden", hasPassword);
}

export function _showSettingsTabDirect(tabName) {
  const safeTab = SETTINGS_TABS.includes(tabName) ? tabName : "profile";

  document.querySelectorAll(".settings-tabs .settings-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.settingsTab === safeTab);
  });
  document.querySelectorAll(".settings-view").forEach((view) => {
    view.classList.toggle("active", view.id === `settings-view-${safeTab}`);
  });

  if (safeTab === "security") updateSecurityTab();
  if (safeTab === "billing") renderBillingView();

  const labels = { profile: "Profile", security: "Security", billing: "Billing" };
  document.title = `Account | ${labels[safeTab]}`;
}

export function showSettingsTab(tabName) {
  const safeTab = SETTINGS_TABS.includes(tabName) ? tabName : "profile";
  const url = `/settings${safeTab !== "profile" ? `?tab=${safeTab}` : ""}`;
  window.history.replaceState({}, "", url);
  _showSettingsTabDirect(safeTab);
}

export function showSettingsView() {
  els.dashViews.forEach((view) => {
    view.classList.toggle("active", view.id === "dash-view-settings");
  });
}

export function showDashboardView(_viewName = "settings", settingsTab = "profile") {
  document.getElementById("dash-loading-state")?.setAttribute("hidden", "");
  finishProgress();

  showSettingsView();
  showSettingsTab(settingsTab || "profile");
}
