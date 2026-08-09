# Working rules

Treat all of it as good defaults rather than hard rules. The developer's stated
preference overrides anything here. If a rule fights the task in front of you,
say so out loud and get sign-off before breaking it.

## Philosophy

This is a solo-maintainer project, and the fastest way to hurt it is to build
machinery it does not need yet. Do not preserve complexity because it already
exists. Do not introduce abstraction because it looks architecturally
impressive. Understand the real constraint, then fight for the smallest model
that makes the correct behavior unsurprising. "Measure twice, cut once" and
"YAGNI" at the same time.

## Git

- **Never merge anything.** Not a PR, not a branch, not a fast-forward. The
  developer accepts or rejects every PR, and a question like "should we merge?"
  is a question, not permission. Open the PR, hand over the link, stop there.
- Committing, pushing, and opening the PR are yours to do as part of delivering
  the work — you do not need to ask for those.
- If you are on the default branch, branch first.
- Commit and PR titles match the existing history — read `git log` and follow
  what is there rather than importing a convention from another repo.
- Body: the problem in a sentence or two, then how you fixed it.
- **Rebase onto latest main before opening a PR.** Stale branches conflict and
  burn a review round.
- UI changes need before/after images. Motion or timing needs a short video.
- One concern per PR. If the description says "also", split it.
- When CI exists, babysit it: poll checks and comments newer than the last push,
  verify each finding against the source, fix the real ones, dismiss false
  positives with a written reason, stay quiet when nothing is new, and stop when
  the bots are green on the latest commit.

## Ways to hurt yourself

1. **Killing by pattern.** Never `pkill -f`, never `pgrep | kill`, never kill a
   PID you found by matching a name, path, or worktree string — your own agent
   process carries this repo's path in its argv, and several worktrees of this
   repo can be running at once. Kill the owner of the port instead:
   `lsof -ti:3000 | xargs kill`, or a PID you captured at spawn.
2. **Assuming a worktree is yours.** Several mechanisms create worktrees of this
   repo, owned by different tools. Know whose is whose before you touch one —
   see [Worktrees](#worktrees).
3. **Writing to live services on your own initiative.** Anything that leaves the
   machine — a dataset import, a deploy, a send — is confirm-gated even when the
   change that produces it was requested.

## Hit every surface

The most common defect is a change that works on the route you tested and is
missing everywhere else. Before calling frontend work done, walk this list and
say which entries applied:

- **Routes.** A change to how a shared piece renders usually shows up in more
  than one of them.
- **Entry points.** Most behavior is reachable more than one way. Fixing one
  path is not fixing the feature. Do not hardcode a keyboard shortcut you did
  not register wherever shortcuts are declared.
- **Reverse states.** If you add a way in, add the way out and the way to see
  it. A filter needs a clear. A drawer needs a close. A one-way door is a bug.
- **Docs.** Behavior a user would notice belongs in the repo's docs; new
  decisions get an ADR; new vocabulary goes in the glossary rather than a second
  one you start.

## Dev servers

- No configuration should be required to run the app. If a change makes the dev
  server need an env var, that is a regression.
- Dev serves on :3000, and several worktrees may want that port at once. Check
  before assuming a server is yours, and stop only what you started (see
  footgun 1).
- Do not reach for Playwright, Chrome automation, or computer use to verify UI
  unless the developer explicitly asks.

## Verifying

- Smallest proof that the change works. Run the tests you touched, not the whole
  suite, until the end.
- Reproduce with the smallest relevant test. After a failure, read the existing
  error, trace, or output before rerunning anything.
- Never repeat a run without a specific hypothesis to test. After three failed
  attempts, stop and report the evidence, the hypotheses, and the expected cost
  of the next step.
- Write long logs to `/tmp` and show the relevant excerpt, never the full dump.
- Typecheck before calling anything done. It is fast, and it is the thing that
  catches a bad type at a seam.
- Quote actual results. Never cite a test count from memory or from the README.
- Logic changes ship with focused tests for that behavior. Keep new logic on the
  pure side of the line, where it is testable without a DOM.

## Taste

- Keep pure modules pure — no DOM, no clock, no randomness, no I/O. That
  property is what makes them testable; do not spend it.
- Complexity belongs at a boundary. Above it, code should not know where the
  data came from.
- Inferred types over annotations. `any` is the enemy, and so is a cast that
  papers over a real shape mismatch at a seam.
- Comments describe how a thing is used, and move when the code moves. Use them
  for functions and invariants, not to narrate every line.
- No continuously repainting animations — they peg the GPU on high-refresh
  displays. For React and Next specifics, use the `vercel-react-best-practices`
  skill instead of re-deriving the rules; for interaction and motion polish,
  `emil-design-eng`.

## Worktrees

Worktrees of this repo live under `~/orca/workspaces/salu-rd/<name>` and are
created by Orca. The main checkout holds `main`, so a `gh pr merge` or any other
command that wants to check out `main` from inside a worktree will fail — that
is expected, not a bug to work around.

Cleanup is manual and confirm-gated. Remove a worktree with
`git worktree remove <path>` only when the developer asks for that specific
worktree by name. Never prune, never clean up in the background, never remove
one because it looks stale — `prunable` in `git worktree list` means the
directory is gone, not that the branch is finished.
