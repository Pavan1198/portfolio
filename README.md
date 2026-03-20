# Paverse Portfolio

Personal portfolio for [paverse.in](https://paverse.in), built with a React + TypeScript frontend and a Python FastAPI backend. The UI keeps the existing dark editorial design, while the repo now supports both local full-stack development and static deployment to GitHub Pages.

## Pages

- Home
- Resume
- Projects
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
- Contact falls back to `mailto:` when no external API is configured.

### Optional external API

If you host the Python API somewhere else, add a GitHub repository variable named `VITE_API_BASE_URL`.

Example:

```text
https://api.paverse.in
```

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
- Update home content in `src/pages/Home.tsx`
- Update contact defaults in `src/pages/Contact.tsx`

## Python Requirements

The backend dependencies live in `api/requirements.txt` and are only needed for local development or for hosting the API on a separate Python server.

## License

MIT
