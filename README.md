# Schematic Icons

A React component library for displaying Schematic icons. Built with TypeScript and modern CSS, providing type-safe icon usage.

## Installation

```bash
yarn add schematic-icons
```

## Usage

### React Component

```tsx
import { Icon } from 'schematic-icons';

// Type-safe icon usage
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

### CSS Import

```tsx
// Import the CSS in your app's entry point
import 'schematic-icons/style.css';
```

### TypeScript Support

The package provides full TypeScript support with type-safe icon names:

```typescript
import { IconNames } from 'schematic-icons';

// Type-safe icon names
const iconName: IconNames = 'check'; // Will error if 'check' is not a valid icon
```

### Available Icons

The package includes a comprehensive set of icons. Here are some examples:

- `check` - Checkmark icon
- `close` - Close/X icon
- `arrow-right` - Right arrow
- `heart` - Heart icon
- `search` - Search/magnifying glass
- `menu` - Menu/hamburger icon

For a complete list of available icons, check the [IconNames type](src/types.ts).

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

### Icon Component Props

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

### Types

- `IconNames`: A union type of all available icon names
- `IconProps`: The props interface for the Icon component
- `iconsList`: An array of all available icon names

## Development

1. Clone the repository
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

## License

MIT 