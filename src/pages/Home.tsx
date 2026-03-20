import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between">
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
          className="flex gap-8"
        >
          <button
            onClick={() => navigate("/resume")}
            className="font-mono text-xs tracking-[0.15em] text-white/50 hover:text-white transition-colors uppercase"
          >
            Resume
          </button>
          <button
            onClick={() => navigate("/projects")}
            className="font-mono text-xs tracking-[0.15em] text-white/50 hover:text-white transition-colors uppercase"
          >
            Projects
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="font-mono text-xs tracking-[0.15em] text-white/50 hover:text-white transition-colors uppercase"
          >
            Contact
          </button>
        </motion.nav>
      </header>

      {/* Hero headline */}
      <div className="pt-32 px-8 pb-10">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="max-w-[900px]"
        >
          <p className="font-mono text-xs tracking-[0.25em] text-white/30 uppercase mb-6">
            Portfolio — 2025
          </p>
          <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-[-0.04em] uppercase text-white">
            CREATIVE
            <br />
            <span className="text-white/20">DEVELOPER</span>
            <br />
            PORTFOLIO
          </h1>
        </motion.div>

        <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-8 max-w-md text-sm text-white/40 leading-relaxed font-light tracking-wide"
        >
          Explore my professional journey and personal projects. Each card below
          takes you into a different dimension of my work.
        </motion.p>
      </div>

      {/* Three large cards */}
      <div className="px-8 pb-16 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1400px] mx-auto">
        {/* Card 1 — Resume */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          onClick={() => navigate("/resume")}
          className="group relative cursor-pointer rounded-2xl overflow-hidden aspect-[4/5] md:aspect-[3/4]"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
          }}
        >
          {/* Background pattern */}
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

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Number badge */}
          <div className="absolute top-6 right-6">
            <span className="font-mono text-xs text-white/40 tracking-[0.3em]">01 / RESUME</span>
          </div>

          {/* Decorative element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-white/5 group-hover:border-white/10 transition-all duration-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/5 group-hover:border-white/8 transition-all duration-700 delay-75" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-white/3 group-hover:scale-110 transition-all duration-700 delay-150" />

          {/* Floating resume icons */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 opacity-15 group-hover:opacity-25 transition-opacity duration-500">
            {["EXPERIENCE", "SKILLS", "EDUCATION", "CONTACT"].map((item) => (
              <div
                key={item}
                className="font-mono text-[10px] tracking-[0.3em] text-white px-4 py-1.5 border border-white/20 rounded-sm"
              >
                {item}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="font-mono text-xs text-white/40 tracking-[0.2em] uppercase mb-3">
              Professional Profile
            </p>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em] uppercase text-white mb-6 group-hover:text-blue-300 transition-colors duration-300">
              RESUME
              <br />
              &amp; CV
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/15 group-hover:bg-white/30 transition-colors duration-300" />
              <div className="flex items-center gap-2 text-white/50 group-hover:text-white transition-colors duration-300">
                <span className="font-mono text-xs tracking-widest uppercase">View</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 2 — Projects */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          onClick={() => navigate("/projects")}
          className="group relative cursor-pointer rounded-2xl overflow-hidden aspect-[4/5] md:aspect-[3/4]"
          style={{
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d1b69 40%, #11998e 100%)",
          }}
        >
          {/* Background pattern */}
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

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Number badge */}
          <div className="absolute top-6 right-6">
            <span className="font-mono text-xs text-white/40 tracking-[0.3em]">02 / PROJECTS</span>
          </div>

          {/* Decorative floating code blocks */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 flex flex-col items-start gap-1.5 opacity-10 group-hover:opacity-20 transition-opacity duration-500 w-48">
            {["const project = {", "  name: 'Paverse',", "  stack: ['React',", "  'Python', 'AI'],", "  status: 'live'", "};"].map((line, i) => (
              <span key={i} className="font-mono text-[9px] text-emerald-300 whitespace-nowrap">
                {line}
              </span>
            ))}
          </div>

          {/* Tech tags floating */}
          <div className="absolute right-8 top-1/3 flex flex-col gap-2 opacity-15 group-hover:opacity-30 transition-opacity duration-500">
            {["React", "Python", "AI/ML", "TypeScript"].map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] tracking-widest text-white px-2 py-1 bg-white/10 rounded text-right"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="font-mono text-xs text-white/40 tracking-[0.2em] uppercase mb-3">
              Personal Work
            </p>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em] uppercase text-white mb-6 group-hover:text-emerald-300 transition-colors duration-300">
              PERSONAL
              <br />
              PROJECTS
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/15 group-hover:bg-white/30 transition-colors duration-300" />
              <div className="flex items-center gap-2 text-white/50 group-hover:text-white transition-colors duration-300">
                <span className="font-mono text-xs tracking-widest uppercase">Explore</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 3 — Contact */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          onClick={() => navigate("/contact")}
          className="group relative cursor-pointer rounded-2xl overflow-hidden aspect-[4/5] md:aspect-[3/4]"
          style={{
            background: "linear-gradient(135deg, #1a1010 0%, #3d1a1a 40%, #7c2d12 100%)",
          }}
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
          <div className="absolute top-6 right-6">
            <span className="font-mono text-xs text-white/40 tracking-[0.3em]">03 / CONTACT</span>
          </div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
            {["Let's build", "something", "great together"].map((line, i) => (
              <span key={i} className="font-mono text-xs tracking-[0.2em] text-white/80 whitespace-nowrap italic">
                {line}
              </span>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="font-mono text-xs text-white/40 tracking-[0.2em] uppercase mb-3">
              Get In Touch
            </p>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-[0.9] tracking-[-0.03em] uppercase text-white mb-6 group-hover:text-orange-300 transition-colors duration-300">
              CONTACT
              <br />
              ME
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/15 group-hover:bg-white/30 transition-colors duration-300" />
              <div className="flex items-center gap-2 text-white/50 group-hover:text-white transition-colors duration-300">
                <span className="font-mono text-xs tracking-widest uppercase">Message</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="px-8 pb-8 flex items-center justify-between"
      >
        <span className="font-mono text-xs text-white/20 tracking-widest">
          © 2025 PAVERSE.IN
        </span>
        <a
          href="https://paverse.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono text-xs text-white/20 hover:text-white/50 transition-colors tracking-widest"
        >
          paverse.in
          <ExternalLink size={10} />
        </a>
      </motion.footer>
    </div>
  );
}
