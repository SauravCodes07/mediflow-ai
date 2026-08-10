# Baseline Audit (Step 1)

## Scope

Audit of the starting project state, performed before any code was written, per the
contract's Step 1 instructions.

## Finding: greenfield build

No existing Mediflow-AI codebase was found anywhere in the build environment — no
`package.json`, no `next.config.*`, no `app/` directory, no `components`/`lib`/`hooks`/
`services` folders, no `middleware.ts`, no Firebase configuration, no Supabase or other
backend code, and no prior Vercel deployment. The only input was the contract document
itself.

This means several Step 1 checklist items are not applicable as written and are instead
recorded as explicit decisions for this build, since there is nothing pre-existing to
inspect:

| Contract checklist item | Resolution for a greenfield build |
|---|---|
| Exact Next.js / React / TypeScript / package-manager versions | Next.js 16.3.0, React 19.2.8, TypeScript ^5, **npm** (owner's explicit choice) |
| Inspect `next.config.js` | N/A — default config generated fresh in Step 2, will be deliberately configured in Step 3 |
| Inspect `tsconfig.json` and path aliases | Generated fresh with `@/*` import alias |
| Route tree | N/A — built incrementally starting Step 7 (shell) and Step 9 (route skeletons) |
| Existing components/lib/hooks/services | None — will be established as part of Step 5 (design system) onward |
| `middleware.ts` | None yet — deferred to Step 20 per contract |
| Existing Firebase configuration | None — Firebase is deferred to Step 21 per contract |
| Existing Supabase / other backend | None found; not applicable |
| Hardcoded data / mock dashboards / TODOs | N/A yet — none written |
| Import casing mismatches | N/A yet |
| Dynamic imports / `generateStaticParams` / server-client boundary issues | N/A yet |
| Does the project currently build locally? | N/A — no project existed; first build happens in Step 2 |
| Baseline Vercel status | None — no prior deployment exists |

## Decisions locked at this checkpoint

- Package manager: **npm**
- Deployment: GitHub-connected Vercel project, auto-deploy on push to `mediflow-test`
- Branch model: `main` = process docs only for now; `mediflow-test` = active build branch,
  one commit per contract step
- No large changes performed in this step, consistent with the contract's instruction that
  Step 1 is for establishing a baseline, not building.
