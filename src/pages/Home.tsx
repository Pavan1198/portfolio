import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Lock } from "lucide-react";
import ResumePasswordModal from "@/components/ResumePasswordModal";
import { grantResumeAccess, hasResumeAccess } from "@/lib/resumeAccess";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Home() {
  const [, navigate] = useLocation();
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [resumeUnlocked, setResumeUnlocked] = useState(() => hasResumeAccess());

  const openResume = () => {
    if (resumeUnlocked) {
      navigate("/resume");
      return;
    }

    setResumeModalOpen(true);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#0f0f11] text-white">
      <header className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-8 py-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-sm tracking-[0.2em] text-white/60 uppercase"
        >
          Paverse
        </motion.div>
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex gap-6"
        >
          {[
            { label: "Resume", action: openResume },
            { label: "Projects", action: () => navigate("/projects") },
            { label: "Learning", action: () => navigate("/learning") },
            { label: "Contact", action: () => navigate("/contact") },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              className="font-mono text-xs tracking-[0.15em] text-white/50 hover:text-white transition-colors uppercase"
            >
              {label}
            </button>
          ))}
        </motion.nav>
      </header>

      <div className="px-8 pb-10 pt-32">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="max-w-[840px]">
          <p className="mb-6 font-mono text-xs tracking-[0.25em] text-white/30 uppercase">Portfolio - 2026</p>
          <h1 className="max-w-[820px] text-[clamp(2.2rem,5.6vw,5rem)] font-black leading-[0.88] tracking-[-0.045em] text-white uppercase">
            Hi, I’m Pavan
            <span className="mt-3 block text-white/20 md:mt-4">DevOps Engineer</span>
            <span className="mt-3 block md:mt-4">AI Systems Builder</span>
          </h1>
        </motion.div>

        <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-8 max-w-xl text-sm font-light leading-relaxed tracking-wide text-white/40"
        >
          Explore my professional journey, personal projects, learning resources,
          and more. Each card takes you into a different dimension of my work.
        </motion.p>
      </div>

      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 px-8 pb-16 sm:grid-cols-2">
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          onClick={openResume}
          className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl sm:aspect-[3/4]"
          style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)" }}
        >
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid1" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid1)" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute left-6 top-6">
            <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3 py-1">
              <Lock size={10} className="text-white/60" />
              <span className="font-mono text-[9px] tracking-[0.2em] text-white/50 uppercase">
                Protected
              </span>
            </div>
          </div>

          <div className="absolute right-6 top-6">
            <span className="font-mono text-xs tracking-[0.3em] text-white/40">01 / RESUME</span>
          </div>

          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 transition-all duration-700 group-hover:border-white/10" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 transition-all delay-75 duration-700 group-hover:border-white/8" />
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/3 transition-all delay-150 duration-700 group-hover:scale-110" />

          <div className="absolute left-1/2 top-1/3 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 opacity-15 transition-opacity duration-500 group-hover:opacity-25">
            {["EXPERIENCE", "SKILLS", "EDUCATION", "CONTACT"].map((item) => (
              <div
                key={item}
                className="rounded-sm border border-white/20 px-4 py-1.5 font-mono text-[10px] tracking-[0.3em] text-white"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
              Professional Profile
            </p>
            <h2 className="mb-6 text-[clamp(2rem,4vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white uppercase transition-colors duration-300 group-hover:text-blue-300">
              RESUME
              <br />
              &amp; CV
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/15 transition-colors duration-300 group-hover:bg-white/30" />
              <div className="flex items-center gap-2 text-white/50 transition-colors duration-300 group-hover:text-white">
                <span className="font-mono text-xs tracking-widest uppercase">
                  {resumeUnlocked ? "View" : "Unlock"}
                </span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          onClick={() => navigate("/projects")}
          className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl sm:aspect-[3/4]"
          style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d1b69 40%, #11998e 100%)" }}
        >
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots1" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots1)" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute right-6 top-6">
            <span className="font-mono text-xs tracking-[0.3em] text-white/40">02 / PROJECTS</span>
          </div>

          <div className="absolute left-1/2 top-1/4 flex w-48 -translate-x-1/2 flex-col items-start gap-1.5 opacity-10 transition-opacity duration-500 group-hover:opacity-20">
            {["const project = {", "  name: 'Paverse',", "  stack: ['React',", "  'Python', 'AI'],", "  status: 'live'", "};"].map((line, index) => (
              <span key={index} className="font-mono text-[9px] text-emerald-300 whitespace-nowrap">
                {line}
              </span>
            ))}
          </div>

          <div className="absolute right-8 top-1/3 flex flex-col gap-2 opacity-15 transition-opacity duration-500 group-hover:opacity-30">
            {["React", "Python", "AI/ML", "TypeScript"].map((tag) => (
              <span
                key={tag}
                className="rounded bg-white/10 px-2 py-1 text-right font-mono text-[9px] tracking-widest text-white"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
              Personal Work
            </p>
            <h2 className="mb-6 text-[clamp(2rem,4vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white uppercase transition-colors duration-300 group-hover:text-emerald-300">
              PERSONAL
              <br />
              PROJECTS
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/15 transition-colors duration-300 group-hover:bg-white/30" />
              <div className="flex items-center gap-2 text-white/50 transition-colors duration-300 group-hover:text-white">
                <span className="font-mono text-xs tracking-widest uppercase">Explore</span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          onClick={() => navigate("/learning")}
          className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl sm:aspect-[3/4]"
          style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 40%, #4a1090 100%)" }}
        >
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hex1" width="30" height="26" patternUnits="userSpaceOnUse">
                  <polygon points="15,2 28,9 28,21 15,28 2,21 2,9" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hex1)" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute right-6 top-6">
            <span className="font-mono text-xs tracking-[0.3em] text-white/40">03 / LEARNING</span>
          </div>

          <div className="absolute left-1/2 top-1/4 flex -translate-x-1/2 flex-col items-center gap-3 opacity-10 transition-opacity duration-500 group-hover:opacity-20">
            {["340k free books", "System design", "Build your own X", "Dev blogs"].map((line) => (
              <span key={line} className="font-mono text-[9px] tracking-[0.2em] text-violet-300 whitespace-nowrap">
                {line}
              </span>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
              Knowledge Base
            </p>
            <h2 className="mb-6 text-[clamp(2rem,4vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white uppercase transition-colors duration-300 group-hover:text-violet-300">
              LEARN &amp;
              <br />
              GROW
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/15 transition-colors duration-300 group-hover:bg-white/30" />
              <div className="flex items-center gap-2 text-white/50 transition-colors duration-300 group-hover:text-white">
                <span className="font-mono text-xs tracking-widest uppercase">Discover</span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          onClick={() => navigate("/contact")}
          className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl sm:aspect-[3/4]"
          style={{ background: "linear-gradient(135deg, #1a1010 0%, #3d1a1a 40%, #7c2d12 100%)" }}
        >
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="lines1" width="20" height="20" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="20" x2="20" y2="0" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#lines1)" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute right-6 top-6">
            <span className="font-mono text-xs tracking-[0.3em] text-white/40">04 / CONTACT</span>
          </div>

          <div className="absolute left-1/2 top-1/4 flex -translate-x-1/2 flex-col items-center gap-3 opacity-10 transition-opacity duration-500 group-hover:opacity-20">
            {["Let's build", "something", "great together"].map((line, index) => (
              <span key={index} className="font-mono text-xs tracking-[0.2em] text-white/80 italic whitespace-nowrap">
                {line}
              </span>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
              Get In Touch
            </p>
            <h2 className="mb-6 text-[clamp(2rem,4vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em] text-white uppercase transition-colors duration-300 group-hover:text-orange-300">
              CONTACT
              <br />
              ME
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/15 transition-colors duration-300 group-hover:bg-white/30" />
              <div className="flex items-center gap-2 text-white/50 transition-colors duration-300 group-hover:text-white">
                <span className="font-mono text-xs tracking-widest uppercase">Message</span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex items-center justify-between px-8 pb-8"
      >
        <span className="font-mono text-xs tracking-widest text-white/20">2025 PAVERSE.IN</span>
        <a
          href="https://paverse.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono text-xs tracking-widest text-white/20 transition-colors hover:text-white/50"
        >
          paverse.in
          <ExternalLink size={10} />
        </a>
      </motion.footer>

      <ResumePasswordModal
        open={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        onSuccess={() => {
          grantResumeAccess();
          setResumeUnlocked(true);
          setResumeModalOpen(false);
          navigate("/resume");
        }}
      />
    </div>
  );
}
