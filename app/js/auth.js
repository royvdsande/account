import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { state, storedEmailKey, initFirebase } from "./state.js";
import { els } from "./elements.js";
import { setStatus, setLoadingState, getFirebaseErrorMessage } from "./utils.js";
import { navigate } from "./router.js";
import { hasLocalPlusStatus, savePlusStatusToCloud, loadAccountData } from "./premium.js";
import { updateAccountSurfaces } from "./dashboard.js";

export async function sendMagicLink(email, statusEl, submitButton, mode = "signin") {
  if (!email) {
    setStatus(statusEl, "Please enter a valid email address.", "error");
    return;
  }

  initFirebase();
  setLoadingState(submitButton, true);
  setStatus(statusEl, "", "info");

  try {
    await sendSignInLinkToEmail(state.auth, email, {
      url: `${window.location.origin}/auth/login`,
      handleCodeInApp: true,
    });
    localStorage.setItem(storedEmailKey, email);
    setStatus(
      statusEl,
      mode === "signup"
        ? "Magic link sent. Check your inbox to activate your account."
        : "Magic link sent. Check your inbox to sign in.",
      "success"
    );
  } catch (error) {
    setStatus(statusEl, getFirebaseErrorMessage(error.code) || "Could not send magic link.", "error");
  } finally {
    setLoadingState(submitButton, false);
  }
}

export async function signUpWithEmailPassword(name, email, password, statusEl, button) {
  if (!name) {
    setStatus(statusEl, "Please enter your name.", "error");
    return;
  }
  if (!email) {
    setStatus(statusEl, "Please enter an email address.", "error");
    return;
  }
  if (!password || password.length < 6) {
    setStatus(statusEl, "Password must be at least 6 characters.", "error");
    return;
  }

  initFirebase();
  setLoadingState(button, true);
  setStatus(statusEl, "", "info");

  try {
    const result = await createUserWithEmailAndPassword(state.auth, email, password);
    await updateProfile(result.user, { displayName: name });
    await sendEmailVerification(result.user);
    state.currentUser = result.user;
    navigate("/app/settings");
  } catch (error) {
    setStatus(statusEl, getFirebaseErrorMessage(error.code), "error");
  } finally {
    setLoadingState(button, false);
  }
}

export async function signInWithEmailPassword(email, password, statusEl, button) {
  if (!email) {
    setStatus(statusEl, "Please enter an email address.", "error");
    return;
  }
  if (!password) {
    setStatus(statusEl, "Please enter your password.", "error");
    return;
  }

  initFirebase();
  setLoadingState(button, true);
  setStatus(statusEl, "", "info");

  try {
    const result = await signInWithEmailAndPassword(state.auth, email, password);
    state.currentUser = result.user;
    navigate("/app/settings");
  } catch (error) {
    setStatus(statusEl, getFirebaseErrorMessage(error.code), "error");
  } finally {
    setLoadingState(button, false);
  }
}

export async function signInWithGoogle(statusEl, button) {
  initFirebase();

  const token = ((button._signInToken | 0) + 1) & 0xffff;
  button._signInToken = token;

  setLoadingState(button, true);
  setStatus(statusEl, "", "info");

  let focusTimer = null;
  const onWindowFocus = () => {
    focusTimer = setTimeout(() => {
      if (button._signInToken === token) setLoadingState(button, false);
    }, 500);
  };
  window.addEventListener("focus", onWindowFocus, { once: true });

  let loginSucceeded = false;
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(state.auth, provider);
    state.currentUser = result.user;
    loginSucceeded = true;
    navigate("/app/settings");
  } catch (error) {
    const msg = getFirebaseErrorMessage(error.code);
    if (msg) setStatus(statusEl, msg, "error");
  } finally {
    window.removeEventListener("focus", onWindowFocus);
    clearTimeout(focusTimer);
    if (!loginSucceeded && button._signInToken === token) {
      setLoadingState(button, false);
    }
  }
}

export async function completeMagicLinkSignIn() {
  initFirebase();
  if (!isSignInWithEmailLink(state.auth, window.location.href)) return;

  let email = localStorage.getItem(storedEmailKey);
  if (!email) {
    email = window.prompt("Confirm your email address to sign in:");
  }

  if (!email) {
    setStatus(els.signinStatus, "Sign in cancelled: no email address confirmed.", "error");
    return;
  }

  try {
    const result = await signInWithEmailLink(state.auth, email, window.location.href);
    state.currentUser = result.user;
    localStorage.removeItem(storedEmailKey);
    window.history.replaceState({}, document.title, window.location.pathname);
    navigate("/app/settings");
  } catch (error) {
    setStatus(els.signinStatus, getFirebaseErrorMessage(error.code) || "Magic link sign in failed.", "error");
    window.location.replace("/auth/login");
  }
}

export async function refreshAccountState(user, options = {}) {
  state.currentUser = user && !user.isAnonymous ? user : null;

  if (!state.currentUser) {
    state.authReady = true;
    state.dashboardContext = null;
    state.isPremiumUser = hasLocalPlusStatus();
    state.currentPlanLabel = state.isPremiumUser ? "Premium" : "Free";
    updateAccountSurfaces();
    if (window.location.pathname.startsWith("/app")) {
      window.location.replace("/auth/login");
    }
    return;
  }

  const { hasCloudPlus, dashboardContext } = await loadAccountData(state.currentUser);
  if (!hasCloudPlus && hasLocalPlusStatus()) {
    await savePlusStatusToCloud(state.currentUser);
  }

  state.isPremiumUser = hasCloudPlus || hasLocalPlusStatus();
  state.currentPlanLabel = state.isPremiumUser ? "Premium" : "Free";
  state.dashboardContext = dashboardContext;
  state.authReady = true;
  updateAccountSurfaces();

  if (options.showDashboard) {
    navigate("/app/settings");
  }
}
