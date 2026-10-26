<p align="center">
  <br>
  <strong>P &nbsp; R &nbsp; O &nbsp; M &nbsp; P &nbsp; T &nbsp; &nbsp; L &nbsp; I &nbsp; B &nbsp; R &nbsp; A &nbsp; R &nbsp; Y</strong>
  <br>
</p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&amp;logo=react&amp;logoColor=white">
  <img alt="TypeScript 6" src="https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&amp;logo=typescript&amp;logoColor=white">
  <img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&amp;logo=vite&amp;logoColor=white">
</p>

---

**Prompt Library** is a curated collection of generative AI prompt templates for productivity, creativity, Microsoft 365, and security work. Prompts are searchable and grouped by category, so you can quickly find, review, and copy one for the task at hand.

## Features

- **Search**: filter by keyword, category, tag or prompt text as you type. `/` jumps to the search field.
- **Categories**: colour-coded filters; the colours follow the families used on Favorite Skills and the AI Hub (security coral, Microsoft 365 blue, thinking lilac, writing gold, creativity pink, research and automation green). Mapping in `src/categories.ts`.
- **One-click copy**: copy a prompt and paste it straight into your AI tool.
- **Detail view**: a dialog with the full prompt, tags and a link to its source file. `#<prompt-id>` opens a prompt directly.
- **AI Hub look**: the same Personal UI and card material as simonhakansson.com and Favorite Skills: tilt, spotlight, dithered pixel field and scrambled title on hover, with a dithered tide behind the grid (`src/effects.ts`, `src/site.css`).

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

React 19, TypeScript and Vite, with plain CSS on Personal UI (`src/personal.css`, shared unchanged with AI Hub). Tests run on Vitest with jsdom.

## Development

```bash
npm install
npm run dev      # start the dev server
npm test         # run the tests
npm run build    # type-check and build to dist/
npm run preview  # serve the production build
```

## Adding a prompt

Each prompt is a JSON file in `src/prompts/`. Files are picked up automatically through `import.meta.glob` and load as one chunk after the page. A new category also needs a colour in `src/categories.ts`; a test fails until it has one.

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
