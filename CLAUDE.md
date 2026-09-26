# CLAUDE.md

## What this repo is

The presentation and demo site for the Bupa fraud detection POC, published by GitHub Pages from the repository root (`main` branch, `/`). Alongside the site it holds the demo guides, the Pega prompts and reference material used to build and present the POC.

## Directories

- `index.html`: the demo site itself, a single page served by GitHub Pages. It loads per-scenario data from `data/scenarios/` with plain `<script>` tags.
- `data/scenarios/`: per-scenario data (the session block for the sign-in scene and the Phase 1 signals array), one file per claim; see its README for the schema.
- `demo-guides/`: demo guides in Markdown; `_source/` holds the original Word files for comparison.
- `prompts/`: reusable prompts run against the Pega environment, one prompt per file.
- `assets/slides/`: the five presentation slides as full-slide images (`slide-<n>-<name>.webp`), shown by `index.html`. The text is part of each image, so a wording change means a new image.
- `docs/`: reference material: the data model, test reference data and the Pega Blueprint export.
- `tests/`: test material, one folder per stage (for example `stage1-document-validity/`).
- `archive/`: superseded material kept for the record; don't link to it from current files.
- `.nojekyll`: stops GitHub Pages running Jekyll, which would drop `_source/` (Jekyll ignores paths starting with an underscore) and consume `{{placeholders}}` as Liquid. Keep it.

A Claude Project syncs `demo-guides/` and `prompts/` through the GitHub integration, so keep those folders free of anything that shouldn't reach it.

## Three-phase vocabulary

Use these names for the phases everywhere:

- **Phase 1: receipt forensics**: is the receipt genuine and does it match the claim?
- **Phase 2: cross-claim signals**: does this claim fit a pattern across other claims (submission distance, shared device, shared bank account)?
- **Phase 3: network intelligence**: is the claim connected to known fraud or an organised ring?

## Conventions

- Australian English (organise, behaviour, colour, licence as a noun).
- No build step. The site is plain HTML, CSS and JavaScript, edited directly and served as-is.
- Plain JavaScript only: no frameworks, bundlers or new dependencies.
- Reuse the existing design tokens (colours, spacing, type) rather than adding new values.
- Never restyle anything outside the section being worked on.
- Kebab-case file and folder names, named for what the file contains or does.
- Update the index in `README.md` whenever a file is added, renamed or removed.

## Branding

The demo UI uses the generic "H+ Health Insurance Co" brand everywhere, including mock app screens and device profiles. Never use Bupa's name, logo or colours in the demo UI: the site is public and shared as video, and must not look like Bupa's own app. Slides may state that the POC is for Bupa; that is a statement of fact, not an impersonation.

## Simulated or actual

Every scene in the demo is labelled either "simulated" or "actual", and the difference must stay visually obvious. Don't add a scene without a label, and don't restyle the labels in a way that makes the two harder to tell apart.

## Guides

- Markdown is the source of truth. When a Word copy is needed, generate it with pandoc (for example `pandoc demo-guides/presenter-guide.md -o presenter-guide.docx`); don't commit edited `.docx` files back.
- Each guide has a single H1. If a guide gains images, put them in `demo-guides/assets/<guide-name>/`.

## Prompts

- Use `{{placeholder}}` for client-specific inputs, such as `{{client_name}}` and `{{dev_system_id}}`, and list them at the top of the prompt file.
- Keep the prompt text in a fenced `text` block so it can be copied as-is.
- Where prompts must run in order, put them in a folder and prefix the file names with the step number (`01-`, `02-`, …).

## Data and security

- No credentials, keys, tokens or URLs with embedded authentication.
- No real member or provider data. Use fictional names, addresses and identifiers; ABNs, provider numbers and AHPRA numbers must not belong to real entities.
- The repository is public and served by GitHub Pages; treat everything committed as published.
