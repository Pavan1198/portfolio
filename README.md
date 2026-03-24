# Paverse Portfolio

Personal portfolio for [paverse.in](https://paverse.in), built with a React + TypeScript frontend and a Python FastAPI backend. The UI keeps the existing dark editorial design, while the repo now supports both local full-stack development and static deployment to GitHub Pages.

## Pages

- Home
- Resume
- Projects
- Learning
- Chatbot
- Contact
- 404

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- Wouter
- FastAPI
- Uvicorn

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.10+

### Install dependencies

Frontend:

```bash
npm install
```

Backend:

```bash
python -m pip install -r api/requirements.txt
```

### Run the project

From the project root:

```powershell
npm.cmd run deploy
```

This starts:

- FastAPI on `http://127.0.0.1:8000`
- Vite on `http://127.0.0.1:5173`

If port `5173` is already in use, Vite will automatically move to the next open port.

### Other useful commands

```bash
npm run dev
npm run api:dev
npm run typecheck
npm run build
npm run serve
```

## GitHub Pages Deployment

The repo includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml` for deploying the frontend to GitHub Pages.

### Important limitation

GitHub Pages can host the React frontend only. It cannot run the FastAPI backend.

Because of that:

- Resume and Projects fall back to built-in frontend data when no API is configured.
- Learning falls back to built-in frontend data when no API is configured.
- Chatbot falls back to a built-in public-safe frontend profile when no live API is configured.
- Contact falls back to `mailto:` when no external API is configured.
- Resume unlocking can use the FastAPI backend via `/api/auth/resume`, or a frontend-only fallback password in static GitHub Pages builds.

### Optional external API

If you host the Python API somewhere else, add a GitHub repository variable named `VITE_API_BASE_URL`.

Example:

```text
https://api.paverse.in
```

If you want to change the resume password, set the `RESUME_PASSWORD` environment variable on the Python API host.

If you want the chatbot to use the live backend, set `AI_INTEGRATIONS_OPENAI_API_KEY` on the Python API host. You can optionally override `AI_INTEGRATIONS_OPENAI_BASE_URL` and `CHATBOT_MODEL`.

If you want the resume password prompt to work on GitHub Pages without a hosted API, add a repository variable named `VITE_RESUME_PASSWORD`.

Important: `VITE_RESUME_PASSWORD` is embedded into the frontend build, so it is suitable only for lightweight gating, not real security.

### Custom domain

The repo includes `public/CNAME` with:

```text
paverse.in
```

After pushing to GitHub:

1. Enable GitHub Pages for the repository.
2. Set the source to `GitHub Actions`.
3. Configure the custom domain as `paverse.in`.
4. Update your DNS records to point the domain to GitHub Pages.

## Customization

- Update resume fallback data in `src/pages/Resume.tsx`
- Update project fallback data in `src/pages/Projects.tsx`
- Update learning fallback data in `src/pages/Learning.tsx`
- Update chatbot public-safe fallback, suggestions, and UI text in `src/pages/Chatbot.tsx`
- Update chatbot launcher text in `src/components/ChatbotLauncher.tsx`
- Update chatbot live/backend prompt and secure AI behavior in `api/main.py`
- Update home content in `src/pages/Home.tsx`
- Update contact defaults in `src/pages/Contact.tsx`
- Use `EDITING_GUIDE.md` for a full file-by-file map of what to edit

## Chatbot Content Audit

If you want to review everything the chatbot can show before publishing, check these files first:

- `src/pages/Chatbot.tsx`: public-safe frontend content. This file contains the chatbot UI, initial greeting, suggested questions, follow-up suggestion logic, public-safe local fallback replies, and local mode labels. Anything here is shipped to the browser and can be inspected by users.
- `src/components/ChatbotLauncher.tsx`: floating launcher button label and accessibility text for opening the chatbot.
- `api/main.py`: live backend prompt, `/api/chat` route, and server-side AI behavior. Keep richer or sensitive chatbot instructions here instead of in the frontend.
- `src/App.tsx`: route registration for `/chatbot` and the global chatbot launcher mount point.

Safe rule of thumb:

- Put only public-safe fallback copy in `src/pages/Chatbot.tsx`
- Put detailed or private AI instructions in `api/main.py`

## Python Requirements

The backend dependencies live in `api/requirements.txt` and are only needed for local development or for hosting the API on a separate Python server.

## License

MIT
