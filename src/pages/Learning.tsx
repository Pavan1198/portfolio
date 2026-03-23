import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, ExternalLink, Rss, Star } from "lucide-react";
import { apiUrl } from "@/lib/api";

type RepoResource = {
  id: string;
  title: string;
  description: string;
  url: string;
  stars: string;
  tags: string[];
  accent: string;
};

type BlogResource = {
  id: string;
  title: string;
  author: string;
  description: string;
  url: string;
  tags: string[];
  accent: string;
};

type LearningData = {
  repos: RepoResource[];
  blogs: BlogResource[];
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const fallbackData: LearningData = {
  repos: [
    {
      id: "r01",
      title: "Free Programming Books",
      description: "Freely available programming books in many languages, curated in one of GitHub's best-known learning repositories.",
      url: "https://github.com/EbookFoundation/free-programming-books",
      stars: "340k+",
      tags: ["Books", "All Languages", "Beginner to Pro"],
      accent: "#6366f1",
    },
    {
      id: "r02",
      title: "System Design Primer",
      description: "A practical collection of large-scale system design notes, examples, and interview prep material.",
      url: "https://github.com/donnemartin/system-design-primer",
      stars: "280k+",
      tags: ["System Design", "Architecture", "Interview Prep"],
      accent: "#10b981",
    },
    {
      id: "r03",
      title: "Build Your Own X",
      description: "Learn deeply by rebuilding technologies like databases, browsers, emulators, and operating systems from scratch.",
      url: "https://github.com/codecrafters-io/build-your-own-x",
      stars: "310k+",
      tags: ["Projects", "Deep Dive", "All Levels"],
      accent: "#f59e0b",
    },
    {
      id: "r04",
      title: "Real-World DevOps",
      description: "Cloud Projects For Learning from Beginner to Advanced",
      url: "https://github.com/NotHarshhaa/DevOps-Projects",
      stars: "3.7k+",
      tags: ["Java", "Deep Dive", "Intermediate"],
      accent: "#ec4899",
    },
    {
      id: "r05",
      title: "Developer Roadmaps",
      description: "Community-driven roadmaps and resource lists to help developers choose and structure their learning paths.",
      url: "https://github.com/kamranahmedse/developer-roadmap",
      stars: "300k+",
      tags: ["Career", "Roadmap", "All Levels"],
      accent: "#14b8a6",
    },
    {
      id: "r06",
      title: "The Book of Secret Knowledge",
      description: "A large collection of manuals, cheatsheets, blogs, one-liners, tools, and reference material for developers.",
      url: "https://github.com/trimstray/the-book-of-secret-knowledge",
      stars: "145k+",
      tags: ["DevOps", "CLI", "Security", "Reference"],
      accent: "#8b5cf6",
    },
  ],
  blogs: [
    {
      id: "b01",
      title: "Paul Graham's Essays",
      author: "Paul Graham",
      description: "Timeless essays on startups, programming, life, and thinking that continue to influence how builders approach work.",
      url: "https://paulgraham.com/articles.html",
      tags: ["Startups", "Thinking", "Essays"],
      accent: "#6366f1",
    },
    {
      id: "b02",
      title: "Overreacted",
      author: "Dan Abramov",
      description: "Sharp writing on React internals, JavaScript mental models, and software engineering fundamentals.",
      url: "https://overreacted.io",
      tags: ["React", "JavaScript", "Mental Models"],
      accent: "#61dafb",
    },
    {
      id: "b03",
      title: "Martin Fowler's Blog",
      author: "Martin Fowler",
      description: "Architecture patterns, refactoring, microservices, and software design guidance from one of the industry's best teachers.",
      url: "https://martinfowler.com",
      tags: ["Architecture", "Patterns", "Enterprise"],
      accent: "#10b981",
    },
    {
      id: "b04",
      title: "Julia Evans' Blog",
      author: "Julia Evans",
      description: "Friendly and insightful posts on Linux, networking, debugging, and systems topics that make hard ideas approachable.",
      url: "https://jvns.ca",
      tags: ["Linux", "Systems", "Networking"],
      accent: "#f59e0b",
    },
    {
      id: "b05",
      title: "The Pragmatic Engineer",
      author: "Gergely Orosz",
      description: "Detailed writing on engineering culture, career growth, org design, and how modern software teams actually work.",
      url: "https://blog.pragmaticengineer.com",
      tags: ["Career", "Big Tech", "Engineering Culture"],
      accent: "#ec4899",
    },
    {
      id: "b06",
      title: "High Scalability",
      author: "Todd Hoff",
      description: "Case studies and architecture breakdowns showing how large systems scale in the real world.",
      url: "https://highscalability.com",
      tags: ["Scalability", "Architecture", "Case Studies"],
      accent: "#14b8a6",
    },
  ],
};

const PALETTE = [
  { bg: "rgba(99,102,241,0.15)", text: "#a5b4fc", border: "rgba(99,102,241,0.3)" },
  { bg: "rgba(16,185,129,0.15)", text: "#6ee7b7", border: "rgba(16,185,129,0.3)" },
  { bg: "rgba(245,158,11,0.15)", text: "#fcd34d", border: "rgba(245,158,11,0.3)" },
  { bg: "rgba(239,68,68,0.15)", text: "#fca5a5", border: "rgba(239,68,68,0.3)" },
  { bg: "rgba(168,85,247,0.15)", text: "#d8b4fe", border: "rgba(168,85,247,0.3)" },
  { bg: "rgba(6,182,212,0.15)", text: "#67e8f9", border: "rgba(6,182,212,0.3)" },
  { bg: "rgba(249,115,22,0.15)", text: "#fdba74", border: "rgba(249,115,22,0.3)" },
  { bg: "rgba(20,184,166,0.15)", text: "#5eead4", border: "rgba(20,184,166,0.3)" },
];

function getTagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function LearningPage() {
  const [, navigate] = useLocation();
  const { data } = useQuery<LearningData>({
    queryKey: ["learning"],
    queryFn: async () => {
      const response = await fetch(apiUrl("/api/learning"));
      if (!response.ok) {
        throw new Error("Unable to load learning resources");
      }
      return response.json();
    },
  });
  const { repos, blogs } = data ?? fallbackData;

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#0f0f11]/90 px-6 py-4 backdrop-blur-sm">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-mono text-xs text-white/40 hover:text-white transition-colors tracking-widest uppercase"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <span className="font-mono text-xs text-white/30 tracking-[0.25em] uppercase">03 / Learning</span>
        <span className="font-mono text-xs text-white/20 tracking-widest">{repos.length + blogs.length} Resources</span>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="mb-16">
          <motion.p variants={fadeUp} className="mb-4 font-mono text-xs text-white/30 tracking-[0.3em] uppercase">
            Paverse.in - Knowledge Base
          </motion.p>
          <motion.h1 variants={fadeUp} className="mb-6 text-[clamp(3rem,7vw,6rem)] font-black tracking-[-0.04em] leading-none uppercase text-white">
            LEARN &amp;
            <br />
            <span className="text-white/20">GROW</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="max-w-lg text-sm text-white/40 leading-relaxed">
            Handpicked GitHub repositories and developer blogs that shaped how I think, build, and grow as an engineer.
          </motion.p>
        </motion.div>

        <section className="mb-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-8 flex items-center gap-4">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
                style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.35)" }}
              >
                <BookOpen size={13} style={{ color: "#a5b4fc" }} />
              </div>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "#a5b4fc" }}>GitHub Repositories</span>
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.3), transparent)" }} />
              <span className="font-mono text-[10px] text-white/20 tracking-widest">{repos.length} repos</span>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {repos.map((repo) => (
                <motion.a
                  key={repo.id}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeUp}
                  className="group relative overflow-hidden rounded-2xl border transition-all duration-300 p-6"
                  style={{
                    background: `radial-gradient(ellipse at top left, ${repo.accent}14 0%, rgba(15,15,17,0.95) 60%)`,
                    borderColor: "rgba(255,255,255,0.07)",
                  }}
                  whileHover={{ scale: 1.01, borderColor: "rgba(255,255,255,0.14)" }}
                >
                  <div
                    className="absolute left-0 right-0 top-0 h-px opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: `linear-gradient(90deg, transparent, ${repo.accent}, transparent)` }}
                  />

                  <div
                    className="absolute top-0 left-0 w-28 h-28 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
                    style={{ background: repo.accent, transform: "translate(-30%, -30%)" }}
                  />

                  <div className="relative mb-3 flex items-start justify-between gap-4">
                    <h3 className="text-sm font-bold leading-tight text-white">{repo.title}</h3>
                    <div
                      className="flex flex-shrink-0 items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(250,204,21,0.12)", border: "1px solid rgba(250,204,21,0.25)", color: "#fcd34d" }}
                    >
                      <Star size={9} style={{ fill: "#fcd34d", color: "#fcd34d" }} />
                      {repo.stars}
                    </div>
                  </div>

                  <p className="relative mb-4 text-xs text-white/40 leading-relaxed">{repo.description}</p>

                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {repo.tags.map((tag) => {
                        const c = getTagColor(tag);
                        return (
                          <span
                            key={tag}
                            className="rounded px-2 py-0.5 font-mono text-[10px]"
                            style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                    <ExternalLink size={13} className="flex-shrink-0 text-white/20 transition-colors group-hover:text-white/60" />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </section>

        <section>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-8 flex items-center gap-4">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
                style={{ background: "rgba(236,72,153,0.2)", border: "1px solid rgba(236,72,153,0.35)" }}
              >
                <Rss size={13} style={{ color: "#f9a8d4" }} />
              </div>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "#f9a8d4" }}>Developer Blogs</span>
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(236,72,153,0.3), transparent)" }} />
              <span className="font-mono text-[10px] text-white/20 tracking-widest">{blogs.length} blogs</span>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {blogs.map((blog) => (
                <motion.a
                  key={blog.id}
                  href={blog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeUp}
                  className="group relative overflow-hidden rounded-2xl border transition-all duration-300 p-6"
                  style={{
                    background: `radial-gradient(ellipse at top left, ${blog.accent}14 0%, rgba(15,15,17,0.95) 60%)`,
                    borderColor: "rgba(255,255,255,0.07)",
                  }}
                  whileHover={{ scale: 1.01, borderColor: "rgba(255,255,255,0.14)" }}
                >
                  <div
                    className="absolute left-0 right-0 top-0 h-px opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: `linear-gradient(90deg, transparent, ${blog.accent}, transparent)` }}
                  />

                  <div
                    className="absolute top-0 left-0 w-28 h-28 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
                    style={{ background: blog.accent, transform: "translate(-30%, -30%)" }}
                  />

                  <div className="relative mb-1 flex items-start justify-between gap-4">
                    <h3 className="text-sm font-bold leading-tight text-white">{blog.title}</h3>
                    <ExternalLink size={13} className="mt-0.5 flex-shrink-0 text-white/20 transition-colors group-hover:text-white/60" />
                  </div>

                  <p className="relative mb-3 font-mono text-[10px] tracking-widest" style={{ color: blog.accent, opacity: 0.75 }}>by {blog.author}</p>
                  <p className="relative mb-4 text-xs text-white/40 leading-relaxed">{blog.description}</p>

                  <div className="relative flex flex-wrap gap-1.5">
                    {blog.tags.map((tag) => {
                      const c = getTagColor(tag);
                      return (
                        <span
                          key={tag}
                          className="rounded px-2 py-0.5 font-mono text-[10px]"
                          style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
