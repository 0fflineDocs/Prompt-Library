<p align="center">
  <br>
  <strong>P &nbsp; R &nbsp; O &nbsp; M &nbsp; P &nbsp; T &nbsp; &nbsp; L &nbsp; I &nbsp; B &nbsp; R &nbsp; A &nbsp; R &nbsp; Y</strong>
  <br>
</p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&amp;logo=react&amp;logoColor=white">
  <img alt="TypeScript 6" src="https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&amp;logo=typescript&amp;logoColor=white">
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&amp;logo=tailwindcss&amp;logoColor=white">
  <img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&amp;logo=vite&amp;logoColor=white">
</p>

---

**Prompt Library** is a curated collection of generative AI prompt templates for productivity, creativity, Microsoft 365, and security work. Prompts are searchable and grouped by category, so you can quickly find, review, and copy one for the task at hand.

## Features

- **Search**: find prompts by keyword, category, or tag.
- **Categories**: browse prompts by area.
- **One-click copy**: copy a prompt and paste it straight into your AI tool.
- **Detail view**: read the full prompt with its description and context.
- **Dark, responsive UI** for desktop and mobile.

## Prompt categories

The library holds about 50 prompts in these categories:

| Category | Focus |
|---|---|
| Security | Cybersecurity research, architecture, threat intelligence, and identity |
| Microsoft 365 | Microsoft 365 tools, services, and administration |
| Cognitive Fitness | Prompts that keep you thinking instead of deferring to the AI: debriefs, critique, and conceptual inquiry |
| Creativity | Creative thinking and writing |
| Automation | Codex automation prompts for scheduled cybersecurity, threat intelligence, and AI reports |
| Analysis | Extracting insights, detecting fallacies and bias, and Socratic questioning |
| Compliance | Regulatory frameworks such as DORA and the EU AI Act |
| Strategy | Business roadmaps, project planning, and stress-testing plans |
| Generative AI | AI industry newsletters |
| Writing | General writing help |
| Research | Market research |

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, Radix UI (scroll area, slot), Framer Motion, and Lucide icons.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # build to dist/
npm run preview  # serve the production build
```

## Adding a prompt

Each prompt is a JSON file in `src/prompts/`. Files are picked up automatically through `import.meta.glob`, so no registration is needed.

```json
{
  "id": "my-prompt",
  "title": "My Prompt",
  "description": "What the prompt does.",
  "category": "Security",
  "tags": ["example"],
  "content": "The prompt text.",
  "createdAt": "2026-10-22T00:00:00Z"
}
```

## License

[MIT](LICENSE)
