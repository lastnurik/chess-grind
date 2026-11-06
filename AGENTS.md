# Chess Grind development

Read CONTEXT.md and docs/spec.md before changes. The user wants a local app, identical visible ChessReps UX under the name Chess Grind, free training, literature-informed original teaching, a local chess engine, private GitHub with SSH, agentic development, and one commit per ticket.

## Agent skills

### Issue tracker
GitHub Issues in lastnurik/chess-grind. See docs/agents/issue-tracker.md.

### Triage labels
needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See docs/agents/triage-labels.md.

### Domain docs
Single-context: CONTEXT.md and docs/adr/. See docs/agents/domain.md.

## Standards

- Native JS modules, no build step or external runtime fetches; vendored libraries are immutable.
- Validate moves with chess.js; preserve castling, en passant, promotion and SAN legality.
- Keep training, progress, PGN and engine behavior behind small public interfaces.
- Escape all user-controlled text inserted into HTML. Validate imports before mutation. Limit input sizes.
- Browser storage is fallible: report failed writes, preserve original data on invalid imports.
- Engine searches must cancel or serialize; prevent stale evaluations/replies from applying to a changed position.
- All visible controls must work or explain their unavailable state. No fake stats or claimed book/GM authorship.
- Follow the requested Matt Pocock loop. TDD one red-green behavior at a time at agreed interfaces. Record red/green evidence in ticket notes.
- Each completed ticket gets its own commit. Parent agent owns commits and GitHub issue mutations; subagents must not commit other agents' changes.
- Two-axis independent review (Standards and Spec), fixing actionable findings before completion.
