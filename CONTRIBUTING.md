# Contributing to Schematic Icons

Thanks for your interest in contributing! This guide will help you get started.

## Quick Start

1. Fork and clone the repository
2. Install dependencies: `yarn install`
3. Make your changes
4. Build and test: `yarn build:all`
5. Submit a pull request

## Development Guide

### Adding New Icons

1. Add your SVG to `src/svg/`:
   - Use kebab-case naming (e.g., `my-icon.svg`)
   - Keep SVGs simple and clean
   - Optimize SVGs if possible

2. Generate assets:
   ```bash
   yarn generate
   ```

3. Preview all icons locally:
   ```bash
   yarn preview
   open preview.html
   ```
   This regenerates the font and writes a standalone `preview.html` at the repo root that renders every icon (new/changed icons are highlighted at the top). `preview.html` is gitignored.

4. Test your icon in-app:
   ```tsx
   import { Icon } from '@schematichq/schematic-icons';

   <Icon name="my-icon" />
   ```

### Code Style

- Use TypeScript
- Follow existing code patterns
- Include JSDoc comments for public APIs

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/). Examples:

- `feat: add orb icon` — triggers a minor version bump
- `fix: correct stripe icon viewBox` — triggers a patch version bump
- `chore: bump dev dependencies` — does **not** trigger a release

`semantic-release` only cuts a release when it sees a commit prefixed with `fix:`, `feat:`, or containing `BREAKING CHANGE` since the last tag. Plain `chore:` commits and freeform titles are silently skipped — no publish will happen. When squash-merging a PR, make sure the squash title has a conventional prefix (GitHub defaults the squash title to the PR title, so keep PR titles conventional too).

## Releasing

Releases are fully automated. `.github/workflows/release.yml` runs on every push to `main` and invokes `semantic-release`, which bumps `package.json`, creates the git tag, publishes to npm, and creates the GitHub release.

**Do not create git tags or GitHub releases manually.** `semantic-release` owns both. If you tag `HEAD` yourself, `semantic-release` will see it as "already released" and skip publishing entirely — nothing will land on npm.

If a merge to `main` doesn't produce a release, the usual cause is that none of the new commits used a conventional prefix that triggers a bump (`fix:` / `feat:` / `BREAKING CHANGE`). Push a follow-up commit with the right prefix to unblock it.
