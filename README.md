# grocerly

Grocery list app built with React and Vite.

## Requirements

Node.js 20 or newer (see `.nvmrc`; `nvm use` picks it up).

## Setup

```
npm install     # install dependencies
npm run dev     # start the dev server
npm test        # run the tests once (vitest)
npm run build   # production build into dist/
npm run preview # serve the production build locally
```

`npm run lint` runs ESLint.

## Data

Items are stored in the browser's localStorage (key `grocerly-items`). When
localStorage holds no items, the app loads its initial list from
`public/seed.json`.
