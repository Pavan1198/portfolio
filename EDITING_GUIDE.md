# Editing Guide

This file explains which file controls which part of the portfolio, so you can quickly update content later.

## Start Here

If you want to update text or data, the most important files are:

- `src/pages/Home.tsx`: home page cards, headings, hero text, footer link
- `src/pages/Resume.tsx`: resume page layout and frontend fallback resume data
- `src/components/ResumePasswordModal.tsx`: resume password popup, verification messages, local fallback password behavior
- `src/pages/Projects.tsx`: projects page layout, project cards, fallback project list, "View Pipeline" button
- `src/components/DevOpsPipelineModal.tsx`: full 3D DevOps pipeline visualizer, shapes, logs, stage names, colors, modal layout
- `src/pages/Learning.tsx`: learning page layout and fallback learning resources
- `src/pages/Contact.tsx`: contact page content, form behavior, default contact info
- `api/main.py`: backend API data for resume, projects, learning, contact form, and resume password
- `src/index.css`: global colors, fonts, base theme, shared CSS variables

## Very Important Data Rule

This project has 2 content sources for some pages:

1. Frontend fallback data inside the React page files
2. Backend API data inside `api/main.py`

Pages that work like this:

- Resume
- Projects
- Learning
- Contact contact-details fetch

That means:

- If the API is running, the app may use data from `api/main.py`
- If the API is not running, the app falls back to data inside the React page file

For consistent content everywhere, update both places:

- frontend fallback file
- `api/main.py`

## Quick Update Map

### Update home page text or cards

Edit `src/pages/Home.tsx`

Use this file for:

- main landing page title
- card labels like Resume / Projects / Learning / Contact
- card descriptions and small decorative text
- footer website link
- resume card lock/open behavior

### Update resume content

Edit both:

- `src/pages/Resume.tsx`
- `api/main.py`

Use these files for:

- name
- title
- summary
- email / phone / location
- work experience
- education
- skills
- certifications

Notes:

- `src/pages/Resume.tsx` contains the frontend fallback resume data
- `api/main.py` contains the API version returned from `/api/resume`

### Update resume password

Edit:

- `src/components/ResumePasswordModal.tsx`
- `api/main.py`

Use these files for:

- password modal UI
- error messages
- local fallback password behavior
- API password verification logic

Password details:

- backend password comes from `RESUME_PASSWORD` in `api/main.py`
- current default backend password is `paverse2025` unless overridden by environment variable
- frontend static fallback password can use `VITE_RESUME_PASSWORD`

### Update projects page content

Edit both:

- `src/pages/Projects.tsx`
- `api/main.py`

Use these files for:

- project title
- project description
- stack tags
- highlights
- GitHub links
- live links
- project status
- project category

Notes:

- `src/pages/Projects.tsx` contains the fallback projects shown if the API is unavailable
- `api/main.py` contains the API project list from `/api/projects`

### Update the DevOps 3D pipeline modal

Edit:

- `src/components/DevOpsPipelineModal.tsx`

Use this file for:

- 3D object shapes
- stage names like GitHub / CI Runner / Docker / Kubernetes / Production
- pipeline logs
- colors and glow effects
- modal size and layout
- left sidebar stages
- right logs panel
- bottom status bar
- run/reset behavior
- camera, zoom, orbit, and animation timing

If you want to change the "View Pipeline" button placement or which project opens the modal, edit:

- `src/pages/Projects.tsx`

### Update learning page resources

Edit both:

- `src/pages/Learning.tsx`
- `api/main.py`

Use these files for:

- repo titles
- blog titles
- descriptions
- URLs
- tags
- star counts
- author names

### Update contact page

Edit both:

- `src/pages/Contact.tsx`
- `api/main.py`

Use these files for:

- contact heading text
- contact email/location/social links
- form success and error messages
- backend form submission behavior

Notes:

- `src/pages/Contact.tsx` contains frontend defaults and UI
- `api/main.py` stores submitted messages in `api/contacts.json`
- when no external API is configured, the contact form falls back to `mailto:`

### Update navigation or routes

Edit:

- `src/App.tsx`

Use this file for:

- route paths
- which page component loads for each URL

If you want to change app startup behavior for GitHub Pages redirects, edit:

- `src/main.tsx`

### Update global styling

Edit:

- `src/index.css`

Use this file for:

- global colors
- font variables
- default theme tokens
- base spacing/radius/shadow values
- utility classes

### Update API URL behavior

Edit:

- `src/lib/api.ts`

Use this file for:

- `VITE_API_BASE_URL`
- API path creation
- external API detection

### Update session behavior for resume unlock

Edit:

- `src/lib/resumeAccess.ts`

Use this file for:

- session storage key
- unlock persistence during the browser session

### Update local dev and build settings

Edit:

- `package.json`
- `vite.config.ts`
- `scripts/deploy.mjs`

Use these files for:

- npm scripts
- dev server port
- Vite API proxy
- build output folder
- running frontend and backend together

## File-by-File Reference

### Root files

- `package.json`: scripts and dependencies
- `package-lock.json`: npm lockfile, usually auto-generated
- `vite.config.ts`: Vite config, path aliases, dev proxy, build output
- `tsconfig.json`: TypeScript config
- `README.md`: project overview and run/deploy instructions
- `EDITING_GUIDE.md`: this file
- `components.json`: UI generator config
- `CNAME`: custom domain reference

### Frontend app files

- `src/main.tsx`: app bootstrapping and GitHub Pages redirect query handling
- `src/App.tsx`: router and top-level providers
- `src/index.css`: global styling and theme tokens

### Frontend page files

- `src/pages/Home.tsx`: landing page
- `src/pages/Resume.tsx`: resume page
- `src/pages/Projects.tsx`: projects listing page
- `src/pages/Learning.tsx`: learning/resources page
- `src/pages/Contact.tsx`: contact page
- `src/pages/not-found.tsx`: 404 page

### Frontend feature components

- `src/components/ResumePasswordModal.tsx`: resume unlock modal
- `src/components/DevOpsPipelineModal.tsx`: 3D DevOps pipeline visualizer

### Frontend helper files

- `src/lib/api.ts`: API URL helper
- `src/lib/resumeAccess.ts`: session-based resume unlock logic
- `src/lib/utils.ts`: shared utility helpers
- `src/hooks/use-mobile.tsx`: mobile helper
- `src/hooks/use-toast.ts`: toast helper

### Backend files

- `api/main.py`: all current API endpoints and backend fallback content
- `api/requirements.txt`: Python dependencies
- `api/__init__.py`: package marker
- `api/contacts.json`: saved contact form entries after submissions

### Public/static files

- `public/favicon.svg`: site icon
- `public/favicon-spark.svg`: alternate AI-style favicon option
- `public/favicon-knot.svg`: alternate AI-style favicon option
- `public/opengraph.jpg`: social preview image
- `public/CNAME`: GitHub Pages custom domain
- `public/404.html`: GitHub Pages SPA redirect helper

## Files You Usually Do Not Need To Edit

These are mostly reusable infrastructure or generated helpers:

- `src/components/ui/*`: shared UI primitives
- `package-lock.json`: auto-generated lockfile
- `api/__init__.py`: usually leave as-is
- `components.json`: only needed if changing UI generator settings

## Best Way To Update Info Without Missing Anything

When you change portfolio content:

1. Update the page file in `src/pages/...`
2. Update the matching API response in `api/main.py`
3. Run the app and verify both frontend-only mode and API mode if needed

## Quick Examples

If you want to update your name everywhere:

- `src/pages/Resume.tsx`
- `api/main.py`

If you want to update your GitHub link:

- `src/pages/Contact.tsx`
- `src/pages/Resume.tsx`
- `src/pages/Projects.tsx`
- `api/main.py`

If you want to update the DevOps pipeline stages or logs:

- `src/components/DevOpsPipelineModal.tsx`

If you want to change the home page hero text:

- `src/pages/Home.tsx`

If you want to change the project cards:

- `src/pages/Projects.tsx`
- `api/main.py`

If you want to switch favicon styles:

- update the `href` in `index.html`
- available files are `public/favicon.svg`, `public/favicon-spark.svg`, and `public/favicon-knot.svg`
