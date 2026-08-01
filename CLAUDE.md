# website

Korit's public website. This is a sibling repo to `korit-meta`, registered
in `korit-meta/projects.yaml`.

## Where things live

- `kb/project/` — this repo's own knowledge: stack, deployment, design
  system, content inventory. Fill in as decisions are made.
- `../korit-meta/kb/global/INDEX.md` — global KB table of contents.
  `01-conventions` and `02-architecture` are usually relevant; `03-business`
  (business plan, market study, competitor analysis) only matters when a
  task explicitly touches messaging or positioning — don't load it by
  default. See `../korit-meta/kb/global/01-conventions/context-routing.md`
  for the full rule.
- `.claude/agents/website-engineer.md` — the persona scoped to this repo.

## Working here

Use the `website-engineer` persona for engineering tasks. KB or convention
changes belong in `korit-meta`, not duplicated here.
