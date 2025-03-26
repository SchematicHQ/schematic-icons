# Schematic Icons

A TypeScript library for generating icon fonts from SVG files. Built on top of Fantasticon with improved TypeScript support, modern CSS generation, and a framework-agnostic React component.

## Installation

```bash
yarn add schematic-icons
```

## Usage

### Font Generation

```typescript
import { generateIconFont } from 'schematic-icons';

await generateIconFont({
  // Required options
  name: 'MyIcons',           // Name of the generated font
  inputDir: './svg',         // Directory containing SVG files
  outputDir: './dist',       // Output directory for the generated font

  // Optional options with defaults
  fontTypes: ['ttf'],        // Font types to generate
  assetTypes: ['css', 'json'], // Asset types to generate
  prefix: 'icon',            // CSS class prefix
  tag: 'i',                  // HTML tag to use
  descent: 0,                // Font descent
  normalize: true            // Normalize icon sizes
});
```

### React Component

```tsx
import { Icon } from 'schematic-icons';

// Type-safe icon usage
function MyComponent() {
  return (
    <div>
      <Icon name="menu" /> {/* Will error if 'menu' is not a valid icon */}
      <Icon name="close" className="text-red" />
    </div>
  );
}
```

### Generated Files

For the above configuration, the following files will be generated:
- `dist/MyIcons.ttf` - The font file
- `dist/MyIcons.css` - CSS with classes and font-face declaration
- `dist/MyIcons.json` - JSON mapping of icon names to codepoints
- `dist/MyIcons.d.ts` - TypeScript type definitions for icon names

### CSS Usage

```html
<!-- Include the generated CSS -->
<link rel="stylesheet" href="dist/MyIcons.css">

<!-- Use icons -->
<i class="icon-example"></i>

<!-- Use as placeholder -->
<div class="%icon-example"></div>
```

### TypeScript Support

The package provides full TypeScript support with type-safe icon names:

```typescript
import { IconName, IconClass } from 'schematic-icons';

// Type-safe icon names
const iconName: IconName = 'example'; // Will error if 'example' is not a valid icon
const className: IconClass = 'icon-example'; // Will error if 'example' is not a valid icon

// Runtime type checking
import { isValidIconName } from './dist/MyIcons';

if (isValidIconName(someString)) {
  // someString is now type-narrowed to IconName
  console.log(`Valid icon: ${someString}`);
}
```

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
4. Run tests:
   ```bash
   yarn test
   ```

## License

MIT 