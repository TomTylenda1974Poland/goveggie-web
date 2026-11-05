Read `AGENTS.md` in this folder first. It's the shared guide for Claude Code and Codex.
Then read `docs/PROGRESS.md`, and update it before ending the session.

These rules override the repo-root `CLAUDE.md` inside `palapa-verde/`:
- Palapa Verde is now a Next.js app here, not a single `index.html`. The old one-pager is archived in `legacy/`.
- Deployments go through the Git connection of the Vercel project `palapa-verde` (Root Directory
  `palapa-verde`), not `vercel --prod` from a folder.
