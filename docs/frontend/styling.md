# Styling

## Overview

The frontend uses a modern styling approach combining utility-first CSS with component-based design systems.

## Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/) provides utility classes for rapid UI development:

- **Utility-First**: Classes like `bg-blue-500`, `p-4`, `flex`
- **Responsive**: Breakpoints like `md:`, `lg:`
- **Dark Mode**: `dark:` prefix for theme switching
- **Customization**: Configured in `tailwind.config.js`

### Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom colors
      }
    }
  }
}
```

## CSS Architecture

### Global Styles

- `src/index.css`: Base styles and Tailwind imports
- `src/styles.css`: Custom global styles
- `src/colors.css`: CSS custom properties for theming

### Component Styles

- Inline Tailwind classes for simple styling
- CSS modules for complex component-specific styles
- CSS-in-JS avoided in favor of utility classes

## Design System

### Colour Palette

Defined in `src/colors.css`:

```css
:root {
  --primary: #3b82f6;
  --secondary: #64748b;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
}
```

### Typography

- Inter font family
- Consistent text sizes and weights
- Line heights for readability

### Spacing

- 4px base unit (0.25rem)
- Consistent margins and padding
- Tailwind spacing scale

## Theming

### Light/Dark Mode

- CSS custom properties for theme variables
- `prefers-color-scheme` media query
- Manual theme toggle (future feature)

### Component Variants

Using `class-variance-authority` for component styling variants:

```typescript
const buttonVariants = cva('inline-flex items-center justify-center', {
  variants: {
    variant: {
      primary: 'bg-primary text-white',
      secondary: 'bg-secondary text-gray-900'
    },
    size: {
      sm: 'h-8 px-3',
      lg: 'h-12 px-6'
    }
  }
})
```

## Best Practices

- Prefer Tailwind utilities over custom CSS
- Use design tokens for consistency
- Test styling across different screen sizes
- Ensure accessibility (color contrast, focus states)
- Avoid deep nesting in CSS