# Showtime report: grocerly-repeat

|  |  |
| --- | --- |
| Repository | /Users/hpogorelic/Desktop/showtime-examples/grocerly-repeat (local checkout) |
| Commit | 3a1a0c8 |
| Branch | showtime/a9759377 |
| Pipeline | full |
| Status | completed |
| Started | 2026-10-05T05:40:54.690Z |
| Ended | 2026-10-05T06:07:03.727Z |
| Active time | 20 min |
| Run | a9759377-d445-411e-a1ce-f391b5e95edc |

## Since the previous run

Previous run a701be7d-f71e-49ac-8de6-81ef6f6ff0b9 (2026-10-02), at deb4d8d; now at 3a1a0c8.

- Showtime work merged since: 28 commit(s); its branch `showtime/a701be7d` is merged.
- Developer commits since: 3: afd0242 feat: put the API key back for the demo; 7c5cb33 feat: filter the list with qty>2 style queries; 3a1a0c8 docs: reword the README introduction.
- Findings: 38 resolved, 0 still open, 1 regressed, 13 new.

### Regressed

- Live API key still hardcoded in src/config.js, while README and ARCHITECTURE.md say it was removed: fixed last time by "Delete legacy.js and the hardcoded API key, then rotate the key"; severity raised from high

### New

- Search box input is passed to eval() in parseQuery, so any word containing <, > or = runs as code (introduced by 7c5cb33 feat: filter the list with qty>2 style queries)
- vitest ^3.2.7 has 2 advisories (medium), fixed by upgrading vitest to 5.0.3 or later
- ARCHITECTURE.md says the API_KEY is gone from src/config.js, but it is still hardcoded there (introduced by afd0242 feat: put the API key back for the demo)
- parseQuery's field-comparison search ('qty>2') and useVisibleItems have no tests at all (introduced by 7c5cb33 feat: filter the list with qty>2 style queries)
- ESLint 9 is marked deprecated/unsupported; the lint toolchain (eslint, @eslint/js, react-hooks plugin, globals) is one or two majors behind
- App (101 lines, hottest file with 13 commits) mixes view state, the highlight timer, and derived stats; move list-view state into a hook
- Dev container uses Node 24 while .nvmrc and CI pin Node 20, so local and CI runtimes differ
- lastSaved is computed with new Date() inside useMemo: an impure memo that does not record when anything was saved
- The itemsReducer and useGroceryItems state logic is tested only indirectly through App
- Suspected: O(n²) findDuplicates and other derived stats rerun on every App render, including each highlight timer tick
- Highlight timeout ids pile up in a ref array that is never pruned; a setTimeout(0) is used just to set state
- React 18 and its test stack (@testing-library/react 14, jest-dom 5) are majors behind; React 19 is current
- Archived list re-implements the 'done' predicate inline instead of using applyFilter from filters.js

### Resolved

- Empty UNSAFE_componentWillReceiveProps lifecycle (deprecated since React 16.3, warns in StrictMode) (Showtime commit ca3b0c9 refactor: convert App to a function component with hooks)
- Vitest 0.34.6 has a critical advisory (fixed in >=3.2.6); Vite 4.5.3 has a high advisory (fixed above 6.4.2) (Showtime commit a96ea2c chore: upgrade vite/vitest/jsdom, drop uuid, use randomUUID ids)
- App starts a 1s setInterval in componentDidMount that is never cleared and re-renders the whole tree every second (Showtime commit fc867a1 refactor: move the Saved-ago tick into its own SavedLabel component)
- Runtime dependencies with high advisories: axios 0.21.1, lodash 4.17.15, moment 2.24.0 (Showtime commit 6cc567b fix: upgrade axios, lodash and moment past high advisories)
- User input reaches dangerouslySetInnerHTML in AddItemForm preview (self-XSS / HTML injection) (Showtime commit 9147837 fix: render AddItemForm preview as JSX instead of innerHTML)
- Suspected hotspot: 1-second setInterval re-renders the whole App forever and is never cleared (Showtime commit fc867a1 refactor: move the Saved-ago tick into its own SavedLabel component)
- Failing test: formatDate expectation is stale ('formatDate uses ISO style') (Showtime commit 15d34ba test: fix stale formatDate expectation and make it TZ-independent)
- README tells users to run `npm start`, which does not exist; no setup/test instructions (Showtime commit e470446 docs: fix README commands and document setup, tests, storage)
- ArchivedList duplicates ItemList's row markup and differs only in a done filter, id prefix and empty text (Showtime commit 10af1ec refactor: merge ArchivedList into a parameterised ItemList)
- src/utils/legacy.js is unreachable, kept 'in case', and pulls in the hard-coded API_KEY (Showtime commit d209a64 chore: delete legacy.js and the hardcoded API key)
- Stats keeps total and percent in state through a chain of two effects instead of deriving them (Showtime commit 55e19b8 refactor: derive Stats total and percent in render)
- AddItemForm derives the preview in a useEffect with no dependency array, so every render triggers a second setState (Showtime commit 357cd75 refactor: replace jQuery DOM mutations with state, refs and CSS); not re-checked: the analysis was partial
- jquery (3.5.1) duplicates React's DOM ownership in 2 files (Showtime commit 357cd75 refactor: replace jQuery DOM mutations with state, refs and CSS)
- jQuery changes React-owned DOM directly (classes, focus, hide/fadeIn, inline border colour) (Showtime commit 357cd75 refactor: replace jQuery DOM mutations with state, refs and CSS)
- The pub/sub bus is effectively dead: nothing emits 'item:add', and nothing listens to 'item:added' or 'form:submitted' (Showtime commit 3be6b41 refactor: remove the unused pub/sub event bus)
- Suspected hotspot: AddItemForm effect without deps sets state after every render (Showtime commit 357cd75 refactor: replace jQuery DOM mutations with state, refs and CSS); not re-checked: the analysis was partial
- applyFilter and countByFilter repeat the same 6-case switch on `type`, with predicates copied into each (Showtime commit 9ecb23b refactor: replace duplicated filter switches with a predicate map)
- uuid 8.3.2 is deprecated, has a moderate advisory (<11.1.1), and is never imported (Showtime commit a96ea2c chore: upgrade vite/vitest/jsdom, drop uuid, use randomUUID ids)
- App.jsx (205 lines) mixes persistence, seeding, list mutations, filtering/sorting, jQuery DOM effects and toolbar markup (Showtime commit 89c4818 refactor: split App into data hook, items reducer and Toolbar)
- App behaviour (add/toggle/remove/clear done/sort/filter, persistence) untested; only a render smoke test exists (Showtime commit 26ba5d4 test: add App interaction and persistence characterization tests)
- No tests for components AddItemForm, ItemList, ArchivedList, Stats or helpers/bus (Showtime commit 65889ea test: cover form, lists, helpers, bus and filter gaps)
- formatDate is defined twice (format.js and helpers.js), with a comment admitting the copy (Showtime commit 3fd2898 refactor: drop duplicate formatDate and stale comments)
- uuid is declared as a dependency but never imported; ids come from Math.random instead (Showtime commit a96ea2c chore: upgrade vite/vitest/jsdom, drop uuid, use randomUUID ids)
- moment (2.24.0, in maintenance mode, large bundle) used only for one fixed date format and fromNow (Showtime commit 4bf6bfe refactor: replace moment with Intl formatters and drop moment)
- uuid declared but never imported, while IDs are made with Math.random (collision-prone list keys) (Showtime commit a96ea2c chore: upgrade vite/vitest/jsdom, drop uuid, use randomUUID ids)
- lodash (4.17.15) used only for sortBy, uniq and map, which have native equivalents (Showtime commit 4144205 refactor: replace lodash with native sort/Set and drop the dependency)
- DEBUG flag hardcoded to true, so save logging ships in production (Showtime commit bec9e7a fix: read DEBUG from import.meta.env.DEV instead of hardcoding true)
- Legacy ReactDOM.render root (deprecated in React 18, removed in React 19) blocks the upgrade path (Showtime commit 41bef4d feat: upgrade to React 18 and render via createRoot in StrictMode)
- axios (0.21.1) used for one GET of a static JSON file; its other use is in dead legacy sync code (Showtime commit 02ef4dc refactor: load the seed with fetch and remove axios)
- List handlers deep-copy all state with JSON.parse(JSON.stringify) and then rebuild it in hand-written loops (Showtime commit abf86ed refactor: use immutable item updates and derive lastSaved)
- No Node version pin, no linter config, no CI (Showtime commit 20a9fd9 chore: pin Node, add ESLint with react-hooks rules, add CI)
- Empty UNSAFE_componentWillReceiveProps, and props passed to ItemList/ArchivedList that the components never read (Showtime commit ca3b0c9 refactor: convert App to a function component with hooks)
- Global pub/sub bus beside props: App listens to 'item:add' that nothing emits, and emits events nobody consumes (Showtime commit 3be6b41 refactor: remove the unused pub/sub event bus)
- componentDidUpdate calls setState(lastSaved) after every items change, forcing a second render; every handler deep-clones state with JSON (Showtime commit abf86ed refactor: use immutable item updates and derive lastSaved)
- Root App is a 190-line class component with constructor binds and a var self = this pattern (Showtime commit ca3b0c9 refactor: convert App to a function component with hooks)
- Tests never run automatically: no CI workflow (Showtime commit 20a9fd9 chore: pin Node, add ESLint with react-hooks rules, add CI)
- Suspected waste: every mutation JSON deep-clones the full list, and componentDidUpdate setState forces a second render (Showtime commit abf86ed refactor: use immutable item updates and derive lastSaved)
- Stale/misleading comments: duplicated formatDate 'import cycle' note and stray hotfix trailer (Showtime commit 3fd2898 refactor: drop duplicate formatDate and stale comments)

## Setup required

Before using the result:

1. Revoke and rotate the leaked <redacted>… key at the provider. The key remains in Git history, so it must be treated as compromised. (Remove the hardcoded live API key from src/config.js and fix the docs, 5346638)
2. Rebuild the dev container (Dev Containers: Rebuild Container) to pick up the Node 20 image. The existing container was built from the Node 24 image and does not update itself (Align the dev container on Node 20 to match .nvmrc and CI, af051ad)

## Summary

Before using the result, someone needs to do 2 setup steps: revoke and replace the leaked live API key with the provider, because the key is still in the project's history, and rebuild the development container so it picks up the same Node version that the project settings and automated checks use. The run finished 6 tickets, a mix of new tests that record current behaviour, security fixes, a fix to how the save time is recorded, and aligning the development environment's Node version. The biggest change for security is in the search box: anything typed into it used to run as code, and it is now checked against a fixed list of allowed comparisons, with malformed search words ignored instead of breaking the list. The second change removes the hardcoded live API key, which had been added back to the code, and corrects the documentation that wrongly said it was already gone. On the scorecard 3 measures got better and 0 got worse: the test count rose from 65 to 115 with all passing, framework alignment rose from 94 to 97 percent, and the 2 moderate security advisories are unchanged. Three tickets were left: 1 is blocked because splitting up the main screen's code would change behaviour that the existing tests require, so a person has to decide, and 2 large upgrades (the test runner, plus the lint tools and React) are deferred because each one needs its own approval. The architecture document and a next-steps handoff were written, but the README update is blocked because it would have put back the old development container setting and undone a decision made at the approval step. The run took 20 minutes of active time and cost $3.58.

- Search box input no longer runs as code: an allowed-list parser replaced it
- Hardcoded live API key removed; it must still be revoked and replaced with the provider
- Tests grew from 65 to 115, with all passing
- 2 setup steps required: replace the leaked key and rebuild the development container
- 1 ticket blocked and 2 large upgrades deferred until someone approves them

## Health

| Area | Before | After | Why (after) |
| --- | --- | --- | --- |
| build | 🟢 green | 🟢 green | the production build completes |
| tests | 🟢 green | 🟢 green | 115 tests, none failing |
| security | 🟡 yellow | 🟡 yellow | 2 moderate advisories remain |
| dependencies | 🔴 red | 🔴 red | 12 a major behind, 0 unused, 0 overlapping |
| alignment | 🟢 green | 🟢 green | framework alignment 97% |
| structure | 🟢 green | 🟢 green | 0% duplicated, 0 oversized modules, 0 unreachable files |
| docs | 🟢 green | 🟢 green | a README whose commands match the scripts |
| hygiene | 🟢 green | 🟢 green | lint true, ci true, node true |

## Scorecard

| Metric | Previous run | Before | After | Change | Provenance |
| --- | --- | --- | --- | --- | --- |
| install.ok | true | true | true |  | measured |
| install.durationMs | 538 | 576 | 576 |  | measured |
| install.cached | true | true | true |  | measured |
| build.ok | true | true | true |  | measured |
| build.durationMs | 1664 | 1001 | 1001 |  | measured |
| build.warnings | 0 | 0 | 0 |  | inferred |
| tests.runner | vitest | vitest | vitest |  | measured |
| tests.total | 65 | 65 | 115 | +50 ✓ | measured |
| tests.passed | 65 | 65 | 115 | +50 ✓ | measured |
| tests.failed | 0 | 0 | 0 |  | measured |
| tests.skipped | 0 | 0 | 0 |  | measured |
| tests.failing |  |  |  |  | measured |
| tests.durationMs | 3020 | 2311.102783203125 | 5200 | +2888.9 | measured |
| audit.critical | 0 | 0 | 0 |  | measured |
| audit.high | 0 | 0 | 0 |  | measured |
| audit.moderate | 2 | 2 | 2 |  | measured |
| audit.low | 0 | 0 | 0 |  | measured |
| audit.total | 2 | 2 | 2 |  | measured |
| serve.ok | true | true | true |  | measured |
| serve.readyMs | 229 | 193 | 193 |  | measured |
| serve.httpStatus | unknown | unknown | unknown |  | unknown |
| lint.configured | true | true | true |  | inferred |
| types.configured | false | false | false |  | inferred |
| types.strict | unknown | unknown | unknown |  | unknown |
| ci.configured | true | true | true |  | inferred |
| node.pinned | true | true | true |  | inferred |
| docs.readme_present | true | true | true |  | inferred |
| docs.readme_commands_valid | true | true | true |  | inferred |
| deps.outdated_major | 12 | 12 | 12 |  | measured |
| deps.unused_declared | 0 | 0 | 0 |  | inferred |
| repo.size_files | 26 | 27 | 33 | +6 | inferred |
| repo.size_loc | 1079 | 1093 | 1563 | +470 | inferred |
| alignment.framework | 84 | 94 | 97 | +3 ✓ | measured |
| libs.overlapping | 0 | 0 | 0 |  | measured |
| dup.percent | 0 | 0 | 0 |  | measured |
| modules.oversized | 0 | 0 | 0 |  | measured |
| deadcode.files | 0 | 0 | 0 |  | measured |
| findings.by_severity | critical 0, high 0, medium 2, low 0, info 0 | critical 1, high 1, medium 3, low 7, info 2 | critical 0, high 0, medium 1, low 4, info 2 | changed | measured |

3 better, 0 worse, 4 changed without a direction.

## Tickets

### Done (6)

| Tier | Ticket | Commit | Rounds |
| --- | --- | --- | --- |
| 1 | Add characterization tests for src/App.jsx and src/config.js | 95ed0bb | 1 |
| 0 | Remove the hardcoded live API key from src/config.js and fix the docs | 5346638 | 1 |
| 1 | Add tests for parseQuery and useVisibleItems | f9e6e08 | 1 |
| 1 | Replace eval in parseQuery with an allowlisted comparison parser | d12c53f | 1 |
| 1 | Record lastSaved in the persist effect and unit-test the items hook | 2c2a054 | 1 |
| 1 | Align the dev container on Node 20 to match .nvmrc and CI | af051ad | 1 |

### Blocked (1)

- **Split App.jsx into useListView and useHighlight hooks and memoize stats** (Tier 2, blocked)
  - Why: needs a human: The ticket asks for behaviour changes that the "existing App tests pass unchanged" check would reject.

1. **Highlight timing.** The ticket says to call `setHighlightedId(id)` directly in `handleAdd`. That highlights the row in the same render as the add. `src/App.test.jsx` ("the new item is highlighted briefly...") and `src/App.handleAdd.test.jsx` ("highlights the new row on the next tick...") both assert the row has no `highlight` class right after the add and gains it only after `advanceTimersByTime(0)`. The direct call would fail both. `App.handleAdd.test.jsx` also asserts "unmounting before the timers fire cancels the pending highlight". It expects `vi.getTimerCount()` to be 0 after the unmount.

2. **Duplicate reporting.** A `findDuplicates` that reports 'Milk' and 'milk' once would show "Duplicates: Milk". `src/App.test.jsx` ("adding the same name twice shows a Duplicates line") expects exactly "Duplicates: Milk, milk". The ticket asks me to update `helpers.test.js` for the new result but to leave the App tests unchanged. Both can't hold.

The hook split (`useListView`), the `useMemo` wrapping and `applyFilter(items, 'done')` for the archived list don't conflict with any test.
  - Expected to move: alignment.framework

### Deferred (2)

- **Upgrade vitest from 3 to 5 to clear its two moderate advisories** (Tier 3, needs its own approval)
  - Why: Tier 3: runs only when approved individually at the gate (approvedTicketIds)
  - Expected to move: audit.total
  - Sketch, before: package.json devDependencies: "vitest": "^3.2.7". The test runner reports 2 moderate advisories, one coming from a package vitest brings in. Tests run with `vitest run` under jsdom, using setupFiles src/setupTests.js.
  - Sketch, after: package.json devDependencies: "vitest": "^5.0.3" (or later), with package-lock.json regenerated. Steps: (1) npm install -D vitest@^5.0.3. (2) Update the Vite/Vitest config for any renamed test options. (3) npm test: all tests pass. (4) npm audit: 0 moderate advisories. (5) npm run build still succeeds. No source changes are expected.
- **Upgrade the lint toolchain and move React and its test stack to 19** (Tier 3, needs its own approval)
  - Why: Tier 3: runs only when approved individually at the gate (approvedTicketIds)
  - Expected to move: deps.outdated_major, deps.outdated, alignment.framework
  - Sketch, before: package.json: react/react-dom 18.3.1; eslint and @eslint/js ^9.39.5 (ESLint 9 deprecated); eslint-plugin-react-hooks ^5.2.0; globals ^15.15.0; eslint-plugin-react ^7.37.5; @testing-library/react 14.3.1; @testing-library/jest-dom 5.16.5. ESLint flat config in eslint.config.js.
  - Sketch, after: Step 1 (lint): eslint and @eslint/js ^10, eslint-plugin-react-hooks ^7, globals ^17, eslint-plugin-react on a version that supports ESLint 10. Adjust eslint.config.js (hooks plugin preset names); npm run lint is clean. Step 2 (tests, still on React 18): @testing-library/react ^16 plus @testing-library/dom as its peer, @testing-library/jest-dom ^6; update setupTests.js imports if needed; npm test passes. Step 3 (framework): react and react-dom ^19 via the react-codemod React 19 recipe; fix removed APIs and ref/act changes; npm test and npm run build pass. Each step is committed separately.

### Decisions at the gate (1)

- Which Node major should local development and CI share?: decided at the gate: Stay on Node 20: change the dev container to Node 20 (matches .nvmrc and CI)

### Documentation (3)

| Ticket | Status | Commit |
| --- | --- | --- |
| Update README.md from the run: setup, commands, development environment | blocked | - |
| Write ARCHITECTURE.md with the module responsibilities and the diagram | done | 71c0f2b |
| Write docs/NEXT_STEPS.md: what was done, what is left, and in which order | done | 01499da |

## Behaviour changes

- `API_KEY` is no longer exported from src/config.js. It was a live secret shipped in the client bundle; nothing imported it. (Remove the hardcoded live API key from src/config.js and fix the docs)
- Search words with a comparison operator on an unknown field (e.g. price>1) or malformed words (e.g. >5, qty>) are now ignored instead of filtering everything out or throwing. A single '=' now compares instead of assigning and mutating the item. Removing eval (code injection) as the ticket requires; the old tests had pinned the mutation and the SyntaxError, so I changed them to the new safe behaviour. (Replace eval in parseQuery with an allowlisted comparison parser)
- done comparisons now convert the value to a boolean (done=true / done==true compare against true). Ticket asks for boolean conversion on the done field. (Replace eval in parseQuery with an allowlisted comparison parser)
- lastSaved is now set from the persist effect, one render after the items change, instead of in the same render. It is also set when the seed is first written to storage, so 'Saved' still shows once the first load completes. The timestamp now records an actual write rather than being recomputed by useMemo. (Record lastSaved in the persist effect and unit-test the items hook)

## Findings not turned into tickets

Every finding is covered by a ticket.

## Limitations

None.

## Cost

About $3.58 of model usage (approximate, from the configured prices); $3.44 before this report's narrative was written. Cache hit ratio 76.2%: the share of input tokens read from the prompt cache.

| Role | Cost |
| --- | --- |
| explorer | $0.07 |
| analyst | $1.09 |
| tech_lead | $0.41 |
| qa | $0.26 |
| reviewer | $0.70 |
| developer | $0.38 |
| tech_writer | $0.67 |

| Phase | Cost |
| --- | --- |
| exploration | $0.07 |
| analysis | $1.09 |
| roadmap | $0.41 |
| fixing | $1.00 |
| documentation | $0.88 |
| report | $0.14 |

Retries (each a turn): submissions sent back by the output schema, refused for missing tests/build/lint, replies cut at the output limit, fields repaired from JSON strings.

| Role | Model | Validation | Refused | Cut off | Repaired |
| --- | --- | --- | --- | --- | --- |
| analyst | claude-opus-5-5 | 2 | 0 | 0 | 0 |
| qa | claude-sonnet-5-5 | 0 | 1 | 0 | 0 |

## Time

| Phase | Duration | Outcome |
| --- | --- | --- |
| exploration | 24 s | completed |
| baseline | 11 s | completed |
| analysis | 5 min | completed |
| roadmap | 2 min | completed |
| awaiting_approval | 19 s (waiting) | completed |
| fixing (×2) | 8 min | completed |
| documentation | 4 min | completed |
| report | running | active |

## Escalations

None.

## Model policy

| Role | Models |
| --- | --- |
| explorer | claude-sonnet-5-5 |
| analyst | claude-opus-5-5 |
| tech_lead | claude-opus-5-5 |
| qa | claude-sonnet-5-5 |
| reviewer | claude-opus-5-5 |
| developer | claude-sonnet-5-5 |
| tech_writer | claude-opus-5-5 |

## Artifacts

Branch `showtime/a9759377`: 8 commit(s) on 3a1a0c8.

- 95ed0bb test: pin App handleAdd and config behaviour
- 5346638 fix: remove hardcoded live API key from src/config.js
- f9e6e08 test: pin parseQuery and useVisibleItems behaviour
- d12c53f fix: replace eval in parseQuery with an allowlisted comparison parser
- 2c2a054 fix: record lastSaved in the persist effect and test the items hook
- af051ad chore: align dev container on Node 20 with .nvmrc and CI
- 71c0f2b docs: update ARCHITECTURE.md for parseQuery, persist effect and diagram
- 01499da docs: rewrite NEXT_STEPS hand-off for run a9759377

Files (`run:export <run> --dir <path>`): `showtime-a9759377.bundle`, `showtime-a9759377.patch`, `report.md`, `report.json`.

Documentation: `ARCHITECTURE.md`, `docs/NEXT_STEPS.md`, `docs/showtime-report.md`.
