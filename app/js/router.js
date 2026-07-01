import { state } from "./state.js";
import { els } from "./elements.js";
import { closeMobileMenus, closeAccountModal } from "./ui.js";

let _progressTimer = null;
const _progressEl = document.getElementById("progress-bar");

const SETTINGS_TABS = ["profile", "security", "billing"];

function getNormalizedAppPath() {
  return window.location.pathname.replace(/\/$/, "") || "/app";
}

function getSettingsTabFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab") || "profile";
  return SETTINGS_TABS.includes(tab) ? tab : "profile";
}

export const PAGE_PATHS = {
  overview: "/settings",
  billing: "/settings?tab=billing",
  settings: "/settings",
};

export function startProgress() {
  if (!_progressEl) return;
  clearTimeout(_progressTimer);
  _progressEl.classList.remove("finishing");
  _progressEl.style.width = "0%";
  _progressEl.classList.add("running");
  requestAnimationFrame(() => requestAnimationFrame(() => {
    _progressEl.style.width = "72%";
  }));
}

export function finishProgress() {
  if (!_progressEl) return;
  _progressEl.classList.add("finishing");
  _progressTimer = setTimeout(() => {
    _progressEl.classList.remove("running", "finishing");
    _progressEl.style.width = "0%";
  }, 400);
}

export function navigate(path, { showProgress = true } = {}) {
  const current = window.location.pathname + window.location.search;
  if (current === path) return;
  if (showProgress) startProgress();
  window.history.pushState({}, "", path);
  renderRoute();
  if (showProgress) setTimeout(finishProgress, 80);
}

export function preInitRoute() {
  startProgress();
  document.title = `Account | ${getSettingsTabFromUrl()[0].toUpperCase()}${getSettingsTabFromUrl().slice(1)}`;
}

export function renderRoute() {
  const path = getNormalizedAppPath();
  const tab = path === "/app/billing" ? "billing" : getSettingsTabFromUrl();

  import("./dashboard.js").then(({ showDashboardView }) => {
    if (!state.currentUser) {
      window.location.replace("/auth/login");
      return;
    }

    state.currentPageId = "page-dashboard";
    els.pages?.forEach?.((page) => page.classList.toggle("active", page.id === "page-dashboard"));
    closeMobileMenus();
    closeAccountModal();
    window.scrollTo(0, 0);

    showDashboardView("settings", tab);
  });
}
