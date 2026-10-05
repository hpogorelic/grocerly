# Architecture

Grocerly is a single-page grocery list app built with React and Vite. It has 16 source files under `src/`, plain JavaScript/JSX.

## Modules

| Module | Files | Responsibility |
| --- | --- | --- |
| `src/main.jsx` | 1 | React entry. Mounts `App` into `index.html` with `createRoot`, inside `StrictMode`. |
| `src/App.jsx` | 1 | Root function component. Holds the UI state (filter, search, sort, archived view, highlighted item), turns user actions into item actions, and wires up the child components. |
| `src/hooks` | 3 | `useGroceryItems` loads items from localStorage or the seed, saves them when they change, and exposes `dispatch`. `itemsReducer` holds the list changes (`load`, `add`, `toggle`, `remove`, `clearDone`) as immutable updates. `useVisibleItems` computes the filtered, searched and sorted list. |
| `src/components` | 5 | Presentational components: `AddItemForm`, `ItemList` (also renders the archived list, through `idPrefix`/`emptyText` props), `Toolbar`, `Stats`, and `SavedLabel`, which owns the one-second tick for the "Saved … ago" text. |
| `src/utils` | 3 | `filters` (one predicate map behind `applyFilter` and `countByFilter`), `helpers` (`relative`, `categories`, `findDuplicates`, `capitalize`), `format` (`formatDate`, `formatQty`, `pluralize`, using `Intl`). |
| `src/config.js` | 1 | Constants: `SEED_URL`, `STORAGE_KEY`, and `DEBUG` (from `import.meta.env.DEV`). |
| (root) | 2 | `vite.config.js` and `eslint.config.js`. |

Removed by the run:

- `src/utils/bus.js` (the pub/sub event bus) and `src/utils/legacy.js` are gone.
- `src/components/ArchivedList` is gone. It was merged into `ItemList`.
- The hardcoded `API_KEY` in `src/config.js` is gone.
- The architecture analysis lists `public` as removed. It now counts 0 source files there. The app still fetches `/seed.json` (`SEED_URL`).

Tests sit next to the code they cover: `src/App.test.jsx`, `src/main.test.jsx`, `src/components/AddItemForm.test.jsx`, `src/components/ItemList.test.jsx`, `src/utils/filters.test.js`, `src/utils/format.test.js`, `src/utils/helpers.test.js`. Shared test setup is in `src/setupTests.js`.

## Entry points

- `src/main.jsx`: the application.
- `vite.config.js`: build, dev server and test configuration (`npm run dev`, `npm run build`, `npm test`).
- `eslint.config.js`: lint configuration (`npm run lint`).
- `src/setupTests.js` and the test files listed above: the Vitest suite.

## Data flow

1. On mount, `useGroceryItems` reads items from localStorage (key `grocerly-items`). If it finds none, it fetches `/seed.json` with `fetch`. A non-2xx response becomes an error that `App` shows.
2. Items live in the `itemsReducer` state. User actions in `App` (add, toggle, remove, clear done) dispatch reducer actions. Filter, sort, search and the archived view are local `App` state.
3. `useVisibleItems` uses `utils/filters` to build the displayed list. `App` also uses `utils/filters` for the open/done counts and `utils/helpers` for categories and duplicates.
4. `App` passes the items and callbacks down to the components. Items are added only through `AddItemForm`'s `onAdd` prop.
5. When the items change, `useGroceryItems` writes them back to localStorage and updates `lastSaved`, which `SavedLabel` shows.

## Diagram

```mermaid
flowchart LR
  m0["(root) (2 files)"]
  m1["src/App.jsx (1 file)"]
  m2["src/components (5 files)"]
  m3["src/config.js (1 file)"]
  m4["src/hooks (3 files)"]
  m5["src/main.jsx (1 file)"]
  m6["src/utils (3 files)"]
  m1 -->|5| m2
  m2 -->|5| m6
  m1 -->|2| m4
  m1 -->|2| m6
  m4 -->|1| m3
  m4 -->|1| m6
  m5 -->|1| m1
```

Each arrow is an import dependency, and its label counts the imports. `src/main.jsx` imports only `App`. `App` is the hub. It imports the five components, the two hooks that own the item data and the visible list, and two utils modules (filters for the counts, helpers for categories and duplicates). The components depend on `src/utils` for formatting and helpers. The hooks are the only code that reads `src/config.js`, because loading and saving items happens only there. Nothing imports the (root) config files, which the tooling reads. No module imports `App` or the hooks back, so data flows in one direction from the hooks through `App` to the components.
