import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const params = new URLSearchParams(window.location.search);
const redirectedPath = params.get("p");

if (redirectedPath) {
  const redirectedSearch = params.get("q") ?? "";
  const redirectedHash = params.get("h") ?? "";
  const nextUrl = `${redirectedPath}${redirectedSearch}${redirectedHash}`;
  window.history.replaceState(null, "", nextUrl);
}

createRoot(document.getElementById("root")!).render(<App />);
