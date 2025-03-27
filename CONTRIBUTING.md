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

3. Test your icon:
   ```tsx
   import { Icon } from '@schematichq/schematic-icons';
   
   <Icon name="my-icon" />
   ```

### Code Style

- Use TypeScript
- Follow existing code patterns
- Include JSDoc comments for public APIs

### Commit Messages

Use conventional commits:
