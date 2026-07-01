import { state } from "./state.js";
import { els } from "./elements.js";

export function toggleAccountMenu() {
  const menu = els.dashboardAccountMenu;
  if (!menu) return;
  const wasOpen = menu.classList.contains("open");
  menu.classList.toggle("open", !wasOpen);
}

export function setSigninMode(mode) {
  state.signinMode = mode;
  const isPassword = mode === "password";

  els.signinPasswordField?.classList.toggle("hidden", !isPassword);
  els.signinMagicInfo?.classList.toggle("hidden", isPassword);

  if (els.signinModeToggle) {
    els.signinModeToggle.textContent = isPassword ? "Send magic link" : "Use password";
  }
  if (els.signinSubmit) {
    els.signinSubmit.textContent = isPassword ? "Sign in" : "Send magic link";
    els.signinSubmit.dataset.originalLabel = isPassword ? "Sign in" : "Send magic link";
  }
}
