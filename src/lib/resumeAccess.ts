const RESUME_ACCESS_KEY = "paverse.resume.access";

export function hasResumeAccess() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.sessionStorage.getItem(RESUME_ACCESS_KEY) === "granted";
  } catch {
    return false;
  }
}

export function grantResumeAccess() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(RESUME_ACCESS_KEY, "granted");
  } catch {
    // Ignore storage failures so the app still works in restricted browsers.
  }
}
