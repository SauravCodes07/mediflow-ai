# Mediflow-AI

Production-ready hospital workflow automation web application.

- **Deployment target:** Vercel (GitHub-connected, auto-deploy per push)
- **Authentication target:** Firebase Authentication (final step, not yet implemented)
- **Build source of truth:** `MASTER_IMPLEMENTATION_CONTRACT.md`
- **Process rules:** `DEVELOPMENT_PROCESS.md`
- **Baseline audit:** `AUDIT.md`
- **Per-step deployment history:** `DEPLOYMENT_LOG.md`

## Branch model

- `main` — governance/process docs only until the full application has passed final Vercel preview validation (Step 27 of the contract). No application code lands here early.
- `mediflow-test` — active build branch. Every implementation step is one isolated commit here, pushed and Vercel-verified before the next step starts.

## Status

Currently at: **Step 2 complete (local build verified), pending Vercel verification on push.**
