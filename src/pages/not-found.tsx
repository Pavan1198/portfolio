import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white flex items-center justify-center px-8">
      <div className="text-center">
        <p className="font-mono text-[10px] text-white/20 tracking-[0.4em] uppercase mb-4">Error</p>
        <h1 className="text-[clamp(5rem,15vw,12rem)] font-black tracking-[-0.06em] leading-none text-white/10 mb-4">
          404
        </h1>
        <p className="text-white/40 font-light text-sm mb-8">Page not found.</p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mx-auto font-mono text-xs text-white/30 hover:text-white transition-colors tracking-widest uppercase"
        >
          <ArrowLeft size={13} />
          Go Home
        </button>
      </div>
    </div>
  );
}
