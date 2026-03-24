import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { BrainCircuit, ChevronLeft, Cog, FolderKanban, SendHorizontal } from "lucide-react";
import { useLocation } from "wouter";
import { apiUrl, hasExternalApi } from "@/lib/api";

const DEFAULT_SUGGESTIONS = [
  "Tell me about yourself",
  "What is CI/CD?",
  "What is Docker?",
  "What is Kubernetes?",
  "What is DevOps?",
  "Your experience with AWS?",
  "What is Terraform?",
  "What is Jenkins?",
];

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatMode = "live" | "local";

const INITIAL_MESSAGE =
  "Hey! I'm Pavatar.\n\nI'm Pavan's AI twin - ask me anything about DevOps, AI/ML, or my projects. Treat this like a real conversation with me!";

const ABOUT_ITEMS = [
  {
    icon: Cog,
    label: "DevOps",
    sub: "CI/CD - Docker - K8s - AWS - Terraform",
  },
  {
    icon: BrainCircuit,
    label: "AI/ML",
    sub: "Automation - ML workflows - LLM systems",
  },
  {
    icon: FolderKanban,
    label: "Projects",
    sub: "Confidential - reach out at paverse.in",
  },
];

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: "5px", padding: "6px 2px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "999px",
            background: "#00d4aa",
            animation: "epBounce 1.2s infinite ease-in-out",
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}

function Avatar({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "999px",
        flexShrink: 0,
        background: "linear-gradient(135deg, #0a2a2a, #00d4aa)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1.5px solid rgba(0,212,170,0.4)",
        boxShadow: "0 0 12px rgba(0,212,170,0.25)",
        fontSize: size * 0.38,
        fontWeight: 800,
        color: "#00d4aa",
        letterSpacing: "-0.5px",
        fontFamily: "'Space Grotesk', var(--app-font-sans)",
      }}
    >
      PA
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "16px",
        gap: "10px",
        alignItems: "flex-end",
        animation: "epFadeIn 0.2s ease forwards",
      }}
    >
      {!isUser && <Avatar size={30} />}
      <div
        style={{
          maxWidth: "80%",
          padding: "11px 15px",
          borderRadius: isUser ? "16px 16px 3px 16px" : "16px 16px 16px 3px",
          background: isUser
            ? "linear-gradient(135deg, #00d4aa, #00a884)"
            : "rgba(255,255,255,0.04)",
          color: isUser ? "#001a14" : "#cbd5e1",
          fontSize: "13.5px",
          lineHeight: "1.65",
          border: isUser ? "none" : "1px solid rgba(0,212,170,0.12)",
          fontFamily: "'Plus Jakarta Sans', var(--app-font-sans)",
          fontWeight: isUser ? 600 : 400,
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        {message.content}
      </div>
      {isUser && (
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "999px",
            flexShrink: 0,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            color: "#dbe4ec",
            fontFamily: "'Space Mono', var(--app-font-mono)",
          }}
        >
          YOU
        </div>
      )}
    </div>
  );
}

function SuggestedChip({ label, onClick }: { label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "6px 13px",
        borderRadius: "999px",
        fontSize: "11.5px",
        background: hovered ? "rgba(0,212,170,0.18)" : "rgba(0,212,170,0.07)",
        border: "1px solid rgba(0,212,170,0.25)",
        color: "#00d4aa",
        cursor: "pointer",
        fontFamily: "'Space Mono', var(--app-font-mono)",
        transition: "all 0.18s",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

async function getErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as { detail?: string; error?: string };
    return data.detail ?? data.error ?? "Something broke - try again?";
  } catch {
    return "Something broke - try again?";
  }
}

function resizeTextarea(textarea: HTMLTextAreaElement) {
  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
}

function normalizePrompt(prompt: string) {
  return prompt.toLowerCase().replace(/[^\w\s/+.-]/g, " ").replace(/\s+/g, " ").trim();
}

function includesAny(prompt: string, patterns: string[]) {
  return patterns.some((pattern) => prompt.includes(pattern));
}

function getFallbackReply(prompt: string) {
  const normalized = normalizePrompt(prompt);

  if (
    includesAny(normalized, [
      "tell me about yourself",
      "about yourself",
      "introduce yourself",
      "who are you",
      "who r you",
    ])
  ) {
    return "I'm Pavan, a DevOps engineer focused on cloud infrastructure, CI/CD, containers, automation, and platform reliability. My main stack includes AWS, Jenkins, Docker, Terraform, and Kubernetes, and I'm also interested in practical AI/ML workflows that improve engineering operations.";
  }

  if (includesAny(normalized, ["what is ci/cd", "what is cicd", "ci/cd", "cicd"])) {
    return "CI/CD is basically the pipeline that takes code from commit to deployment in a reliable, repeatable way. CI is about automatically building and testing every change, and CD is about pushing that validated change toward release or production. In my experience, this is where tools like Jenkins, Docker, Kubernetes, and cloud infrastructure really come together.";
  }

  if (includesAny(normalized, [" what is ci ", " continuous integration", "what is ci"])) {
    return "CI means continuous integration. So basically, every time code is pushed, the pipeline automatically builds it, runs tests, and checks whether the change is safe to move forward. The main goal is to catch issues early and keep delivery steady as the codebase evolves.";
  }

  if (includesAny(normalized, [" what is cd ", " continuous delivery", " continuous deployment", "what is cd"])) {
    return "CD can mean continuous delivery or continuous deployment. Delivery means the code is always release-ready but still needs approval, while deployment means it can go live automatically. In my experience, teams usually choose the level of automation based on production risk and release controls.";
  }

  if (includesAny(normalized, ["docker"])) {
    return "Docker is what I use to package an application with everything it needs so it runs the same way across environments. The big win is consistency between development, testing, and production. In practice, I use it to standardize builds, deployments, and application portability.";
  }

  if (includesAny(normalized, ["kubernetes", "k8s"])) {
    return "Kubernetes is the orchestration layer I use to manage containers at scale. It helps with deployment, scaling, self-healing, and service discovery, which becomes really important once you're running multiple services in production. I mainly use it for running containerized workloads in a reliable and repeatable way.";
  }

  if (includesAny(normalized, ["devops"])) {
    return "DevOps is the combination of culture, automation, and operational discipline that helps teams ship software faster and more reliably. For me, it means building strong CI/CD pipelines, managing infrastructure as code, containerizing applications, and making deployments predictable. I usually think of DevOps as reducing manual effort while improving stability.";
  }

  if (includesAny(normalized, ["aws", "amazon web services"])) {
    return "I've worked with AWS as part of my DevOps workflow, especially around infrastructure, deployments, and CI/CD integration. My focus is usually on making cloud environments scalable, secure, and easier to operate through automation and good release practices.";
  }

  if (includesAny(normalized, ["terraform"])) {
    return "Terraform is what I use for infrastructure as code so environments can be provisioned in a repeatable way. Instead of creating resources manually, I define them in code, version them, and apply them consistently across environments. In practice, this makes deployments cleaner and reduces configuration drift.";
  }

  if (includesAny(normalized, ["jenkins"])) {
    return "Jenkins is one of the main tools I've used to build CI/CD pipelines. It helps automate the whole flow from code checkout to build, test, artifact handling, and deployment steps. In real projects, I use it to remove manual handoffs and keep releases predictable.";
  }

  if (includesAny(normalized, ["project", "projects", "personal project", "personal projects"])) {
    return "I'm actually working on a few personal projects right now but they're confidential at this stage - can't spill the details just yet! You can reach out to Pavan directly at paverse.in if you're curious.";
  }

  if (includesAny(normalized, ["ai", "ml", "machine learning", "computer vision", "llm"])) {
    return "I'm interested in AI/ML from a practical engineering angle, especially where it helps with automation, operational intelligence, or developer workflows. I tend to think about AI as a way to make systems and teams more effective, not just as a standalone feature.";
  }

  if (includesAny(normalized, ["experience", "work experience"])) {
    return "I have 4+ years of experience in DevOps and cloud engineering. My work has focused on CI/CD pipelines, Docker, Kubernetes, Terraform, Jenkins, and AWS, with a strong emphasis on automation, deployment reliability, and maintainable infrastructure.";
  }

  return "That's something Pavan hasn't taught me yet! You can reach out to him directly at paverse.in to ask him that.";
}

function shouldUseLocalMode(errorMessage?: string) {
  if (!hasExternalApi) {
    return true;
  }

  if (!errorMessage) {
    return false;
  }

  const normalized = errorMessage.toLowerCase();
  return (
    normalized.includes("failed to fetch") ||
    normalized.includes("networkerror") ||
    normalized.includes("network error") ||
    normalized.includes("not configured") ||
    normalized.includes("the chatbot request failed") ||
    normalized.includes("something broke")
  );
}

function getNextSuggestions(prompt: string) {
  const normalized = normalizePrompt(prompt);

  if (
    includesAny(normalized, [
      "tell me about yourself",
      "about yourself",
      "introduce yourself",
      "who are you",
      "who r you",
    ])
  ) {
    return [
      "What tools do you use daily?",
      "Tell me about your Kubernetes experience",
      "How do you use AWS in your work?",
      "What AI/ML project have you worked on?",
    ];
  }

  if (includesAny(normalized, ["what is ci/cd", "what is cicd", "ci/cd", "cicd"])) {
    return [
      "What is the difference between CI and CD?",
      "Which CI/CD tools have you used?",
      "How do you handle deployments in production?",
      "How do you design a pipeline from scratch?",
    ];
  }

  if (includesAny(normalized, ["docker"])) {
    return [
      "Why use Docker over virtual machines?",
      "How do you write a good Dockerfile?",
      "How do you debug container issues?",
      "How do Docker and Kubernetes work together?",
    ];
  }

  if (includesAny(normalized, ["kubernetes", "k8s"])) {
    return [
      "What are pods and deployments?",
      "How do you scale applications in Kubernetes?",
      "How do you monitor Kubernetes workloads?",
      "How do you use Kubernetes in real projects?",
    ];
  }

  if (includesAny(normalized, ["devops"])) {
    return [
      "What does DevOps mean in real projects?",
      "How do you set up CI/CD for a team?",
      "What is infrastructure as code?",
      "How do you improve release reliability?",
    ];
  }

  if (includesAny(normalized, ["aws", "amazon web services"])) {
    return [
      "Which AWS services do you use most?",
      "How do you secure AWS workloads?",
      "How do you automate infrastructure on AWS?",
      "Tell me about your CI/CD work on AWS",
    ];
  }

  if (includesAny(normalized, ["terraform"])) {
    return [
      "Why use Terraform for infrastructure?",
      "How do you manage Terraform state?",
      "How do you structure Terraform modules?",
      "How do you avoid configuration drift?",
    ];
  }

  if (includesAny(normalized, ["jenkins"])) {
    return [
      "How do you build pipelines in Jenkins?",
      "How do you manage Jenkins agents?",
      "How do you secure Jenkins credentials?",
      "What Jenkins challenges have you faced?",
    ];
  }

  if (includesAny(normalized, ["project", "projects"])) {
    return [
      "Tell me about your DevOps experience",
      "What is your Kubernetes experience?",
      "How do you use AI/ML in your work?",
      "What tools are you strongest in?",
    ];
  }

  return [
    "Tell me about yourself",
    "What is your DevOps experience?",
    "How do you use Kubernetes?",
    "What tools do you use daily?",
  ];
}

export default function ChatbotPage() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: INITIAL_MESSAGE,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>(
    import.meta.env.PROD && !hasExternalApi ? "local" : "live",
  );
  const [modeNote, setModeNote] = useState(
    import.meta.env.PROD && !hasExternalApi
      ? "Live AI is not configured in this deployment, so Pavatar is replying from a public-safe built-in local profile."
      : "",
  );
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (text?: string) => {
    const nextPrompt = (text ?? input).trim();
    if (!nextPrompt || loading) {
      return;
    }

    setInput("");
    setSuggestions(getNextSuggestions(nextPrompt));

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    const nextMessages: Message[] = [...messages, { role: "user", content: nextPrompt }];
    setMessages(nextMessages);
    setLoading(true);

    const replyWithFallback = (reason: string) => {
      setChatMode("local");
      setModeNote(reason);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: getFallbackReply(nextPrompt) },
      ]);
    };

    if (import.meta.env.PROD && !hasExternalApi) {
      replyWithFallback(
        "Live AI is not configured in this deployment, so Pavatar is replying from a public-safe built-in local profile.",
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(apiUrl("/api/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data = (await response.json()) as { reply?: string };
      const reply = data.reply?.trim() || "Hmm, something went wrong on my end. Try again!";
      setChatMode("live");
      setModeNote("");
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something broke - try again?";

      if (shouldUseLocalMode(errorMessage)) {
        replyWithFallback(
          hasExternalApi
            ? "Live AI is unavailable right now, so Pavatar switched to a public-safe built-in local profile."
            : "Live AI is not configured in this deployment, so Pavatar is replying from a public-safe built-in local profile.",
        );
      } else {
        setMessages((current) => [...current, { role: "assistant", content: errorMessage }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&family=Space+Grotesk:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap");

        @keyframes epBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        @keyframes epFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes headerGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,212,170,0.1); }
          50% { box-shadow: 0 0 40px rgba(0,212,170,0.25); }
        }

        .ep-input {
          outline: none;
          background: transparent;
        }

        .ep-input::placeholder {
          color: rgba(100,180,160,0.4);
        }

        .ep-send:hover:not(:disabled) {
          background: #00b894 !important;
          transform: scale(1.05);
        }

        .ep-send:active {
          transform: scale(0.96);
        }

        .ep-chat-shell ::-webkit-scrollbar {
          width: 3px;
        }

        .ep-chat-shell ::-webkit-scrollbar-track {
          background: transparent;
        }

        .ep-chat-shell ::-webkit-scrollbar-thumb {
          background: rgba(0,212,170,0.2);
          border-radius: 3px;
        }

        .ep-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }
      `}</style>

      <div
        className="ep-chat-shell"
        style={{
          minHeight: "100vh",
          background: "#030d0b",
          fontFamily: "'Plus Jakarta Sans', var(--app-font-sans)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage: `
              linear-gradient(rgba(0,212,170,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,212,170,1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "300px",
            borderRadius: "999px",
            background: "radial-gradient(ellipse, rgba(0,212,170,0.06) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "999px",
            background: "radial-gradient(circle, rgba(0,180,150,0.04) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div
          style={{
            borderBottom: "1px solid rgba(0,212,170,0.12)",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            justifyContent: "space-between",
            flexWrap: "wrap",
            background: "rgba(0,212,170,0.03)",
            animation: "headerGlow 4s ease-in-out infinite",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
            <Avatar size={44} />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "'Space Grotesk', var(--app-font-sans)",
                  fontWeight: 800,
                  fontSize: "18px",
                  color: "#fff",
                  letterSpacing: "-0.5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                Pavatar
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "1.5px",
                    color: "#00d4aa",
                    background: "rgba(0,212,170,0.1)",
                    border: "1px solid rgba(0,212,170,0.25)",
                    padding: "2px 7px",
                    borderRadius: "999px",
                    fontFamily: "'Space Mono', var(--app-font-mono)",
                  }}
                >
                  AI TWIN
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "3px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "999px",
                    background: "#00d4aa",
                    animation: "glowPulse 2s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: "11.5px",
                    color: "#4a9a88",
                    fontFamily: "'Space Mono', var(--app-font-mono)",
                  }}
                >
                  Pavan - DevOps Engineer - 4+ yrs
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: "11px",
                color: "#cbd5e1",
                fontFamily: "'Space Mono', var(--app-font-mono)",
                letterSpacing: "0.5px",
                cursor: "pointer",
              }}
            >
              <ChevronLeft size={14} />
              Back
            </button>
            <div
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                background: "rgba(0,212,170,0.06)",
                border: "1px solid rgba(0,212,170,0.15)",
                fontSize: "11px",
                color: "#4a9a88",
                fontFamily: "'Space Mono', var(--app-font-mono)",
                letterSpacing: "0.5px",
              }}
            >
              paverse.in
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 20px",
            maxWidth: "760px",
            width: "100%",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          {chatMode === "local" && (
            <div
              style={{
                marginBottom: "18px",
                borderRadius: "14px",
                border: "1px solid rgba(250,204,21,0.18)",
                background: "rgba(250,204,21,0.08)",
                color: "#fef3c7",
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontFamily: "'Space Mono', var(--app-font-mono)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#fcd34d",
                  marginBottom: "6px",
                }}
              >
                Public-Safe Local Mode
              </div>
              <div
                style={{
                  fontSize: "12.5px",
                  lineHeight: "1.6",
                  color: "#d6e3dc",
                }}
              >
                {modeNote}
              </div>
            </div>
          )}

          {messages.length === 1 && (
            <div
              style={{
                background: "rgba(0,212,170,0.04)",
                border: "1px solid rgba(0,212,170,0.12)",
                borderRadius: "14px",
                padding: "16px 18px",
                marginBottom: "24px",
                animation: "epFadeIn 0.4s ease forwards",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "'Space Mono', var(--app-font-mono)",
                  color: "#00d4aa",
                  letterSpacing: "1.5px",
                  marginBottom: "10px",
                }}
              >
                ABOUT THIS TWIN
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {ABOUT_ITEMS.map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span
                      style={{
                        width: "32px",
                        height: "32px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px",
                        border: "1px solid rgba(0,212,170,0.16)",
                        background: "rgba(0,212,170,0.06)",
                        color: "#00d4aa",
                      }}
                    >
                      <item.icon size={16} />
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#e2e8f0",
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#4a9a88",
                          marginTop: "2px",
                        }}
                      >
                        {item.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <ChatMessage key={`${message.role}-${index}-${message.content.slice(0, 24)}`} message={message} />
          ))}

          {loading && (
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-end",
                marginBottom: "16px",
                animation: "epFadeIn 0.2s ease",
              }}
            >
              <Avatar size={30} />
              <div
                style={{
                  padding: "10px 16px",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "16px 16px 16px 3px",
                  border: "1px solid rgba(0,212,170,0.12)",
                }}
              >
                <TypingDots />
              </div>
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <div style={{ marginTop: "8px", animation: "epFadeIn 0.5s ease 0.2s both" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "'Space Mono', var(--app-font-mono)",
                  color: "#4a9a88",
                  marginBottom: "10px",
                  letterSpacing: "0.5px",
                }}
              >
                {messages.length === 1 ? "Try asking:" : "You can also ask:"}
              </div>
              <div className="ep-chip-row">
                {suggestions.map((question) => (
                  <SuggestedChip key={question} label={question} onClick={() => void sendMessage(question)} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(0,212,170,0.1)",
            padding: "16px 20px",
            background: "rgba(3,13,11,0.95)",
            backdropFilter: "blur(10px)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              maxWidth: "760px",
              margin: "0 auto",
              display: "flex",
              gap: "10px",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                flex: 1,
                background: "rgba(0,212,170,0.04)",
                border: "1px solid rgba(0,212,170,0.18)",
                borderRadius: "14px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "flex-end",
                gap: "10px",
                transition: "border-color 0.2s",
              }}
              onFocusCapture={(event) => {
                event.currentTarget.style.borderColor = "rgba(0,212,170,0.45)";
              }}
              onBlurCapture={(event) => {
                event.currentTarget.style.borderColor = "rgba(0,212,170,0.18)";
              }}
            >
              <textarea
                ref={inputRef}
                className="ep-input"
                value={input}
                onChange={(event) => {
                  setInput(event.currentTarget.value);
                  resizeTextarea(event.currentTarget);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask Pavatar anything..."
                rows={1}
                style={{
                  flex: 1,
                  resize: "none",
                  border: "none",
                  color: "#e2e8f0",
                  fontSize: "14px",
                  fontFamily: "'Plus Jakarta Sans', var(--app-font-sans)",
                  lineHeight: "1.5",
                  maxHeight: "120px",
                  overflow: "hidden",
                }}
              />
            </div>
            <button
              type="button"
              className="ep-send"
              onClick={() => void sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                flexShrink: 0,
                background: input.trim() && !loading ? "#00d4aa" : "rgba(0,212,170,0.1)",
                border: "1px solid rgba(0,212,170,0.2)",
                cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                color: input.trim() && !loading ? "#001a14" : "#00d4aa",
              }}
            >
              {loading ? (
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "999px",
                    border: "2px solid rgba(0,212,170,0.3)",
                    borderTopColor: "#00d4aa",
                    animation: "epBounce 0.8s linear infinite",
                  }}
                />
              ) : (
                <SendHorizontal size={18} />
              )}
            </button>
          </div>
          <div
            style={{
              maxWidth: "760px",
              margin: "8px auto 0",
              fontSize: "11px",
              color: "rgba(74,154,136,0.5)",
              fontFamily: "'Space Mono', var(--app-font-mono)",
              textAlign: "center",
            }}
          >
            Pavatar knows DevOps - AI/ML - Projects - powered by paverse.in
          </div>
        </div>
      </div>
    </>
  );
}
