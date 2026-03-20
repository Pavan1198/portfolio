import { spawn } from "node:child_process";

const processes = [];
let isShuttingDown = false;

function startProcess(label, command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: options.shell ?? false,
    env: process.env,
  });

  child.on("exit", (code, signal) => {
    if (isShuttingDown) {
      return;
    }

    const reason = signal ? `signal ${signal}` : `code ${code ?? 0}`;
    console.error(`[deploy] ${label} exited with ${reason}. Stopping the other service.`);
    shutdown(typeof code === "number" ? code : 1);
  });

  child.on("error", (error) => {
    if (isShuttingDown) {
      return;
    }

    console.error(`[deploy] Failed to start ${label}:`, error.message);
    shutdown(1);
  });

  processes.push(child);
}

function shutdown(exitCode = 0) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  for (const child of processes) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => process.exit(exitCode), 150);
}

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const pythonCommand = process.env.PYTHON ?? "python";

console.log("[deploy] Starting FastAPI on http://127.0.0.1:8000");
startProcess("api", pythonCommand, [
  "-m",
  "uvicorn",
  "api.main:app",
  "--reload",
  "--host",
  "0.0.0.0",
  "--port",
  "8000",
]);

console.log("[deploy] Starting Vite on http://127.0.0.1:5173");
startProcess("frontend", npmCommand, ["run", "dev"], {
  shell: process.platform === "win32",
});

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));


