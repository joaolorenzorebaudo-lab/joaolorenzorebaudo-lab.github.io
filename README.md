# João Lorenzo Rebaudo — Portfolio

Personal portfolio of a Computer Science student at the University of Florence, built for internship applications.

Live site: https://joaolorenzorebaudo-lab.github.io

## Features

- One static page per language, with a language switcher in the header. English, Italian and French are live.
- Sections: hero, projects, background (education, experience, skills, languages), contact.
- Rotating greeting in the hero (Ciao → Olá → Bonjour → Hello → Hola). It starts from the page's own language, stops after one cycle, and stays still when the system asks for reduced motion.
- Mobile-first, responsive layout.
- Semantic HTML: decorative elements are hidden from screen readers, and every link and button has a visible keyboard focus.
- Works without JavaScript. Without it, the greeting is simply a static word.
- No external requests: system fonts, local images, no analytics.

## Tech stack

- HTML and CSS (custom properties, Flexbox, Grid)
- Vanilla JavaScript: one small script, `js/greeting.js`
- Git and GitHub Pages
- No frameworks, no build tools, no npm packages

## Run locally

From the repository root:

```
python3 -m http.server
```

Then open http://localhost:8000.

Paths are absolute from the site root (`/css/style.css`), so opening `index.html` directly from the file system (`file://`) will not load the styles. Always use a local server.

## Project structure

```
/
├── index.html          English page
├── it/index.html       Italian page
├── fr/index.html       French page
├── css/style.css       Single stylesheet shared by every language
├── js/greeting.js      Rotating greeting
├── assets/img/         Photo, favicon, Apple touch icon
├── docs/spec.md        Project spec (v1.0)
├── docs/plan.md        Implementation plan and decisions
├── docs/maintaining.md Checklists for adding a project or a language
└── CLAUDE.md           Instructions for the AI pair programmer
```

## Maintaining

Checklists for adding a project or a language: [docs/maintaining.md](docs/maintaining.md)

## How I built it

I defined the spec, decided the content and chose the design direction. The code was written by Claude Code as an AI pair programmer, following the rules I set in `CLAUDE.md`. I reviewed every change and checked the result in the browser, to make sure it worked the way I wanted. Commits are small, one change at a time.

Some problems found during the build:

- A CSS rule targeted the class `.hero`, but the hero section only had `id="hero"`, so the styles were silently not applied.
- The language list showed "IT" with no label, which could read as Information Technology. It now has a "Languages:" label, and each code is an abbreviation with its full name.
- A claim that the greeting met WCAG 2.2.2 was wrong, and was corrected before it was committed.

One deliberate trade-off: the greeting stops after one cycle (about 12 seconds) and stays still with reduced motion, but it has no pause control, so it does not strictly meet WCAG 2.2.2 (Pause, Stop, Hide). I kept it because it is the page's signature detail and it stops by itself.
