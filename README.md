# Schematic Icons

A React component library for displaying Schematic icons. Built with TypeScript and modern CSS, providing type-safe icon usage.

[![npm version](https://img.shields.io/npm/v/schematic-icons.svg)](https://www.npmjs.com/package/schematic-icons)
[![License](https://img.shields.io/npm/l/schematic-icons.svg)](https://github.com/SchematicHQ/schematic-icons/blob/main/LICENSE)

## Features

- 🎨 100+ carefully crafted icons
- 🔒 TypeScript support with type-safe icon names
- ⚡️ Zero configuration required
- 🎯 Tree-shakeable
- 🎭 Customizable through CSS classes and styles
- 📦 Lightweight with minimal dependencies

## Installation

```bash
yarn add schematic-icons
```

## Quick Start

```tsx
import { Icon } from 'schematic-icons';

function MyComponent() {
  return (
    <div>
      <Icon name="check" />
      <Icon name="close" className="text-red" />
      <Icon name="arrow-right" style={{ color: 'blue' }} />
    </div>
  );
}
```

## Usage

### React Component

The `Icon` component is the main way to use Schematic icons in your React application:

```tsx
import { Icon } from 'schematic-icons';

function MyComponent() {
  return (
    <div>
      <Icon name="check" /> {/* Will error if 'check' is not a valid icon */}
      <Icon name="close" className="text-red" />
      <Icon name="arrow-right" style={{ color: 'blue' }} />
    </div>
  );
}
```

### Props

The `Icon` component accepts the following props:

```typescript
interface IconProps {
  /** The name of the icon to display */
  name: IconNames;
  /** Additional CSS classes to apply to the icon */
  className?: string;
  /** Additional CSS styles to apply to the icon */
  style?: React.CSSProperties;
}
```

### TypeScript Support

The package provides full TypeScript support with type-safe icon names:

```typescript
import { IconNames } from 'schematic-icons';

// Type-safe icon names
const iconName: IconNames = 'check'; // Will error if 'check' is not a valid icon
```

### Available Icons

The package includes a comprehensive set of 100+ icons. Here are some examples:

- `check` - Checkmark icon
- `close` - Close/X icon
- `arrow-right` - Right arrow
- `heart` - Heart icon
- `search` - Search/magnifying glass
- `menu` - Menu/hamburger icon

For a complete list of available icons, check the [IconNames type](https://github.com/SchematicHQ/schematic-icons/blob/main/src/types.ts).

## API Reference

### Exports

The package exports the following:

```typescript
// React Component
export { Icon } from 'schematic-icons';

// Types
export type { IconProps } from 'schematic-icons';
export type { IconNames } from 'schematic-icons';

// Utilities
export { iconsList } from 'schematic-icons';
```

### Types

- `IconNames`: A union type of all available icon names
- `IconProps`: The props interface for the Icon component
- `iconsList`: An array of all available icon names

## Development

1. Clone the repository:
   ```bash
   git clone https://github.com/SchematicHQ/schematic-icons.git
   cd schematic-icons
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

### Available Commands

The following yarn commands are available:

```bash
# Build the project (generates icons and compiles TypeScript)
yarn build

# Clean build artifacts and generated files
yarn clean

# Generate icon fonts and type definitions
yarn generate

# Run a complete build (clean, generate, and build)
yarn build:all

# Run ESLint on TypeScript files
yarn lint

# Prepare the package for publishing (runs build)
yarn prepare
```
