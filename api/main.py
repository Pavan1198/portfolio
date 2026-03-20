from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import json
import os

app = FastAPI(title="Paverse Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CONTACTS_FILE = os.path.join(os.path.dirname(__file__), "contacts.json")

def load_contacts():
    if not os.path.exists(CONTACTS_FILE):
        return []
    with open(CONTACTS_FILE, "r") as f:
        return json.load(f)

def save_contact(contact: dict):
    contacts = load_contacts()
    contacts.append(contact)
    with open(CONTACTS_FILE, "w") as f:
        json.dump(contacts, f, indent=2)


class ContactMessage(BaseModel):
    name: str
    email: str
    subject: str
    message: str


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
                "period": "2022 — Present",
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
                "period": "2020 — 2022",
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
                "period": "2016 — 2020",
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
            "AWS Certified Developer — Associate",
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


@app.post("/api/contact")
def submit_contact(msg: ContactMessage):
    from datetime import datetime
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
