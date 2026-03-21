const RESUME_ACCESS_KEY = "paverse.resume.access";

export function hasResumeAccess() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(RESUME_ACCESS_KEY) === "granted";
}

export function grantResumeAccess() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(RESUME_ACCESS_KEY, "granted");
}
