# Development Process — Locked Execution Mode (Step 0)

This repository is built under a controlled, sequential process. These rules are locked
for the entire build and apply to every step from here forward.

## Core loop

implement -> local production build -> commit (isolated, one step per commit) -> push ->
Vercel auto-deploy -> verify green -> only then start the next step

## Rules

- Work on the `mediflow-test` branch. `main` is not modified with application code until
  the full application has passed final Vercel preview validation.
- Do not skip a numbered step because a later feature looks easier.
- Do not combine multiple uncertain changes into one commit or one deployment.
- Every step ends with a local production build (`npm run build`) before anything is pushed.
- After a local build passes, that exact state is pushed to `mediflow-test` as its own commit.
- Only a Vercel PASS on that pushed commit unlocks the next step.
- If Vercel fails: stop, diagnose and fix the current step only, commit the fix, push again,
  re-verify. No batching unverified steps.
- Never hide an error by disabling TypeScript, ESLint, build checks, security checks, or
  runtime errors.
- Never add `force-dynamic`, `ssr:false`, webpack config changes, or dependency changes
  without a recorded reason.
- Do not redesign architecture mid-sequence without recording why.
- Preserve existing public URLs once they exist.
- Route groups are for filesystem organization only; they must never appear in the URL.
- `DEPLOYMENT_LOG.md` is updated at every step.
- A step is not "complete" until its Vercel result is verified and recorded.
- Do not merge `mediflow-test` into `main` until the complete application passes final
  Vercel preview validation.

## Per-step report format

Every step is reported as:

- STEP NUMBER
- FILES CHANGED
- WHAT WAS IMPLEMENTED
- LOCAL BUILD RESULT
- VERCEL URL / RESULT
- ISSUES FOUND
- FIXES APPLIED
- NEXT STEP UNLOCKED (Y/N)

## Known environment constraint

The building agent (Claude, via the sandbox this repo was authored in) has no network
access to vercel.com and no Vercel account/API token. It can run and verify local
production builds itself, but cannot trigger or check Vercel deployments directly.
Verification of the "Vercel PASS" half of each checkpoint is done by the repository owner
(build logs / deployment status reported back), optionally cross-checked by fetching the
live deployment URL once one exists.
