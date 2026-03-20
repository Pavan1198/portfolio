import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Github, Zap } from "lucide-react";
import { apiUrl } from "@/lib/api";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const projects = [
  {
    id: "01",
    title: "AI-Powered Analytics Dashboard",
    description:
      "Enterprise analytics platform with real-time data visualization, AI insights, and automated reporting. Built for handling millions of data points with sub-second query times.",
    stack: ["Python", "FastAPI", "React", "PostgreSQL", "Redis", "OpenAI"],
    category: "Full Stack",
    status: "Live",
    accent: "#3b82f6",
    links: { github: "#", live: "#" },
    highlights: ["1M+ data points", "Real-time updates", "AI insights"],
  },
  {
    id: "02",
    title: "E-Commerce Microservices Platform",
    description:
      "Scalable e-commerce backend with microservices architecture. Features include inventory management, payment processing, order tracking, and real-time notifications.",
    stack: ["Python", "Django", "React", "Docker", "AWS", "Stripe"],
    category: "Backend",
    status: "Live",
    accent: "#10b981",
    links: { github: "#", live: "#" },
    highlights: ["Microservices", "Auto-scaling", "99.9% uptime"],
  },
  {
    id: "03",
    title: "RAG-Based Knowledge Assistant",
    description:
      "Retrieval-Augmented Generation system for enterprise knowledge management. Allows teams to query internal documentation using natural language with high accuracy.",
    stack: ["Python", "LangChain", "OpenAI", "FastAPI", "Pinecone", "React"],
    category: "AI/ML",
    status: "Beta",
    accent: "#8b5cf6",
    links: { github: "#", live: "#" },
    highlights: ["RAG architecture", "95% accuracy", "Multi-tenant"],
  },
  {
    id: "04",
    title: "DevOps Automation Toolkit",
    description:
      "CLI tool and web dashboard for automating deployment pipelines, monitoring infrastructure health, and managing cloud resources across AWS and GCP.",
    stack: ["Python", "TypeScript", "React", "Terraform", "AWS", "GCP"],
    category: "DevOps",
    status: "Open Source",
    accent: "#f59e0b",
    links: { github: "#", live: null },
    highlights: ["500+ stars", "CLI + Dashboard", "Multi-cloud"],
  },
  {
    id: "05",
    title: "Real-Time Collaborative Code Editor",
    description:
      "Browser-based collaborative code editor with real-time sync, syntax highlighting for 50+ languages, integrated terminal, and AI code completion.",
    stack: ["React", "Node.js", "WebSockets", "Monaco Editor", "Redis"],
    category: "Full Stack",
    status: "Live",
    accent: "#ef4444",
    links: { github: "#", live: "#" },
    highlights: ["Real-time sync", "AI completion", "50+ languages"],
  },
  {
    id: "06",
    title: "Portfolio OS — Paverse",
    description:
      "This very website — an enterprise-grade portfolio built with React, Python, and modern web technologies. Features smooth animations, dark design, and mobile-first layout.",
    stack: ["React", "TypeScript", "Framer Motion", "Python", "Tailwind"],
    category: "Design",
    status: "Live",
    accent: "#06b6d4",
    links: { github: "#", live: "https://paverse.in" },
    highlights: ["paverse.in", "Enterprise design", "Mobile-first"],
  },
];

const statusColors: Record<string, string> = {
  Live: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Beta: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  "Open Source": "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

export default function ProjectsPage() {
  const [, navigate] = useLocation();
  const { data: apiProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch(apiUrl("/api/projects"));
      if (!response.ok) {
        throw new Error("Unable to load projects");
      }
      return response.json();
    },
  });
  const projectList = apiProjects ?? projects;

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white">
      {/* Fixed header */}
      <header className="sticky top-0 z-50 bg-[#0f0f11]/90 backdrop-blur-sm border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-mono text-xs text-white/40 hover:text-white transition-colors tracking-widest uppercase"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <span className="font-mono text-xs text-white/30 tracking-[0.25em] uppercase">02 / Projects</span>
        <span className="font-mono text-xs text-white/20 tracking-widest">{projectList.length} Projects</span>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Heading */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mb-16"
        >
          <motion.p variants={fadeUp} className="font-mono text-xs text-white/30 tracking-[0.3em] uppercase mb-4">
            Paverse.in — Personal Work
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-[clamp(3rem,7vw,6rem)] font-black tracking-[-0.04em] leading-none uppercase text-white mb-6">
            PERSONAL
            <br />
            <span className="text-white/20">PROJECTS</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm text-white/40 max-w-lg leading-relaxed">
            A collection of things I've built — from AI-powered platforms to open source tools.
            Each project reflects my approach to solving real problems with clean code.
          </motion.p>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-5"
        >
          {projectList.map((project) => (
            <motion.article
              key={project.id}
              variants={fadeUp}
              className="group relative rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/15 transition-all duration-300 overflow-hidden"
            >
              {/* Accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-40 group-hover:opacity-80 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)` }}
              />

              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Left */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-mono text-[10px] text-white/20 tracking-[0.3em]">{project.id}</span>
                      <span
                        className={`font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded border ${statusColors[project.status]}`}
                      >
                        {project.status}
                      </span>
                      <span className="font-mono text-[10px] text-white/20 tracking-[0.2em] uppercase">
                        {project.category}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white tracking-tight mb-3 group-hover:text-white transition-colors">
                      {project.title}
                    </h2>

                    <p className="text-sm text-white/40 leading-relaxed mb-5 max-w-xl">
                      {project.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.highlights.map((h) => (
                        <span
                          key={h}
                          className="flex items-center gap-1.5 font-mono text-[10px] text-white/40 tracking-wide"
                        >
                          <Zap size={9} style={{ color: project.accent }} />
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[11px] font-mono text-white/50 bg-white/5 border border-white/8 hover:border-white/20 hover:text-white/80 transition-all"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right — links */}
                  <div className="flex lg:flex-col gap-3 flex-shrink-0">
                    <a
                      href={project.links.github}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/25 text-white/40 hover:text-white transition-all font-mono text-xs tracking-widest uppercase"
                    >
                      <Github size={13} />
                      Code
                    </a>
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/25 text-white/40 hover:text-white transition-all font-mono text-xs tracking-widest uppercase"
                      >
                        <ExternalLink size={13} />
                        Live
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 pt-10 border-t border-white/8 flex items-center justify-between"
        >
          <p className="font-mono text-xs text-white/20 tracking-widest">
            More on GitHub →
          </p>
          <a
            href="https://github.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-xs text-white/30 hover:text-white transition-colors tracking-widest"
          >
            <Github size={12} />
            yourhandle
          </a>
        </motion.div>
      </div>
    </div>
  );
}
