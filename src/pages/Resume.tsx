import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Mail, Phone, MapPin, Linkedin, Github, Download } from "lucide-react";
import { apiUrl } from "@/lib/api";
import { hasResumeAccess } from "@/lib/resumeAccess";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const resumeData = {
  name: "Your Name",
  title: "Full Stack Developer & Software Engineer",
  tagline: "Building enterprise-grade software with Python & React",
  contact: {
    email: "hello@paverse.in",
    phone: "+91 98765 43210",
    location: "India",
    linkedin: "linkedin.com/in/yourprofile",
    github: "github.com/yourhandle",
    website: "paverse.in",
  },
  summary:
    "Passionate full stack developer with expertise in building scalable web applications using Python and React. I specialize in creating clean, efficient, and enterprise-level solutions that make a real impact.",
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Company",
      period: "2023 – Present",
      location: "Remote",
      points: [
        "Led development of microservices architecture serving 1M+ requests daily",
        "Built React dashboards reducing operational time by 40%",
        "Implemented CI/CD pipelines using GitHub Actions and Docker",
        "Mentored junior developers and conducted code reviews",
      ],
    },
    {
      title: "Software Developer",
      company: "Startup Inc.",
      period: "2021 – 2023",
      location: "Bangalore, India",
      points: [
        "Developed RESTful APIs using Python (FastAPI/Django)",
        "Built responsive UIs with React and TypeScript",
        "Optimized database queries improving performance by 60%",
        "Collaborated with cross-functional teams in agile environment",
      ],
    },
    {
      title: "Junior Developer",
      company: "Agency Co.",
      period: "2019 – 2021",
      location: "Mumbai, India",
      points: [
        "Delivered 20+ client projects on time and within budget",
        "Worked with Python Flask and Vue.js for web development",
        "Integrated third-party APIs and payment gateways",
      ],
    },
  ],
  education: [
    {
      degree: "Bachelor of Technology — Computer Science",
      institution: "Your University",
      period: "2015 – 2019",
      grade: "CGPA: 8.5/10",
    },
  ],
  skills: {
    languages: ["Python", "TypeScript", "JavaScript", "SQL", "Bash"],
    frontend: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Redux"],
    backend: ["FastAPI", "Django", "Node.js", "Express", "GraphQL"],
    databases: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Supabase"],
    tools: ["Docker", "Git", "AWS", "GitHub Actions", "Linux", "Nginx"],
    ai: ["OpenAI API", "LangChain", "Hugging Face", "RAG", "Prompt Engineering"],
  },
  certifications: [
    "AWS Certified Developer – Associate",
    "Google Cloud Professional Data Engineer",
    "Meta React Developer Certificate",
  ],
};

type ResumeData = typeof resumeData;

export default function ResumePage() {
  const [, navigate] = useLocation();
  const canViewResume = hasResumeAccess();

  useEffect(() => {
    if (!canViewResume) {
      navigate("/");
    }
  }, [canViewResume, navigate]);

  const { data: apiData } = useQuery<ResumeData>({
    queryKey: ["resume"],
    queryFn: async () => {
      const response = await fetch(apiUrl("/api/resume"));
      if (!response.ok) {
        throw new Error("Unable to load resume data");
      }
      return response.json();
    },
  });
  const resume = apiData ?? resumeData;

  if (!canViewResume) {
    return null;
  }

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
        <span className="font-mono text-xs text-white/30 tracking-[0.25em] uppercase">01 / Resume</span>
        <button className="flex items-center gap-2 font-mono text-xs text-white/40 hover:text-white transition-colors tracking-widest uppercase">
          <Download size={14} />
          PDF
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Name & Title */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mb-16"
        >
          <motion.p variants={fadeUp} className="font-mono text-xs text-white/30 tracking-[0.3em] uppercase mb-4">
            Paverse.in — Professional Profile
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-[clamp(3rem,7vw,6rem)] font-black tracking-[-0.04em] leading-none uppercase text-white mb-4">
            {resume.name}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-white/60 font-light mb-6 tracking-wide">
            {resume.title}
          </motion.p>
          <motion.p variants={fadeUp} className="text-sm text-white/30 max-w-xl leading-relaxed">
            {resume.summary}
          </motion.p>

          {/* Contact row */}
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
            <a href={`mailto:${resume.contact.email}`} className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors font-mono">
              <Mail size={12} />
              {resume.contact.email}
            </a>
            <span className="flex items-center gap-2 text-xs text-white/40 font-mono">
              <Phone size={12} />
              {resume.contact.phone}
            </span>
            <span className="flex items-center gap-2 text-xs text-white/40 font-mono">
              <MapPin size={12} />
              {resume.contact.location}
            </span>
            <a href={`https://${resume.contact.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors font-mono">
              <Github size={12} />
              {resume.contact.github}
            </a>
            <a href={`https://${resume.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors font-mono">
              <Linkedin size={12} />
              {resume.contact.linkedin}
            </a>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-white/8 mb-16" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-16">
            {/* Experience */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
                <span className="font-mono text-[10px] text-white/30 tracking-[0.3em] uppercase">01</span>
                <h2 className="text-2xl font-black tracking-[-0.02em] uppercase">Experience</h2>
                <div className="flex-1 h-px bg-white/8" />
              </motion.div>

              <div className="space-y-10">
                {resume.experience.map((exp, i) => (
                  <motion.div key={i} variants={fadeUp} className="group">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-bold text-white text-lg tracking-tight">{exp.title}</h3>
                        <p className="text-white/50 text-sm font-medium">{exp.company}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="font-mono text-xs text-white/30 tracking-wider block">{exp.period}</span>
                        <span className="font-mono text-[10px] text-white/20 tracking-wider">{exp.location}</span>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {exp.points.map((point, j) => (
                        <li key={j} className="text-sm text-white/40 flex gap-3 leading-relaxed">
                          <span className="text-white/20 flex-shrink-0 mt-1">—</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Education */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
                <span className="font-mono text-[10px] text-white/30 tracking-[0.3em] uppercase">02</span>
                <h2 className="text-2xl font-black tracking-[-0.02em] uppercase">Education</h2>
                <div className="flex-1 h-px bg-white/8" />
              </motion.div>

              {resume.education.map((edu, i) => (
                <motion.div key={i} variants={fadeUp} className="flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-white">{edu.degree}</h3>
                    <p className="text-white/50 text-sm">{edu.institution}</p>
                    <p className="text-white/30 text-xs font-mono mt-1">{edu.grade}</p>
                  </div>
                  <span className="font-mono text-xs text-white/30 tracking-wider flex-shrink-0">{edu.period}</span>
                </motion.div>
              ))}
            </motion.section>
          </div>

          {/* Right column */}
          <div className="space-y-12">
            {/* Skills */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                <span className="font-mono text-[10px] text-white/30 tracking-[0.3em] uppercase">03</span>
                <h2 className="text-lg font-black tracking-[-0.02em] uppercase">Skills</h2>
              </motion.div>

              <div className="space-y-6">
                {Object.entries(resume.skills).map(([category, items]) => (
                  <motion.div key={category} variants={fadeUp}>
                    <p className="font-mono text-[10px] text-white/30 tracking-[0.25em] uppercase mb-2">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded text-[11px] font-mono text-white/60 bg-white/5 border border-white/8 hover:border-white/20 hover:text-white transition-all"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Certifications */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                <span className="font-mono text-[10px] text-white/30 tracking-[0.3em] uppercase">04</span>
                <h2 className="text-lg font-black tracking-[-0.02em] uppercase">Certs</h2>
              </motion.div>

              <div className="space-y-3">
                {resume.certifications.map((cert, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex gap-3 text-sm text-white/40 leading-snug">
                    <span className="text-white/20 flex-shrink-0">—</span>
                    {cert}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}
