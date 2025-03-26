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

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Build the project:
   ```bash
   yarn build
   ```

## License

MIT 