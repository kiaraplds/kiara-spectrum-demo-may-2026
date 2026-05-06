# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is Adobe's React Spectrum monorepo — a large collection of accessible UI component libraries (`@react-spectrum/*`, `@react-aria/*`, `@react-stately/*`, `react-aria-components`, etc.). It is a pure frontend/library project with no databases, backend services, or external API dependencies.

### Environment requirements

- **Node.js 24** (v24.13.0+ per CONTRIBUTING.md; `.nvmrc` specifies `24`)
- **Yarn 4.2.2** (Berry, via corepack; `nodeLinker: node-modules` in `.yarnrc.yml`)
- No Docker, no databases, no secrets required

### Known issue: babel version conflicts in `postinstall`

The `postinstall` script runs `patch-package && yarn build:icons`. The `build:icons` step uses `babel-node` which fails on fresh installs due to version mismatches between the pinned `@babel/traverse` resolution (7.24.1) and newer transitive babel helper packages (7.27+).

**Workaround for icon generation:**

1. Install with `yarn install --mode=skip-build` to skip postinstall
2. Run `npx patch-package` manually (it will show a warning about `@types/mdx` — this is non-critical)
3. Generate icon source files using `@babel/register` directly:
   ```bash
   for pkg in workflow ui color express; do
     cd /workspace/packages/@spectrum-icons/$pkg
     node -e "require('@babel/register')({presets:[['@babel/preset-env',{targets:{node:'current'}}]],extensions:['.js','.cjs','.ts','.tsx']});require('./scripts/generateIcons.cjs');"
   done
   ```
4. Build icon JS files with babel CLI:
   ```bash
   for pkg in workflow ui color express illustrations; do
     cd /workspace/packages/@spectrum-icons/$pkg
     PATH="/workspace/node_modules/.bin:$PATH" cross-env BUILD_ENV=production babel --root-mode upward src -d . --extensions '.ts,.tsx'
     PATH="/workspace/node_modules/.bin:$PATH" cross-env BUILD_ENV=production babel src -d . --extensions '.ts,.tsx' --out-file-extension '.module.mjs' --config-file '../../../babel-esm.config.json'
   done
   ```

If babel CLI also fails (due to the same `@babel/traverse` conflict), you may need to install compatible babel helper packages at version 7.24.7 into `node_modules/@babel/`. Key packages: `helper-module-transforms`, `helper-simple-access`, `helper-compilation-targets`, `helpers`, `helper-replace-supers`, `helper-remap-async-to-generator`, `helper-wrap-function`, `helper-annotate-as-pure`, `template`, `types`, `traverse`, `generator`, `core`, `preset-env`, `plugin-transform-class-properties`, `plugin-transform-async-generator-functions`, `plugin-transform-modules-commonjs`, `plugin-transform-classes`, `helper-create-class-features-plugin`.

### Running services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| S2 Storybook | `yarn start:s2` | 6006 | **Recommended** — builds cleanly |
| Main Storybook | `yarn start` | 9003 | May fail due to WIP story files (e.g. MetricCard) |
| Documentation | `yarn start:docs` | 1234 | Parcel-based docs site |

### Testing

- **Unit tests:** `yarn jest` (uses `@swc/jest`, runs in jsdom — no browser needed)
- **Run specific package tests:** `yarn jest packages/<path> --no-coverage`
- **Lint:** `yarn lint` runs `check-types` (tsgo), eslint, `lint-packages.js`, and `yarn constraints` concurrently
- **ESLint only:** `npx eslint packages/<path>`
- **Type checking only:** `yarn check-types` (uses tsgo)

### Notes

- The `tsgo` type checker reports errors in `node_modules/@types/babel__traverse` and `@types/mdx` due to the pinned resolution versions — these are expected and not actual project code issues.
- The main storybook (`yarn start`) currently fails to build due to a missing `MetricCard` component referenced by its story file. Use `yarn start:s2` for development.
- Tests use `@swc/jest` for transpilation (not babel), so test running is unaffected by the babel version issues.
