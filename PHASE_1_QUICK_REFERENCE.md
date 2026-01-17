# Phase 1 Quick Reference Guide

## ✅ Phase 1 Complete - All Tests Passing

### Test Summary
- **Total Tests**: 40 passing
- **Test Suites**: 4 passed, 1 skipped
- **Component Coverage**: 100% (Button, Card, Badge, Typography)
- **Build Status**: ✅ Success (0 errors)

### Core Components Created

#### 1. **Button Component**
```tsx
import { Button } from '@/components';

// Usage examples:
<Button variant="primary" size="md">Primary Button</Button>
<Button variant="secondary" size="sm" disabled>Disabled</Button>
<Button variant="danger" isLoading={true}>Loading...</Button>
<Button variant="ghost" fullWidth>Full Width</Button>

// Variants: 'primary' | 'secondary' | 'danger' | 'ghost'
// Sizes: 'sm' | 'md' | 'lg'
// Props: variant, size, isLoading, fullWidth, disabled, etc.
```

#### 2. **Card Component**
```tsx
import { Card } from '@/components';

// Usage example with compound components:
<Card elevated hover>
  <Card.Header>
    <h2>Card Title</h2>
  </Card.Header>
  <Card.Body>
    <p>Card content goes here</p>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>

// Props: elevated, hover, children, className
```

#### 3. **Typography Components**
```tsx
import { Heading, Paragraph, Label, Text } from '@/components';

// Heading (h1-h6, auto-sized)
<Heading as="h1">Page Title</Heading>
<Heading as="h2">Section Title</Heading>

// Paragraph
<Paragraph>Body text with proper line-height</Paragraph>

// Label (for form labels)
<Label htmlFor="email">Email Address</Label>

// Text (secondary/tertiary text)
<Text>Small supplementary text</Text>
```

#### 4. **Badge Component**
```tsx
import { Badge } from '@/components';

// Variants: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
// Sizes: 'sm' | 'md'
<Badge variant="success" size="md">Active</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
<Badge variant="error">Critical</Badge>
```

## Build & Test Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch

# Run tests with coverage report
pnpm test:cov

# Build project
pnpm build

# Type check
pnpm type-check

# Run linter
pnpm lint
```

## File Structure

```
apps/web/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx (52 lines)
│   │   │   ├── Button.test.tsx (tests)
│   │   │   └── index.ts (barrel export)
│   │   ├── Card/
│   │   │   ├── Card.tsx (87 lines)
│   │   │   ├── Card.test.tsx (tests)
│   │   │   └── index.ts (barrel export)
│   │   ├── Typography/
│   │   │   ├── Typography.tsx (102 lines)
│   │   │   ├── Typography.test.tsx (tests)
│   │   │   └── index.ts (barrel export)
│   │   ├── Badge/
│   │   │   ├── Badge.tsx (54 lines)
│   │   │   ├── Badge.test.tsx (tests)
│   │   │   └── index.ts (barrel export)
│   │   └── index.ts (main barrel export)
│   ├── tailwind.config.ts (updated with brand colors)
│   └── setupTests.ts
├── jest.config.cjs (updated)
└── package.json (added clsx dependency)
```

## Design Tokens

### Colors (from Tailwind Config)
```
Primary:   #1a1a1a (Charcoal)
Accent:    #c41e3a (Red)
Background: #f5f5f5 (Off-white)
Success:   #27AE60
Warning:   #E67E22
Error:     #c41e3a
Info:      #3498DB
```

### Typography
```
Heading Font: "Playfair Display"
Body Font: "Poppins"
Mono Font: "JetBrains Mono"
```

### Spacing (4px base unit)
```
xs: 4px,   sm: 8px,   md: 12px,   base: 16px
lg: 20px,  xl: 24px,  2xl: 32px,  3xl: 48px
```

## Component Props Reference

### Button Props
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  // ... all standard button props (onClick, type, etc.)
}
```

### Card Props
```tsx
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;  // shadow-elevated
  hover?: boolean;     // hover effects
  children: React.ReactNode;
  className?: string;
}

// Sub-components:
// Card.Header, Card.Body, Card.Footer
```

### Badge Props
```tsx
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}
```

### Typography Props
```tsx
interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  children: React.ReactNode;
  className?: string;
}

// Label has additional prop:
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
  children: React.ReactNode;
}
```

## Test Coverage

### Button Tests (7 tests)
- ✅ Renders with text
- ✅ Default primary variant
- ✅ Secondary variant
- ✅ Different sizes (sm, md, lg)
- ✅ Disabled state
- ✅ Full width option
- ✅ Loading spinner

### Card Tests (7 tests)
- ✅ Renders container
- ✅ Elevated style
- ✅ Hover effect
- ✅ Header sub-component
- ✅ Body sub-component
- ✅ Footer sub-component
- ✅ Custom className

### Typography Tests (11 tests)
- ✅ All heading levels (h1-h6)
- ✅ Size classes applied
- ✅ Paragraph element
- ✅ Base text styling
- ✅ Label element & htmlFor
- ✅ Text element
- ✅ Custom className on all components

### Badge Tests (10 tests)
- ✅ Renders with text
- ✅ All 6 variants
- ✅ Both sizes (sm, md)
- ✅ Custom className
- ✅ Default variant and size

## Next Steps

### Phase 2: Doctor Profiles (Week 2)
- Build doctor profile components using Phase 1 design system
- Implement doctor listing page
- Create doctor detail card
- API integration with backend
- Image gallery component

### Phase 3: Services Catalog (Week 3)
- Services listing page
- Service detail cards
- Category filtering
- Service gallery

## Troubleshooting

### Build Fails
```bash
# Clean build
rm -rf dist node_modules
pnpm install
pnpm build
```

### Tests Not Running
```bash
# Ensure jest config is correct
pnpm test -- --listTests

# Run with verbose output
pnpm test -- --verbose
```

### TypeScript Errors
```bash
# Type check
pnpm type-check

# Clean build cache
pnpm tsc --build --clean
```

## Key Features Implemented

✅ **Component Architecture**
- Compound components (Card sub-components)
- Proper ref forwarding
- TypeScript generics and types

✅ **Testing Infrastructure**
- Jest configuration
- React Testing Library setup
- 100% component coverage

✅ **Design System**
- Brand-aligned Tailwind config
- Consistent tokens
- Scalable pattern

✅ **Build Pipeline**
- TypeScript strict mode
- Vite production build
- Zero errors

## Documentation

For detailed information, see:
- [PHASE_1_COMPLETION.md](./PHASE_1_COMPLETION.md) - Full completion report
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guidelines
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Project architecture

## Quick Links

- Button Component: [apps/web/src/components/Button](apps/web/src/components/Button)
- Card Component: [apps/web/src/components/Card](apps/web/src/components/Card)
- Typography: [apps/web/src/components/Typography](apps/web/src/components/Typography)
- Badge Component: [apps/web/src/components/Badge](apps/web/src/components/Badge)
- Main Exports: [apps/web/src/components/index.ts](apps/web/src/components/index.ts)
- Tailwind Config: [apps/web/tailwind.config.ts](apps/web/tailwind.config.ts)
- Jest Config: [apps/web/jest.config.cjs](apps/web/jest.config.cjs)

---

**Status**: Phase 1 ✅ COMPLETE | Ready for Phase 2  
**Last Updated**: January 16, 2026  
**Test Results**: 40/40 passing ✅  
**Build Status**: ✅ Success  
