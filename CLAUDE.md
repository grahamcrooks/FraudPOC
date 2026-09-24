# CLAUDE.md

Conventions for working in this repository.

## Folders

- `index.html`: the demo app. GitHub Pages serves it from the repository root, so don't move or rename it. It is self-contained and references no local files.
- `demo-guides/`: demo guides in Markdown. `assets/<guide-name>/` holds images for each guide; `_source/` holds the original Word files for comparison.
- `prompts/`: reusable prompts, one prompt per file, run against the Pega environment.
- `docs/`: reference material such as the data model, test reference data and the Pega Blueprint export.
- `archive/`: superseded material kept for the record. Don't link to it from current guides or prompts.
- `.nojekyll`: stops GitHub Pages running Jekyll, which would otherwise treat `{{placeholders}}` as template code. Keep it.

A Claude Project syncs `demo-guides/` and `prompts/` through the GitHub integration, so keep those folders free of anything that shouldn't reach it.

## Guides

- Markdown is the source of truth for the guides. When a Word copy is needed, generate it with pandoc, for example `pandoc demo-guides/presenter-guide.md -o presenter-guide.docx`.
- Don't commit edited `.docx` files back. The files in `demo-guides/_source/` are the originals and stay unchanged.
- Each guide has a single H1.

## Naming

- Use kebab-case for file and folder names, named for what the file contains or does (for example `configure-provider-data-object.md`).

## Prompts

- Use `{{placeholder}}` for client-specific inputs, such as `{{client_name}}` and `{{dev_system_id}}`, and list the placeholders at the top of the prompt file.
- Keep the prompt text inside a fenced `text` block so it can be copied as-is.

## Data and security

- No credentials, keys, tokens or URLs with embedded authentication.
- No real member or provider data. Use fictional names, addresses and identifiers; ABNs, provider numbers and AHPRA numbers must not belong to real entities.
- The repository is public and served by GitHub Pages; treat everything committed as published.

## Language

- Use Australian English (for example organise, behaviour, colour, licence as a noun).

## README index

- Update the index in `README.md` whenever a file is added, renamed or removed in `demo-guides/`, `prompts/` or `docs/`.
