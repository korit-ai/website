# Website Project KB

Project-specific knowledge for the website repo. Add files here as decisions
are made — don't pre-fill speculative content.

Expected shape as the project grows:
- `stack.md` — framework, hosting, build/deploy pipeline.
- `design-system.md` — components, tokens, brand application (links to
  `../../../kb/global/00-company/` for brand source-of-truth
  rather than restating it).
- `content-inventory.md` — pages/sections and their content owners.
- `implementation-plan.md` — standing reference: locked decisions, phased
  milestones, open items. Updated in place as the project evolves.
- `specs/` — point-in-time feature specs (ready-for-implementation
  engineering plans for a specific change), as opposed to
  `implementation-plan.md`'s standing/evolving-reference role. Each spec
  stays as a historical record once implemented; update
  `implementation-plan.md` and `content-inventory.md` to reflect the shipped
  result rather than editing the spec after the fact.

Rule: this KB holds facts specific to the website repo only. Anything true
company-wide belongs in the global KB and should be linked, not copied —
see `../../../kb/global/01-conventions/context-routing.md`.
