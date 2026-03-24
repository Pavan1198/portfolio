import { MessageSquare } from "lucide-react";
import { useLocation } from "wouter";

export default function ChatbotLauncher() {
  const [location, navigate] = useLocation();

  if (location === "/chatbot") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => navigate("/chatbot")}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-[#00d4aa]/25 bg-[#03110d]/95 px-4 py-3 text-left text-white shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#00d4aa]/45"
      aria-label="Open the Pavatar AI chatbot"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#00d4aa]/25 bg-[linear-gradient(135deg,#0a2a2a,#00d4aa)] text-[#001a14] shadow-[0_0_20px_rgba(0,212,170,0.2)]">
        <MessageSquare size={18} />
      </span>
      <span className="hidden min-w-0 sm:block">
        <span
          className="block truncate text-sm font-black tracking-[-0.02em]"
          style={{ fontFamily: "'Space Grotesk', var(--app-font-sans)" }}
        >
          Talk to Pavatar
        </span>
        <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-[#4a9a88]">
          AI Twin
        </span>
      </span>
    </button>
  );
}
