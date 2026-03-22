import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Send, CheckCircle, AlertCircle, Mail, MapPin, Github, Linkedin } from "lucide-react";
import { apiUrl, hasExternalApi } from "@/lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const contactDefaults = {
  email: "paversehq@gmail.com",
  location: "India",
  github: "github.com/paverse",
  linkedin: "linkedin.com/in/paverse",
};

export default function ContactPage() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { data: apiResume } = useQuery({
    queryKey: ["resume"],
    queryFn: async () => {
      const response = await fetch(apiUrl("/api/resume"));
      if (!response.ok) {
        throw new Error("Unable to load contact info");
      }
      return response.json();
    },
  });
  const contact = apiResume?.contact ?? contactDefaults;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

     if (!hasExternalApi) {
      const params = new URLSearchParams({
        subject: form.subject || `Portfolio inquiry from ${form.name}`,
        body: `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
      });
      window.location.href = `mailto:${contact.email}?${params.toString()}`;
      setStatus("success");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Server error");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  const inputClass =
    "w-full bg-white/3 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all";

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white">
      <header className="sticky top-0 z-50 bg-[#0f0f11]/90 backdrop-blur-sm border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-mono text-xs text-white/40 hover:text-white transition-colors tracking-widest uppercase"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <span className="font-mono text-xs text-white/30 tracking-[0.25em] uppercase">04 / Contact</span>
        <span className="font-mono text-xs text-white/20 tracking-widest">Get In Touch</span>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="mb-16">
          <motion.p variants={fadeUp} className="font-mono text-xs text-white/30 tracking-[0.3em] uppercase mb-4">
            Paverse.in — Contact
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-[clamp(3rem,7vw,6rem)] font-black tracking-[-0.04em] leading-none uppercase text-white mb-6">
            LET'S
            <br />
            <span className="text-white/20">CONNECT</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm text-white/40 max-w-lg leading-relaxed">
            Have a project in mind, a question, or just want to say hello? Send me a message and I'll get back to you.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-10"
          >
            <motion.div variants={fadeUp}>
              <p className="font-mono text-[10px] text-white/30 tracking-[0.3em] uppercase mb-4">Reach Me</p>
              <div className="space-y-4">
                <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors">
                  <Mail size={14} className="text-white/25" />
                  {contact.email}
                </a>
                <span className="flex items-center gap-3 text-sm text-white/50">
                  <MapPin size={14} className="text-white/25" />
                  {contact.location}
                </span>
                <a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors">
                  <Github size={14} className="text-white/25" />
                  {contact.github}
                </a>
                <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors">
                  <Linkedin size={14} className="text-white/25" />
                  {contact.linkedin}
                </a>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="h-px bg-white/8" />

            <motion.div variants={fadeUp}>
              <p className="font-mono text-[10px] text-white/30 tracking-[0.3em] uppercase mb-3">Response Time</p>
              <p className="text-sm text-white/40 leading-relaxed">
                I typically respond within 24–48 hours. For urgent matters, email directly.
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            {!hasExternalApi && (
              <div className="mb-6 rounded-2xl border border-white/10 bg-white/4 px-5 py-4 text-sm text-white/45">
                GitHub Pages is serving the static frontend, so this form will open your email app instead of posting to the Python API.
              </div>
            )}
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <CheckCircle size={40} className="text-emerald-400 mb-6" />
                <h2 className="text-2xl font-black tracking-tight mb-3">Message Sent!</h2>
                <p className="text-white/40 text-sm mb-8 max-w-sm">
                  Thanks for reaching out. I'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="font-mono text-xs text-white/40 hover:text-white transition-colors tracking-widest uppercase border border-white/10 hover:border-white/25 px-5 py-2.5 rounded-xl"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] text-white/30 tracking-[0.25em] uppercase block mb-2">
                      Name *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-white/30 tracking-[0.25em] uppercase block mb-2">
                      Email *
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[10px] text-white/30 tracking-[0.25em] uppercase block mb-2">
                    Subject
                  </label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] text-white/30 tracking-[0.25em] uppercase block mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={7}
                    placeholder="Tell me about your project, idea, or question..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-400 text-xs font-mono">
                    <AlertCircle size={13} />
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center gap-2.5 px-6 py-3 bg-white text-black font-mono text-xs tracking-widest uppercase rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <span className="inline-block w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
