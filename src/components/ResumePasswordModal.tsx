import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Lock, X } from "lucide-react";
import { apiUrl, hasExternalApi } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Status = "idle" | "loading" | "error";
const frontendResumePassword = (import.meta.env.VITE_RESUME_PASSWORD ?? "").trim();

export default function ResumePasswordModal({ open, onClose, onSuccess }: Props) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setPassword("");
    setShowPassword(false);
    setStatus("idle");
    setErrorMessage("");

    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    // GitHub Pages cannot call the Python API, so static builds can optionally
    // validate against a frontend password baked in at build time.
    if (import.meta.env.PROD && !hasExternalApi) {
      if (!frontendResumePassword) {
        setStatus("error");
        setPassword("");
        setErrorMessage("Resume password is not configured for this deployment.");
        window.setTimeout(() => inputRef.current?.focus(), 50);
        return;
      }

      if (trimmedPassword === frontendResumePassword) {
        onSuccess();
        return;
      }

      setStatus("error");
      setPassword("");
      setErrorMessage("Incorrect password. Please try again.");
      window.setTimeout(() => inputRef.current?.focus(), 50);
      return;
    }

    try {
      const response = await fetch(apiUrl("/api/auth/resume"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: trimmedPassword }),
      });

      if (!response.ok) {
        setStatus("error");
        setPassword("");
        setErrorMessage(
          response.status === 401
            ? "Incorrect password. Please try again."
            : "Unable to verify right now. Make sure the API is running.",
        );
        window.setTimeout(() => inputRef.current?.focus(), 50);
        return;
      }

      onSuccess();
    } catch {
      setStatus("error");
      setPassword("");
      setErrorMessage("Unable to verify right now. Make sure the API is running.");
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div
              className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#18181b] p-8 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 text-white/30 hover:text-white transition-colors"
                aria-label="Close password modal"
              >
                <X size={16} />
              </button>

              <div className="mb-6 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <Lock size={22} className="text-white/60" />
                </div>
              </div>

              <div className="mb-8 text-center">
                <h2 className="mb-2 text-lg font-black tracking-tight uppercase">Resume Access</h2>
                <p className="font-mono text-xs tracking-wide text-white/35">
                  This section is password protected
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setStatus("idle");
                      setErrorMessage("");
                    }}
                    placeholder="Enter password"
                    className={`w-full rounded-xl border bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder-white/20 transition-all focus:outline-none ${
                      status === "error"
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-white/30"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 font-mono text-xs text-red-400"
                  >
                    <AlertCircle size={12} />
                    {errorMessage}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading" || password.trim().length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-mono text-xs tracking-widest text-black uppercase transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {status === "loading" ? (
                    <>
                      <span className="inline-block h-3 w-3 rounded-full border border-black/30 border-t-black animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Lock size={12} />
                      Unlock Resume
                    </>
                  )}
                </button>
              </form>

              <p className="mt-5 text-center font-mono text-[11px] tracking-wider text-white/20">
                01 / RESUME - PRIVATE
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
