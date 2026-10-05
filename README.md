# grocerly

A small grocery list app, built with React and Vite.

## Requirements

Node.js 20 or newer (see `.nvmrc`; `nvm use` picks it up).

## Setup

```
npm ci          # install dependencies from package-lock.json
npm run dev     # start the dev server
npm test        # run the tests once (vitest)
npm run build   # production build into dist/
npm run preview # serve the production build locally
```

`npm run lint` runs ESLint.

### Required one-time action: rotate the leaked API key

An API key beginning `gk_live_7f3a…` used to be hardcoded in `src/config.js`.
It has been deleted from the code, but it is still in the Git history, so treat
it as compromised: revoke and rotate it at the provider.

## Data

Items are stored in the browser's localStorage (key `grocerly-items`). When
localStorage holds no items, the app loads its initial list from
`public/seed.json`.

## Development environment

`.devcontainer/devcontainer.json` defines a dev container based on the
`mcr.microsoft.com/devcontainers/javascript-node:24` image. It runs `npm ci`
after the container is created, so you can then use the commands above.
