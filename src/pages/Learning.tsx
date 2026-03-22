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
              <BookOpen size={16} className="text-white/30" />
              <span className="font-mono text-[10px] text-white/30 tracking-[0.3em] uppercase">GitHub Repositories</span>
              <div className="h-px flex-1 bg-white/8" />
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
                  className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-6 transition-all duration-300 hover:border-white/15 hover:bg-white/5"
                >
                  <div
                    className="absolute left-0 right-0 top-0 h-px opacity-40 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: `linear-gradient(90deg, transparent, ${repo.accent}, transparent)` }}
                  />

                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="text-sm font-bold leading-tight text-white">{repo.title}</h3>
                    <div className="flex flex-shrink-0 items-center gap-1 font-mono text-[10px] text-white/30">
                      <Star size={10} className="fill-white/20 text-white/30" />
                      {repo.stars}
                    </div>
                  </div>

                  <p className="mb-4 text-xs text-white/40 leading-relaxed">{repo.description}</p>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {repo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded border border-white/8 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/40"
                        >
                          {tag}
                        </span>
                      ))}
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
              <Rss size={16} className="text-white/30" />
              <span className="font-mono text-[10px] text-white/30 tracking-[0.3em] uppercase">Developer Blogs</span>
              <div className="h-px flex-1 bg-white/8" />
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
                  className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-6 transition-all duration-300 hover:border-white/15 hover:bg-white/5"
                >
                  <div
                    className="absolute left-0 right-0 top-0 h-px opacity-40 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: `linear-gradient(90deg, transparent, ${blog.accent}, transparent)` }}
                  />

                  <div className="mb-1 flex items-start justify-between gap-4">
                    <h3 className="text-sm font-bold leading-tight text-white">{blog.title}</h3>
                    <ExternalLink size={13} className="mt-0.5 flex-shrink-0 text-white/20 transition-colors group-hover:text-white/60" />
                  </div>

                  <p className="mb-3 font-mono text-[10px] text-white/30 tracking-widest">by {blog.author}</p>
                  <p className="mb-4 text-xs text-white/40 leading-relaxed">{blog.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-white/8 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
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
