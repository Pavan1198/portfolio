import json
import os
from datetime import datetime
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Paverse Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CONTACTS_FILE = os.path.join(os.path.dirname(__file__), "contacts.json")
RESUME_PASSWORD = os.getenv("RESUME_PASSWORD", "paverse2025")


def load_contacts():
    if not os.path.exists(CONTACTS_FILE):
        return []

    with open(CONTACTS_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def save_contact(contact: dict[str, Any]):
    contacts = load_contacts()
    contacts.append(contact)

    with open(CONTACTS_FILE, "w", encoding="utf-8") as file:
        json.dump(contacts, file, indent=2)


class ContactMessage(BaseModel):
    name: str
    email: str
    subject: str
    message: str


class PasswordCheck(BaseModel):
    password: str


@app.post("/api/auth/resume")
def check_resume_password(body: PasswordCheck):
    if body.password == RESUME_PASSWORD:
        return {"success": True}

    raise HTTPException(status_code=401, detail="Incorrect password")


@app.get("/api/resume")
def get_resume():
    return {
        "name": "Your Name",
        "title": "Full Stack Developer",
        "summary": "Passionate developer with expertise in building scalable web applications and solving complex problems with clean, maintainable code.",
        "contact": {
            "email": "hello@paverse.in",
            "phone": "+91 00000 00000",
            "location": "India",
            "github": "github.com/yourhandle",
            "linkedin": "linkedin.com/in/yourhandle",
            "website": "paverse.in",
        },
        "experience": [
            {
                "title": "Senior Full Stack Developer",
                "company": "Tech Company",
                "period": "2022 - Present",
                "location": "Remote",
                "points": [
                    "Led development of core product features used by 50,000+ users",
                    "Architected microservices infrastructure reducing latency by 40%",
                    "Mentored a team of 5 junior developers",
                ],
            },
            {
                "title": "Software Engineer",
                "company": "Startup Inc.",
                "period": "2020 - 2022",
                "location": "Bengaluru, India",
                "points": [
                    "Built REST APIs serving millions of requests per day",
                    "Improved CI/CD pipeline reducing deployment time by 60%",
                    "Integrated third-party payment and analytics services",
                ],
            },
        ],
        "education": [
            {
                "degree": "B.Tech in Computer Science",
                "institution": "Your University",
                "period": "2016 - 2020",
                "grade": "First Class with Distinction",
            }
        ],
        "skills": {
            "Languages": ["Python", "TypeScript", "JavaScript", "SQL"],
            "Frontend": ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
            "Backend": ["FastAPI", "Node.js", "Express", "Django"],
            "DevOps": ["Docker", "GitHub Actions", "AWS", "Linux"],
            "Databases": ["PostgreSQL", "MongoDB", "Redis"],
        },
        "certifications": [
            "AWS Certified Developer - Associate",
            "Google Cloud Professional Data Engineer",
            "Meta Front-End Developer Certificate",
        ],
    }


@app.get("/api/projects")
def get_projects():
    return [
        {
            "id": "01",
            "title": "Paverse Platform",
            "category": "Web Platform",
            "status": "Live",
            "description": "An enterprise-grade personal portfolio and professional showcase platform with editorial design and smooth animations.",
            "stack": ["React", "FastAPI", "Python", "Tailwind CSS", "Framer Motion"],
            "highlights": ["paverse.in", "Enterprise design", "Mobile-first"],
            "accent": "#6366f1",
            "links": {
                "github": "https://github.com/yourhandle/paverse",
                "live": "https://paverse.in",
            },
        },
        {
            "id": "02",
            "title": "AI Code Reviewer",
            "category": "Developer Tool",
            "status": "Open Source",
            "description": "A CLI tool that uses large language models to review pull requests, suggest improvements, and catch potential bugs before they hit production.",
            "stack": ["Python", "OpenAI API", "GitHub API", "Click", "Rich"],
            "highlights": ["500+ GitHub stars", "PR automation", "Multi-model"],
            "accent": "#10b981",
            "links": {
                "github": "https://github.com/yourhandle/ai-reviewer",
                "live": None,
            },
        },
        {
            "id": "03",
            "title": "Real-time Analytics Dashboard",
            "category": "Data Visualization",
            "status": "Beta",
            "description": "A real-time analytics platform with websocket-powered live updates, custom charting, and exportable reports for SaaS businesses.",
            "stack": ["React", "FastAPI", "WebSockets", "PostgreSQL", "Recharts"],
            "highlights": ["Live data", "Custom charts", "CSV export"],
            "accent": "#f59e0b",
            "links": {
                "github": "https://github.com/yourhandle/analytics",
                "live": "https://analytics.paverse.in",
            },
        },
    ]


@app.get("/api/learning")
def get_learning():
    return {
        "repos": [
            {
                "id": "r01",
                "title": "Free Programming Books",
                "description": "Freely available programming books in many languages - one of the largest curated lists on GitHub.",
                "url": "https://github.com/EbookFoundation/free-programming-books",
                "stars": "340k+",
                "tags": ["Books", "All Languages", "Beginner to Pro"],
                "accent": "#6366f1",
            },
            {
                "id": "r02",
                "title": "System Design Primer",
                "description": "Learn how to design large-scale systems with architecture patterns, notes, and interview prep examples.",
                "url": "https://github.com/donnemartin/system-design-primer",
                "stars": "280k+",
                "tags": ["System Design", "Architecture", "Interview Prep"],
                "accent": "#10b981",
            },
            {
                "id": "r03",
                "title": "Build Your Own X",
                "description": "Master programming by recreating technologies from scratch, from databases and compilers to browsers and operating systems.",
                "url": "https://github.com/codecrafters-io/build-your-own-x",
                "stars": "310k+",
                "tags": ["Projects", "Deep Dive", "All Levels"],
                "accent": "#f59e0b",
            },
            {
                "id": "r04",
                "title": "You Don't Know JS",
                "description": "A deep-dive series into the core mechanisms of JavaScript, including scope, closures, async behavior, and types.",
                "url": "https://github.com/getify/You-Dont-Know-JS",
                "stars": "180k+",
                "tags": ["JavaScript", "Deep Dive", "Intermediate"],
                "accent": "#ec4899",
            },
            {
                "id": "r05",
                "title": "Developer Roadmaps",
                "description": "Community-driven roadmaps, articles, and resources that help developers choose and structure a learning path.",
                "url": "https://github.com/kamranahmedse/developer-roadmap",
                "stars": "300k+",
                "tags": ["Career", "Roadmap", "All Levels"],
                "accent": "#14b8a6",
            },
            {
                "id": "r06",
                "title": "The Book of Secret Knowledge",
                "description": "A broad collection of manuals, cheatsheets, blogs, one-liners, tools, and reference material for developers.",
                "url": "https://github.com/trimstray/the-book-of-secret-knowledge",
                "stars": "145k+",
                "tags": ["DevOps", "CLI", "Security", "Reference"],
                "accent": "#8b5cf6",
            },
        ],
        "blogs": [
            {
                "id": "b01",
                "title": "Paul Graham's Essays",
                "author": "Paul Graham",
                "description": "Timeless essays on startups, programming, life, and thinking that remain useful for serious builders.",
                "url": "https://paulgraham.com/articles.html",
                "tags": ["Startups", "Thinking", "Essays"],
                "accent": "#6366f1",
            },
            {
                "id": "b02",
                "title": "Overreacted",
                "author": "Dan Abramov",
                "description": "Deep dives into React internals, JavaScript mental models, and software engineering principles.",
                "url": "https://overreacted.io",
                "tags": ["React", "JavaScript", "Mental Models"],
                "accent": "#61dafb",
            },
            {
                "id": "b03",
                "title": "Martin Fowler's Blog",
                "author": "Martin Fowler",
                "description": "Architecture patterns, refactoring, microservices, and software design guidance from a true industry legend.",
                "url": "https://martinfowler.com",
                "tags": ["Architecture", "Patterns", "Enterprise"],
                "accent": "#10b981",
            },
            {
                "id": "b04",
                "title": "Julia Evans' Blog",
                "author": "Julia Evans",
                "description": "Approachable posts on Linux, networking, debugging, and systems topics written with contagious curiosity.",
                "url": "https://jvns.ca",
                "tags": ["Linux", "Systems", "Networking"],
                "accent": "#f59e0b",
            },
            {
                "id": "b05",
                "title": "The Pragmatic Engineer",
                "author": "Gergely Orosz",
                "description": "In-depth articles on engineering culture, career growth, big tech internals, and software craftsmanship.",
                "url": "https://blog.pragmaticengineer.com",
                "tags": ["Career", "Big Tech", "Engineering Culture"],
                "accent": "#ec4899",
            },
            {
                "id": "b06",
                "title": "High Scalability",
                "author": "Todd Hoff",
                "description": "Real-world architecture stories showing how large systems scale to millions of users.",
                "url": "https://highscalability.com",
                "tags": ["Scalability", "Architecture", "Case Studies"],
                "accent": "#14b8a6",
            },
        ],
    }


@app.post("/api/contact")
def submit_contact(msg: ContactMessage):
    entry = {
        "name": msg.name,
        "email": msg.email,
        "subject": msg.subject,
        "message": msg.message,
        "timestamp": datetime.utcnow().isoformat(),
    }
    save_contact(entry)
    return {"success": True, "message": "Message received! I'll get back to you soon."}


@app.get("/api/contact/messages")
def get_messages():
    return load_contacts()


@app.get("/api/health")
def health():
    return {"status": "ok"}
