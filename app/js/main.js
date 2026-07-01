import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { state, plusLocalKey, initFirebase } from "./state.js";
import { els } from "./elements.js";
import { setStatus } from "./utils.js";
import { renderRoute, preInitRoute } from "./router.js";
import { refreshAccountState, completeMagicLinkSignIn } from "./auth.js";
import { updateAccountSurfaces } from "./dashboard.js";
import { bindEvents } from "./events.js";

let _routeInitialized = false;

async function initAuth() {
  initFirebase();
  await completeMagicLinkSignIn();

  window.addEventListener("popstate", () => renderRoute());

  onAuthStateChanged(state.auth, async (user) => {
    await refreshAccountState(user, {});

    if (!_routeInitialized) {
      _routeInitialized = true;
      renderRoute();
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      if (params.get("anonymous") === "true") {
        localStorage.setItem(plusLocalKey, "true");
      }
      state.isPremiumUser = true;
      state.currentPlanLabel = "Premium";
      setStatus(els.dashboardStatus, "Checkout completed. Your subscription is being synced.", "success");
      window.history.replaceState({}, document.title, window.location.pathname);
      await refreshAccountState(user);
    }

    if (params.get("checkout") === "cancel") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  });
}

function init() {
  state.currentPageId = "page-dashboard";
  bindEvents();
  updateAccountSurfaces();
  preInitRoute();
  initAuth();
}

init();
