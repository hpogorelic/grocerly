# Showtime report: grocerly

|  |  |
| --- | --- |
| Repository | /Users/hpogorelic/Desktop/showtime-examples/grocerly (local checkout) |
| Commit | deb4d8d |
| Branch | showtime/a701be7d |
| Pipeline | full |
| Status | completed |
| Started | 2026-10-02T11:34:57.324Z |
| Ended | 2026-10-02T12:22:24.483Z |
| Active time | 47 min |
| Run | a701be7d-f71e-49ac-8de6-81ef6f6ff0b9 |

## Setup required

Before using the result:

1. Revoke and rotate the API key that began 'gk_live_7f3a…' at the provider. The key remains in Git history after deletion, so it must be treated as compromised. (Delete legacy.js and the hardcoded API key, then rotate the key, d209a64)

## Summary

Before using the result, someone with access must revoke and rotate the API key that was hardcoded in the app, because it remains in the project's history and has to be treated as compromised. The run completed 24 tickets covering security fixes, library upgrades and removals, a modernisation of the grocery list app's code, new tests and tooling, and found 1 more ticket already resolved by earlier work. The most important change for security is that the hardcoded key was deleted, text typed into the add-item form now shows as plain text instead of being read as page markup, and all critical and high security advisories were cleared. The second most important change is that the app moved to a current version of its framework and modern component style, with older libraries such as jQuery, lodash, moment and axios removed, which brings 9 declared behaviour changes, for example a new format for item ids and a different wording for the error shown when the starter data fails to load. On the scorecard 16 metrics got better and 2 got worse: tests grew from 7 to 65 with failing tests down from 1 to 0, security advisories fell from 7 to 2, duplicated code fell from 7.7 to 0 percent, framework alignment rose from 35 to 84 percent, and a linter, automated checks on each change and a pinned Node version were added, while the test run now takes longer (773 to 3020 milliseconds) and dependencies a major version behind rose from 11 to 12. Nothing was left: no tickets were blocked, deferred or dropped, and every finding became a ticket. Across 3 documentation tickets, the team updated the README with setup steps, commands, the development environment and the key rotation step, and wrote an architecture overview and a next-steps hand-off document. The run took 47 minutes of active time and cost $7.44, with the fixing phase taking 33 minutes and $4.67.

- Setup required: revoke and rotate the API key that was hardcoded in the app, because it remains in the project's history.
- 24 tickets done and 1 found already resolved; none blocked, deferred or dropped.
- Critical security advisories went from 1 to 0 and high ones from 4 to 0; 2 moderate advisories remain.
- Tests grew from 7 to 65, and failing tests went from 1 to 0.
- 47 minutes of active time at a total cost of $7.44.

## Health

| Area | Before | After | Why (after) |
| --- | --- | --- | --- |
| build | 🟢 green | 🟢 green | the production build completes |
| tests | 🔴 red | 🟢 green | 65 tests, none failing |
| security | 🔴 red | 🟡 yellow | 2 moderate advisories remain |
| dependencies | 🔴 red | 🔴 red | 12 a major behind, 0 unused, 0 overlapping |
| alignment | 🔴 red | 🟢 green | framework alignment 84% |
| structure | 🟡 yellow | 🟢 green | 0% duplicated, 0 oversized modules, 0 unreachable files |
| docs | 🟡 yellow | 🟢 green | a README whose commands match the scripts |
| hygiene | 🔴 red | 🟢 green | lint true, ci true, node true |

## Scorecard

| Metric | Before | After | Change | Provenance |
| --- | --- | --- | --- | --- |
| install.ok | true | true |  | measured |
| install.durationMs | 538 | 538 |  | measured |
| install.cached | true | true |  | measured |
| build.ok | true | true |  | measured |
| build.durationMs | 1664 | 1664 |  | measured |
| build.warnings | 0 | 0 |  | inferred |
| tests.runner | vitest | vitest |  | measured |
| tests.total | 7 | 65 | +58 ✓ | measured |
| tests.passed | 6 | 65 | +59 ✓ | measured |
| tests.failed | 1 | 0 | -1 ✓ | measured |
| tests.skipped | 0 | 0 |  | measured |
| tests.failing | utils/format.test.js › formatDate uses ISO style |  | changed | measured |
| tests.durationMs | 773 | 3020 | +2247 ✗ | measured |
| audit.critical | 1 | 0 | -1 ✓ | measured |
| audit.high | 4 | 0 | -4 ✓ | measured |
| audit.moderate | 2 | 2 |  | measured |
| audit.low | 0 | 0 |  | measured |
| audit.total | 7 | 2 | -5 ✓ | measured |
| serve.ok | true | true |  | measured |
| serve.readyMs | 229 | 229 |  | measured |
| serve.httpStatus | unknown | unknown |  | unknown |
| lint.configured | false | true | changed ✓ | inferred |
| types.configured | false | false |  | inferred |
| types.strict | unknown | unknown |  | unknown |
| ci.configured | false | true | changed ✓ | inferred |
| node.pinned | false | true | changed ✓ | inferred |
| docs.readme_present | true | true |  | inferred |
| docs.readme_commands_valid | false | true | changed ✓ | inferred |
| deps.outdated_major | 11 | 12 | +1 ✗ | measured |
| deps.unused_declared | 1 | 0 | -1 ✓ | inferred |
| repo.size_files | 19 | 26 | +7 | inferred |
| repo.size_loc | 561 | 1079 | +518 | inferred |
| alignment.framework | 35 | 84 | +49 ✓ | measured |
| libs.overlapping | 4 | 0 | -4 ✓ | measured |
| dup.percent | 7.7 | 0 | -7.7 ✓ | measured |
| modules.oversized | 1 | 0 | -1 ✓ | measured |
| deadcode.files | 1 | 0 | -1 ✓ | measured |
| findings.by_severity | critical 1, high 5, medium 15, low 18, info 0 | critical 0, high 0, medium 2, low 0, info 0 | changed | measured |

16 better, 2 worse, 4 changed without a direction.

## Tickets

### Done (24)

| Tier | Ticket | Commit | Rounds |
| --- | --- | --- | --- |
| 0 | Fix the stale formatDate test and pin its timezone | 15d34ba | 1 |
| 2 | Add characterization tests for App interactions and persistence | 26ba5d4 | 1 |
| 1 | Add unit tests for form, lists, helpers and the event bus | 65889ea | 1 |
| 2 | Upgrade axios, lodash and moment past their high advisories | 6cc567b | 1 |
| 1 | Delete legacy.js and the hardcoded API key, then rotate the key | d209a64 | 1 |
| 1 | Render the AddItemForm preview as JSX instead of innerHTML | 9147837 | 1 |
| 0 | Upgrade Vite/Vitest toolchain and drop unused uuid | a96ea2c | 1 |
| 2 | Remove dead App lifecycle and props, then convert App to hooks | ca3b0c9 | 1 |
| 3 | Upgrade to React 18 and switch main.jsx to createRoot | 41bef4d | 1 |
| 1 | Clear App's 1s interval and move the 'Saved … ago' tick into its own component | fc867a1 | 1 |
| 2 | Remove the unused pub/sub event bus | 3be6b41 | 1 |
| 2 | Replace jQuery DOM mutations with refs, state and CSS, then remove jquery | 357cd75 | 1 |
| 1 | Derive Stats total and percent in render instead of effects | 55e19b8 | 1 |
| 2 | Merge ArchivedList into a parameterised ItemList | 10af1ec | 1 |
| 2 | Pin Node, add ESLint with react-hooks rules, and a CI workflow | 20a9fd9 | 1 |
| 1 | Replace lodash sortBy/uniq/map with native code and remove lodash | 4144205 | 1 |
| 1 | Load the seed with fetch and remove axios | 02ef4dc | 1 |
| 1 | Read DEBUG from the build environment instead of hardcoding true | bec9e7a | 1 |
| 1 | Fix README commands and document setup, tests and storage | e470446 | 1 |
| 1 | Remove the duplicate formatDate in helpers.js and stale comments | 3fd2898 | 1 |
| 1 | Replace moment with Intl formatters and remove moment | 4bf6bfe | 1 |
| 2 | Use immutable updates and set lastSaved without componentDidUpdate setState | abf86ed | 1 |
| 2 | Replace the duplicated filter switches with one predicate map | 9ecb23b | 1 |
| 3 | Split App.jsx into a data hook, a list reducer and a Toolbar component | 89c4818 | 1 |

### Already resolved (1)

- **Compute the AddItemForm preview in render, drop its effect** (Tier 1, already resolved)
  - Why: Commit 9147837 "fix: render AddItemForm preview as JSX instead of innerHTML" (g5) already did this. I read src/components/AddItemForm.jsx. It has no `useState('')` for preview and no dependency-less effect. The only remaining effect has a `[]` dependency array and handles focus and fade-in. The preview is computed inline as `<div className="preview"><b>{name}</b> × {qty}{category ? ...}</div>`. The AddItemForm tests also assert on this preview. I did not run the test suite.
  - Expected to move: alignment.framework

### Documentation (3)

| Ticket | Status | Commit |
| --- | --- | --- |
| Update README.md from the run: setup, commands, development environment | done | 829ac6d |
| Write ARCHITECTURE.md with the module responsibilities and the diagram | done | 2edb8ba |
| Write docs/NEXT_STEPS.md: what was done, what is left, and in which order | done | 3dd42b1 |

## Behaviour changes

- HTML typed into the item or category field now shows as literal text in the preview instead of being parsed as markup. The visible text for normal input is unchanged. This closes the HTML injection sink the ticket targets. (Render the AddItemForm preview as JSX instead of innerHTML)
- New item ids now look like 'i<uuid>' (for example i3b2f…-…) instead of 'i<0-999999>'. Math.random ids from a 1e6 range can collide; crypto.randomUUID() gives unique ids. Existing stored ids are unaffected. (Upgrade Vite/Vitest toolchain and drop unused uuid)
- The one-second tick interval is now cleared when App unmounts. The class version never cleared it. The axios result is also ignored if App unmounts before it arrives. A hooks effect needs cleanup, and the interval and late setState after unmount were leaks. Nothing visible changes while App is mounted. (Remove dead App lifecycle and props, then convert App to hooks)
- The app now renders with React 18's concurrent root (automatic batching) inside StrictMode. In development, StrictMode runs effects twice, so the localStorage/seed load and the bus/interval setup each run twice on mount. Both clean up properly. The ticket asks for createRoot, preferably wrapped in StrictMode. (Upgrade to React 18 and switch main.jsx to createRoot)
- The 'item:add' event no longer adds an item, because nothing in the app subscribes to it any more. The ticket removes the bus, and nothing in the codebase emits 'item:add'. Items are added through the onAdd prop. (Remove the unused pub/sub event bus)
- The empty-name error is now the 'invalid' class on the name input (red border from CSS) instead of an inline border-color. The class clears on the next submit that has a name. The ticket asks for an error state that adds an 'invalid' class. The old inline red border was never cleared, so this also fixes that. (Replace jQuery DOM mutations with refs, state and CSS, then remove jquery)
- The form's fade-in is now a 300ms CSS animation instead of jQuery fadeIn. The ticket asks for a CSS keyframe in place of jQuery. (Replace jQuery DOM mutations with refs, state and CSS, then remove jquery)
- When /seed.json returns a non-2xx status, the displayed error is now the response statusText (e.g. 'Error: Not Found') instead of axios's 'Request failed with status code 404'. The ticket specifies throwing new Error(r.statusText) on a non-ok fetch response. (Load the seed with fetch and remove axios)
- The 'saved N items' console log in App.componentDidUpdate no longer appears in production builds. It still appears in dev and under Vitest. The ticket asks for DEBUG to come from the build environment instead of being hardcoded true. (Read DEBUG from the build environment instead of hardcoding true)

## Findings not turned into tickets

Every finding is covered by a ticket.

## Limitations

None.

## Cost

About $7.59 of model usage (approximate, from the configured prices); $7.44 before this report's narrative was written. Cache hit ratio 83.7%: the share of input tokens read from the prompt cache.

| Role | Cost |
| --- | --- |
| explorer | $0.05 |
| analyst | $1.03 |
| tech_lead | $0.97 |
| developer | $2.05 |
| reviewer | $2.62 |
| qa | $0.29 |
| tech_writer | $0.57 |

| Phase | Cost |
| --- | --- |
| exploration | $0.05 |
| analysis | $1.03 |
| roadmap | $0.97 |
| fixing | $4.67 |
| documentation | $0.72 |
| report | $0.15 |

## Time

| Phase | Duration | Outcome |
| --- | --- | --- |
| exploration | 18 s | completed |
| baseline | 11 s | completed |
| analysis | 5 min | completed |
| roadmap | 5 min | completed |
| awaiting_approval | 1 min (waiting) | completed |
| fixing | 33 min | completed |
| documentation | 4 min | completed |
| report | running | active |

## Escalations

- Upgrade to React 18 and switch main.jsx to createRoot, round 1: claude-sonnet-5-5 → claude-opus-5-5 (tier 3 tickets start on the strong model (FIXLOOP_STRONG_FROM_TIER=3))
- Split App.jsx into a data hook, a list reducer and a Toolbar component, round 1: claude-sonnet-5-5 → claude-opus-5-5 (tier 3 tickets start on the strong model (FIXLOOP_STRONG_FROM_TIER=3))

## Model policy

| Role | Models |
| --- | --- |
| explorer | claude-sonnet-5-5 |
| analyst | claude-opus-5-5 |
| tech_lead | claude-opus-5-5 |
| developer | claude-opus-5-5, claude-sonnet-5-5 |
| reviewer | claude-opus-5-5 |
| qa | claude-sonnet-5-5 |
| tech_writer | claude-opus-5-5 |

## Artifacts

Branch `showtime/a701be7d`: 27 commit(s) on deb4d8d.

- 15d34ba test: fix stale formatDate expectation and make it TZ-independent
- 26ba5d4 test: add App interaction and persistence characterization tests
- 65889ea test: cover form, lists, helpers, bus and filter gaps
- 6cc567b fix: upgrade axios, lodash and moment past high advisories
- d209a64 chore: delete legacy.js and the hardcoded API key
- 9147837 fix: render AddItemForm preview as JSX instead of innerHTML
- a96ea2c chore: upgrade vite/vitest/jsdom, drop uuid, use randomUUID ids
- ca3b0c9 refactor: convert App to a function component with hooks
- 41bef4d feat: upgrade to React 18 and render via createRoot in StrictMode
- fc867a1 refactor: move the Saved-ago tick into its own SavedLabel component
- 3be6b41 refactor: remove the unused pub/sub event bus
- 357cd75 refactor: replace jQuery DOM mutations with state, refs and CSS
- 55e19b8 refactor: derive Stats total and percent in render
- 10af1ec refactor: merge ArchivedList into a parameterised ItemList
- 20a9fd9 chore: pin Node, add ESLint with react-hooks rules, add CI
- 4144205 refactor: replace lodash with native sort/Set and drop the dependency
- 02ef4dc refactor: load the seed with fetch and remove axios
- bec9e7a fix: read DEBUG from import.meta.env.DEV instead of hardcoding true
- e470446 docs: fix README commands and document setup, tests, storage
- 3fd2898 refactor: drop duplicate formatDate and stale comments
- 4bf6bfe refactor: replace moment with Intl formatters and drop moment
- abf86ed refactor: use immutable item updates and derive lastSaved
- 9ecb23b refactor: replace duplicated filter switches with a predicate map
- 89c4818 refactor: split App into data hook, items reducer and Toolbar
- 829ac6d docs: use npm ci, document key rotation and dev container
- 2edb8ba docs: add ARCHITECTURE.md with modules, data flow and diagram
- 3dd42b1 docs: add NEXT_STEPS hand-off for the grocerly run

Files (`run:export <run> --dir <path>`): `showtime-a701be7d.bundle`, `showtime-a701be7d.patch`, `report.md`, `report.json`.

Documentation: `README.md`, `.devcontainer/devcontainer.json`, `ARCHITECTURE.md`, `docs/NEXT_STEPS.md`, `docs/showtime-report.md`.
