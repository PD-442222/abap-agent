# Template guidance (text-only)

Runtime template generation is now handled by the web app. The source outlines that feed the generator live in `/public/templates-source/` and remain plain Markdown to keep the repo binary-free.

## What to use
- Download Markdown outlines from `/public/templates-source/` for Report, Interface, Conversion, Enhancement, and Form.
- Use the in-app **Download Word Template** button to create a `.docx` in the browser (not stored in Git).
- Upload either the generated `.docx` or the Markdown outline back into the app to pre-fill fields.

## Binary policy
`.docx` files are ignored by `.gitignore` and should never be committed. All template generation and parsing occurs client-side.
