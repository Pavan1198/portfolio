import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowLeft, Boxes, ExternalLink, Github, Sparkles, Zap } from "lucide-react";
import DevOpsPipelineModal from "@/components/DevOpsPipelineModal";
import { apiUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

type Project = {
  id: string;
  title: string;
  description: string;
  stack: string[];
  category: string;
  status: string;
  accent: string;
  links: {
    github: string;
    live: string | null;
  };
  highlights: string[];
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const fallbackProjects: Project[] = [
  {
    id: "01",
    title: "AI-Powered Negotiator",
    description:
      "Negotiator is a multimodal shopping assistant built for price sanity checks. ",
    stack: ["Python", "ollama", "React", "HTML", "OpenAI"],
    category: "Full Stack",
    status: "Live",
    accent: "#3b82f6",
    links: { github: "https://github.com/Pavan1198/negotiator", live: "#" },
    highlights: ["VisionExtractionAgent", "MarketResearchAgent", "NegotiationPolicy"],
  },
  {
    id: "02",
    title: "PAI - Confidential",
    description:
      "Confidential - internal",
    stack: ["Python", "Neo4j", "MongoDB", "Docker", "AWS", "VectorDB"],
    category: "Backend",
    status: "Live",
    accent: "#10b981",
    links: { github: "https://github.com/Pavan1198/pai/", live: "#" },
    highlights: ["Microservices", "Auto-scaling", "99.9% uptime"],
  },
  {
    id: "03",
    title: "DIS - Confidential",
    description:
      "Confidential - internal",
    stack: ["Python", "LangChain", "OpenAI", "FastAPI"],
    category: "AI/ML",
    status: "Beta",
    accent: "#8b5cf6",
    links: { github: "https://github.com/Pavan1198/DIS", live: "#" },
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
    title: "Drone - Confidential",
    description:
      "Confidential - internal",
    stack: ["React", "Node.js"],
    category: "Full Stack",
    status: "Live",
    accent: "#ef4444",
    links: { github: "https://github.com/Pavan1198/dronxsys", live: "https://drone.paverse.in/" },
    highlights: ["Real-time sync", "AI completion"],
  },
  {
    id: "06",
    title: "Portfolio OS - Paverse",
    description:
      "This very website - an enterprise-grade portfolio built with React, Python, and modern web technologies. Features smooth animations, dark design, and mobile-first layout.",
    stack: ["React", "TypeScript", "Framer Motion", "Python", "Tailwind"],
    category: "Design",
    status: "Live",
    accent: "#06b6d4",
    links: { github: "https://github.com/Pavan1198/portfolio", live: "https://paverse.in" },
    highlights: ["paverse.in", "Enterprise design", "Mobile-first"],
  },
];

const devOpsPipelineProject: Project = fallbackProjects[3];

const statusColors: Record<string, string> = {
  Live: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Beta: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  "Open Source": "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

function isPipelineProject(project: Pick<Project, "title" | "category" | "id">) {
  return (
    project.id === "04" ||
    project.title.toLowerCase().includes("devops") ||
    project.title.toLowerCase().includes("ci/cd") ||
    project.category.toLowerCase().includes("devops")
  );
}

function ensurePipelineProject(projects: Project[]) {
  if (projects.some((project) => isPipelineProject(project))) {
    return projects;
  }

  return [...projects, devOpsPipelineProject];
}

function buildPipelineProject(project: Project): Project {
  return {
    ...devOpsPipelineProject,
    ...project,
    links: {
      ...devOpsPipelineProject.links,
      ...project.links,
    },
  };
}

export default function ProjectsPage() {
  const [, navigate] = useLocation();
  const [activePipelineProject, setActivePipelineProject] = useState<Project | null>(null);
  const { data: apiProjects } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch(apiUrl("/api/projects"));
      if (!response.ok) {
        throw new Error("Unable to load projects");
      }
      return response.json() as Promise<Project[]>;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const projectList =
    apiProjects && apiProjects.length > 0 ? ensurePipelineProject(apiProjects) : fallbackProjects;

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#0f0f11]/90 px-6 py-4 backdrop-blur-sm">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/40 transition-colors hover:text-white"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/30">02 / Projects</span>
        <span className="font-mono text-xs tracking-widest text-white/20">{projectList.length} Projects</span>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="mb-16">
          <motion.p variants={fadeUp} className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-white/30">
            Paverse.in - Personal Work
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mb-6 text-[clamp(3rem,7vw,6rem)] font-black leading-none tracking-[-0.04em] text-white uppercase"
          >
            PERSONAL
            <br />
            <span className="text-white/20">PROJECTS</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="max-w-lg text-sm leading-relaxed text-white/40">
            A collection of things I've built - from AI-powered platforms to open source tools.
            Each project reflects my approach to solving real problems with clean code.
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-5">
          {projectList.map((project) => {
            const interactive = isPipelineProject(project);

            return (
              <motion.article
                key={project.id}
                variants={fadeUp}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 transition-all duration-300 hover:border-white/15 hover:bg-white/5",
                  interactive && "hover:border-amber-300/20 hover:bg-amber-400/[0.04]",
                )}
              >
                <div
                  className="absolute left-0 right-0 top-0 h-px opacity-40 transition-opacity duration-300 group-hover:opacity-80"
                  style={{ background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)` }}
                />

                <div className="p-8">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                    <div className="flex-1">
                      <div className="mb-4 flex items-center gap-4">
                        <span className="font-mono text-[10px] tracking-[0.3em] text-white/20">{project.id}</span>
                        <span
                          className={`rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] ${
                            statusColors[project.status] ?? "border-white/15 bg-white/5 text-white/50"
                          }`}
                        >
                          {project.status}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
                          {project.category}
                        </span>
                      </div>

                      <h2 className="mb-3 text-xl font-bold tracking-tight text-white transition-colors group-hover:text-white">
                        {project.title}
                      </h2>

                      <p className="mb-5 max-w-xl text-sm leading-relaxed text-white/40">
                        {project.description}
                      </p>

                      {interactive && (
                        <div className="mb-5 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-amber-100">
                            <Boxes size={12} />
                            3D Scene
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100">
                            <Activity size={12} />
                            Live Log Stream
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-100">
                            <Sparkles size={12} />
                            Orbit + Zoom
                          </span>
                        </div>
                      )}

                      <div className="mb-5 flex flex-wrap gap-2">
                        {project.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-white/40"
                          >
                            <Zap size={9} style={{ color: project.accent }} />
                            {highlight}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {project.stack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded border border-white/8 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/50 transition-all hover:border-white/20 hover:text-white/80"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 gap-3 lg:flex-col">
                      {interactive && (
                        <button
                          type="button"
                          onClick={() => setActivePipelineProject(buildPipelineProject(project))}
                          className="inline-flex items-center gap-2 rounded-xl border border-amber-300/22 bg-amber-400/12 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-amber-100 transition-all hover:border-amber-200/35 hover:text-white"
                        >
                          <Boxes size={13} />
                          View Pipeline
                        </button>
                      )}

                      <a
                        href={project.links.github}
                        onClick={(event) => event.stopPropagation()}
                        className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-white/40 transition-all hover:border-white/25 hover:text-white"
                      >
                        <Github size={13} />
                        Code
                      </a>

                      {project.links.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-white/40 transition-all hover:border-white/25 hover:text-white"
                        >
                          <ExternalLink size={13} />
                          Live
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 flex items-center justify-between border-t border-white/8 pt-10"
        >
          <p className="font-mono text-xs tracking-widest text-white/20">More on GitHub -&gt;</p>
          <a
            href="https://github.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-xs tracking-widest text-white/30 transition-colors hover:text-white"
          >
            <Github size={12} />
            yourhandle
          </a>
        </motion.div>
      </div>

      <DevOpsPipelineModal
        open={Boolean(activePipelineProject)}
        project={activePipelineProject}
        onClose={() => setActivePipelineProject(null)}
      />
    </div>
  );
}
