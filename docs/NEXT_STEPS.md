# Next steps

Hand-off for grocerly after run `showtime/a701be7d` (analysed at `deb4d8d`).

Every approved ticket was done. One ticket was already resolved by an earlier commit. No ticket was blocked or dropped, and no work remains planned.

## What was done

### Tier 0

- Fix the stale formatDate test and pin its timezone (15d34ba)
- Upgrade Vite/Vitest toolchain and drop unused uuid (a96ea2c)

### Tier 1

- Add unit tests for form, lists, helpers and the event bus (65889ea)
- Delete legacy.js and the hardcoded API key, then rotate the key (d209a64)
- Render the AddItemForm preview as JSX instead of innerHTML (9147837)
- Clear App's 1s interval and move the 'Saved … ago' tick into its own component (fc867a1)
- Compute the AddItemForm preview in render, drop its effect: already resolved by 9147837 (see below)
- Derive Stats total and percent in render instead of effects (55e19b8)
- Replace lodash sortBy/uniq/map with native code and remove lodash (4144205)
- Load the seed with fetch and remove axios (02ef4dc)
- Read DEBUG from the build environment instead of hardcoding true (bec9e7a)
- Fix README commands and document setup, tests and storage (e470446)
- Remove the duplicate formatDate in helpers.js and stale comments (3fd2898)
- Replace moment with Intl formatters and remove moment (4bf6bfe)

### Tier 2

- Add characterization tests for App interactions and persistence (26ba5d4)
- Upgrade axios, lodash and moment past their high advisories (6cc567b)
- Remove dead App lifecycle and props, then convert App to hooks (ca3b0c9)
- Remove the unused pub/sub event bus (3be6b41)
- Replace jQuery DOM mutations with refs, state and CSS, then remove jquery (357cd75)
- Merge ArchivedList into a parameterised ItemList (10af1ec)
- Pin Node, add ESLint with react-hooks rules, and a CI workflow (20a9fd9)
- Use immutable updates and set lastSaved without componentDidUpdate setState (abf86ed)
- Replace the duplicated filter switches with one predicate map (9ecb23b)

### Tier 3

- Upgrade to React 18 and switch main.jsx to createRoot (41bef4d)
- Split App.jsx into a data hook, a list reducer and a Toolbar component (89c4818)

## Requires setup

- **Revoke and rotate the API key that began `gk_live_7f3a…` at the provider.** Deleting it (d209a64) does not remove it from Git history, so treat it as compromised.

## Behaviour changes

- **AddItemForm preview** (9147837): HTML typed into the item or category field now shows as literal text in the preview. It is no longer parsed as markup. Normal input looks the same.
- **Item ids** (a96ea2c): new ids look like `i<uuid>` (from `crypto.randomUUID()`). Before, they looked like `i<0-999999>`. Existing stored ids are unaffected.
- **App unmount** (ca3b0c9): the one-second tick interval is now cleared when App unmounts. The seed result is also ignored if it arrives after unmount. Nothing visible changes while App is mounted.
- **React 18** (41bef4d): the app renders with React 18's concurrent root (automatic batching) inside StrictMode. In development, StrictMode runs effects twice, so the localStorage/seed load and the interval setup run twice on mount. Both clean up properly.
- **Event bus removed** (3be6b41): an `item:add` event no longer adds an item. Items are added through the `onAdd` prop.
- **Empty-name error** (357cd75): the error is now the `invalid` class on the name input (red border from CSS), not an inline border colour. The class clears on the next submit that has a name.
- **Form fade-in** (357cd75): the fade-in is now a 300ms CSS animation instead of jQuery `fadeIn`.
- **Seed load error** (02ef4dc): when `/seed.json` returns a non-2xx status, the error shown is the response `statusText` (for example `Error: Not Found`). It used to be axios's `Request failed with status code 404`.
- **Debug log** (bec9e7a): the "saved N items" console log no longer appears in production builds. It still appears in dev and under Vitest.

## Deferred

None. Both Tier 3 tickets were done in this run, and no item was over the cost ceiling.

## Blocked or dropped

None were blocked or dropped.

- "Compute the AddItemForm preview in render, drop its effect" was already resolved by 9147837. `src/components/AddItemForm.jsx` no longer keeps the preview in state. Its only effect has a `[]` dependency array and handles focus and fade-in. The preview is computed inline in render. The ticket recorded that the test suite was not run for this check.

## Known limitations

The run recorded no known limitations. The final scorecard still shows:

- Security: 2 moderate audit advisories remain (down from 1 critical and 4 high).
- Dependencies: 12 dependencies are a major version behind (11 before the run).
- Findings: 2 medium-severity findings remain.
- Test duration went from 773 ms to 2976 ms. The suite grew from 7 to 65 tests, and all 65 pass.

## Suggested order for remaining work

No work remains in the plan. Do the required setup first: rotate the API key.
