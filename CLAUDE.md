# CLAUDE.md

## What this repo is

The presentation and demo site for the Bupa fraud detection POC, published by GitHub Pages from the repository root (`main` branch, `/`). Alongside the site it holds the demo guides, the Pega prompts and reference material used to build and present the POC.

## Directories

- `index.html`: the demo site itself, a single self-contained page served by GitHub Pages.
- `demo-guides/`: demo guides in Markdown; `_source/` holds the original Word files for comparison.
- `prompts/`: reusable prompts run against the Pega environment, one prompt per file.
- `docs/`: reference material: the data model, test reference data and the Pega Blueprint export.
- `tests/`: test material, one folder per stage (for example `stage1-document-validity/`).
- `archive/`: superseded material kept for the record; don't link to it from current files.
- `.nojekyll`: stops GitHub Pages running Jekyll, which would drop `_source/` (Jekyll ignores paths starting with an underscore) and consume `{{placeholders}}` as Liquid. Keep it.

A Claude Project syncs `demo-guides/` and `prompts/` through the GitHub integration, so keep those folders free of anything that shouldn't reach it.

## Three-phase vocabulary

Use these names for the phases everywhere:

- **Phase 1: document forensics**: is the claim document genuine and does it match the claim?
- **Phase 2: provider and pattern**: is the provider real, and does the claim pattern make sense?
- **Phase 3: organised ring**: is the claim connected to known fraud or an organised ring?

## Conventions

- Australian English (organise, behaviour, colour, licence as a noun).
- No build step. The site is plain HTML, CSS and JavaScript, edited directly and served as-is.
- Plain JavaScript only: no frameworks, bundlers or new dependencies.
- Reuse the existing design tokens (colours, spacing, type) rather than adding new values.
- Never restyle anything outside the section being worked on.
- Kebab-case file and folder names, named for what the file contains or does.
- Update the index in `README.md` whenever a file is added, renamed or removed.

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
