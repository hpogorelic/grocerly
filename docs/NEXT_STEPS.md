# Next steps

Hand-off for grocerly after run `showtime/a9759377` (analysed at `3a1a0c8`).

Every planned Tier 0 and Tier 1 ticket was done. Two Tier 3 tickets are deferred until they are approved, and one Tier 2 ticket is blocked until someone makes a decision.

## What was done

### Tier 0

- Remove the hardcoded live API key from src/config.js and fix the docs (5346638). Carried over: run `a701be7d` fixed it, but it came back as a regression.

### Tier 1

- Add characterization tests for src/App.jsx and src/config.js (95ed0bb)
- Add tests for parseQuery and useVisibleItems (f9e6e08)
- Replace eval in parseQuery with an allowlisted comparison parser (d12c53f)
- Record lastSaved in the persist effect and unit-test the items hook (2c2a054)
- Which Node major should local development and CI share? Decided at the gate: **Stay on Node 20: change the dev container to Node 20 (matches .nvmrc and CI)**
- Align the dev container on Node 20 to match .nvmrc and CI (af051ad)

## Requires setup

- **Revoke and rotate the leaked API key at the provider** (5346638). The key is still in Git history, so treat it as compromised.
- **Rebuild the dev container** (Dev Containers: Rebuild Container) so it picks up the Node 20 image (af051ad). An existing container was built from the Node 24 image and does not update itself.

## Behaviour changes

- **`API_KEY` removed** (5346638): `src/config.js` no longer exports `API_KEY`. It was a live secret shipped in the client bundle, and nothing imported it.
- **Search comparisons** (d12c53f): search words that use a comparison operator on an unknown field (e.g. `price>1`) and malformed words (e.g. `>5`, `qty>`) are now ignored. Before, they filtered out every item or threw an error. A single `=` now compares instead of assigning to and mutating the item.
- **`done` comparisons** (d12c53f): `done=true` and `done==true` now convert the value to a boolean before comparing.
- **lastSaved** (2c2a054): lastSaved is now set by the persist effect, one render after the items change, instead of in the same render. It is also set when the seed is first written to storage, so "Saved" still shows after the first load.

## Deferred

These Tier 3 tickets run only when each one is approved individually at the gate.

### Upgrade vitest from 3 to 5 to clear its two moderate advisories

Expected to move: `audit.total`.

- **Before:** `package.json` devDependencies has `"vitest": "^3.2.7"`. The audit reports 2 moderate advisories, and one of them comes from a package that vitest brings in. Tests run with `vitest run` under jsdom, with setupFiles `src/setupTests.js`.
- **After:** `"vitest": "^5.0.3"` or later, with `package-lock.json` regenerated. Steps:
  1. Install vitest `^5.0.3`.
  2. Check vitest 5's requirements against vite `^6.4.3` and jsdom `^26`.
  3. Update the test config for any renamed or removed options.
  4. `npm test` reports 65 or more passing tests.
  5. The audit shows 0 moderate advisories.
  6. `npm run build` still succeeds.

  No source changes are expected.

### Upgrade the lint toolchain and move React and its test stack to 19

Expected to move: `deps.outdated_major`, `deps.outdated`, `alignment.framework`.

- **Before:** react/react-dom 18.3.1; eslint and @eslint/js `^9.39.5` (ESLint 9 is deprecated); eslint-plugin-react-hooks `^5.2.0`; globals `^15.15.0`; eslint-plugin-react `^7.37.5`; @testing-library/react 14.3.1; @testing-library/jest-dom 5.16.5. The ESLint flat config is in `eslint.config.js`.
- **After:** three separate commits, so a failed step can be reverted on its own:
  1. **Lint.** Move eslint and @eslint/js to `^10` together, but first check that eslint-plugin-react supports ESLint 10 and upgrade it if needed. Then move eslint-plugin-react-hooks to `^7` and globals to `^17`. Adjust the hooks plugin preset names in `eslint.config.js`. Run `npm run lint` after each step.
  2. **Test stack, still on React 18.** Move @testing-library/react to `^16` and add its peer @testing-library/dom. Move @testing-library/jest-dom to `^6`. Update the imports in `setupTests.js` if needed. `npm test` passes.
  3. **Framework.** Move react and react-dom to `^19` with the react-codemod React 19 recipe. Fix removed APIs and the ref/act changes. `npm test` and `npm run build` pass.

No item was over the cost ceiling.

## Blocked or dropped

### Split App.jsx into useListView and useHighlight hooks and memoize stats (Tier 2): blocked, needs a human

Expected to move: `alignment.framework`.

The ticket asks for behaviour changes, and its own check says the existing App tests must pass unchanged. The checks would reject those changes:

1. **Highlight timing.** The ticket says to call `setHighlightedId(id)` directly in `handleAdd`, which highlights the row in the same render as the add. Two tests expect the row to have no `highlight` class right after the add and to get it only after `advanceTimersByTime(0)`: "the new item is highlighted briefly..." in `src/App.test.jsx` and "highlights the new row on the next tick..." in `src/App.handleAdd.test.jsx`. `App.handleAdd.test.jsx` also expects `vi.getTimerCount()` to be 0 after an unmount that happens before the timers fire.
2. **Duplicate reporting.** A case-insensitive `findDuplicates` would show "Duplicates: Milk". `src/App.test.jsx` ("adding the same name twice shows a Duplicates line") expects exactly "Duplicates: Milk, milk".

The `useListView` split, the `useMemo` wrapping and the use of `applyFilter(items, 'done')` for the archived list conflict with no test. A human has to choose: allow these tests to change, or narrow the ticket to the parts with no conflict.

- **Before:** App has 7 `useState` calls plus a timer ref, a `handleAdd` with nested timeouts, `handleFilter`/`handleSort`/`handleSearch`, derived dupes/cats/counts, and the JSX.
- **After:** `useListView(items) -> { visible, search, onSearch, onFilter, onSort }`, `useHighlight() -> { highlightedId, highlight(id) }`, and an App that wires `useGroceryItems` and the two hooks into Toolbar/ItemList/Stats.

Nothing was dropped.

## Known limitations

The run recorded no known limitations. The final scorecard still shows:

- Security: 2 moderate audit advisories remain (vitest upgrade above).
- Dependencies: 12 dependencies are a major version behind.
- Findings: 1 medium, 4 low and 2 info.
- Tests: 115 pass (65 before the run). The suite now takes 4902 ms, up from about 2311 ms.

## Suggested order for remaining work

1. Do the required setup: rotate the API key and rebuild the dev container.
2. Upgrade vitest from 3 to 5 to clear its two moderate advisories
3. Upgrade the lint toolchain and move React and its test stack to 19
4. Split App.jsx into useListView and useHighlight hooks and memoize stats (after the decision described under "Blocked or dropped")
