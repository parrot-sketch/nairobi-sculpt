# Nairobi Sculpt - Brand Identity System

## Executive Summary
Nairobi Sculpt is a premium aesthetic surgery center requiring a professional, trustworthy, and sophisticated clinical management system. The brand communicates expertise, care, and transformation through a carefully curated visual system.

---

## Brand Pillars

1. **Excellence** - Premium surgical expertise, state-of-the-art facilities
2. **Trust** - Clinical credibility, patient safety, HIPAA-grade security
3. **Transformation** - Personal confidence, aesthetic goals achieved
4. **Care** - Personalized approach, comprehensive aftercare support

---

## Color Palette

### Primary: Charcoal (`#2c2c2c`)
- **Usage**: Text, headings, dark backgrounds, primary UI elements
- **Psychology**: Trust, professionalism, medical authority
- **Applications**: Headlines, navigation bars, form labels
- **Contrast**: WCAG AAA compliant on light backgrounds

### Accent: Gold/Mustard (`#d4af37`)
- **Usage**: Call-to-action buttons, highlights, transformation indicators
- **Psychology**: Premium, luxury, transformation success
- **Applications**: Primary buttons, badges, progress indicators
- **Rules**: Never use on white background without careful consideration; use as accent only

### Secondary: Teal (`#2b8b9b`)
- **Usage**: Secondary actions, hover states, clinical indicators
- **Psychology**: Medical trust, clinical processes, data visualization
- **Applications**: Secondary buttons, links, chart colors
- **Rules**: Use sparingly; teal + gold creates visual tension (avoid together)

### Neutral: Gray Scale (`#f5f5f5` to `#171717`)
- **Usage**: UI elements, backgrounds, text hierarchy
- **Psychology**: Clarity, accessibility, professionalism
- **Applications**: Cards, backgrounds, borders, secondary text
- **Rules**: Minimum 5 shades for proper hierarchy

### Semantic Colors
- **Success** (`#10b981`): Appointment confirmed, payment received, system healthy
- **Warning** (`#f59e0b`): Overdue invoices, pending actions, alerts
- **Error** (`#ef4444`): Failed actions, critical issues
- **Info** (`#3b82f6`): Information, helpful hints, secondary alerts

---

## Typography

### Font Family: Inter (system fallback: -apple-system, BlinkMacSystemFont, Segoe UI)
- **Rationale**: Clean, modern, highly legible at all sizes; excellent medical/professional perception

### Type Hierarchy

| Role | Size | Weight | Usage |
|------|------|--------|-------|
| **H1** | 32-36px | 700 (Bold) | Page titles, major headings |
| **H2** | 24-28px | 600 (SemiBold) | Section headers, module titles |
| **H3** | 18-20px | 600 (SemiBold) | Subsection headers, card titles |
| **Body1** | 16px | 400 (Regular) | Primary body text, paragraphs |
| **Body2** | 14px | 400 (Regular) | Secondary body text, descriptions |
| **Label** | 12px | 600 (SemiBold) | Form labels, captions, badges |
| **Caption** | 12px | 400 (Regular) | Helper text, timestamps, metadata |

### Line Height
- **Headings**: 1.2 (tight for impact)
- **Body**: 1.6 (generous for readability)
- **Forms**: 1.5 (accessible)

### Letter Spacing
- **Headings**: -0.02em (tighter, more professional)
- **Body**: 0 (natural)
- **Labels**: 0.05em (subtle, scannable)

---

## Spacing System

### Base Unit: 4px
- Ensures consistency and alignment

### Spacing Scale
```
xs:  4px   (micro spacing)
sm:  8px   (small gaps)
md:  16px  (default padding/margin)
lg:  24px  (generous spacing)
xl:  32px  (large sections)
2xl: 48px  (major sections)
3xl: 64px  (page-level spacing)
```

### Application Rules
- **Cards**: 24px internal padding (lg)
- **Sections**: 32-48px vertical spacing (xl/2xl)
- **Page sections**: 48-64px margins top/bottom (2xl/3xl)
- **Forms**: 16px field spacing (md)
- **Between elements**: 8-16px (sm/md)

---

## Component Patterns

### Cards
- **Background**: White (`#ffffff`)
- **Border**: 1px solid neutral-200
- **Shadow**: 0 1px 3px rgba(0,0,0,0.1) on hover only
- **Border Radius**: 8px
- **Padding**: 24px (lg)

### Buttons

#### Primary (CTA)
- **Background**: accent-600 (`#c9a961`)
- **Text**: White
- **Padding**: 12px 24px (py-3 px-6)
- **Border Radius**: 8px
- **Weight**: Bold (600)
- **Hover**: accent-700
- **Disabled**: neutral-400

#### Secondary
- **Background**: neutral-100
- **Text**: primary-700
- **Border**: 1px solid neutral-300
- **Padding**: 12px 24px
- **Border Radius**: 8px
- **Hover**: neutral-200 background

### Form Fields
- **Border**: 1px solid neutral-300
- **Focus**: 2px solid accent-500 ring + transparent border
- **Padding**: 12px 16px
- **Border Radius**: 8px
- **Background**: White

### Tables (when used)
- **Header background**: neutral-100
- **Row padding**: 16px
- **Border**: 1px solid neutral-200 (between rows only)
- **Hover row**: neutral-50 background
- **Alternating rows**: NO (reduces scan efficiency)

---

## Voice & Tone

### Clinical Context
- **Terminology**: Use medical terms accurately (appointment, procedure, visit, prescription)
- **Clarity**: Write for non-medical staff; explain clinical terms
- **Confidence**: Convey expertise without condescension
- **Empathy**: Remember patient anxiety; tone should be calm, reassuring

### Writing Examples

#### ❌ Bad
"Error: Invalid data format"

#### ✅ Good
"Please enter a valid email address (e.g., doctor@nairobisculpt.com)"

#### ❌ Bad
"Your procedure is tomorrow"

#### ✅ Good
"Dr. Ken Aluora's breast augmentation consultation confirmed for tomorrow at 2:00 PM"

---

## Logo Usage

### Logo Asset
- **Format**: SVG (scalable, medical-grade) + PNG (fallback)
- **Location**: `/apps/web/public/branding/logo/`
- **Sizes Available**:
  - `logo-full.svg` - Full wordmark + icon
  - `logo-icon-only.svg` - Icon only (for favicons, avatars)
  - `logo-monochrome.svg` - Black version for print
  - `logo-white.svg` - White version for dark backgrounds

### Clear Space
- Minimum 20px around logo on all sides
- No text, images, or graphic elements within clear space

### Color Variations
- **Default**: Charcoal icon + Gold accent in text
- **Monochrome**: Charcoal only (print, grayscale contexts)
- **Inverse**: White (dark backgrounds only)
- **Accent**: Gold/accent only (limited use)

### Sizing
- **Minimum size**: 32px height (systems/UI)
- **Maximum size**: Screen-dependent (200px in headers)
- **Aspect ratio**: 1:1 (icon) or 3:1 (full wordmark) - maintain exactly

### Placement Rules
- **Header**: Left-aligned, 16px from edge
- **Favicon**: Icon only, 32x32px
- **Social media**: Full wordmark 1200x1200px
- **Print**: 2" minimum height

---

## Visual Patterns

### Data Visualization
- **Charts use**: accent-600 (primary series), secondary-600 (secondary), neutral-300 (disabled)
- **No rainbow charts** - too many colors reduce clinical credibility
- **Maximum 4 series** per chart
- **Tooltips**: Dark background, white text, rounded 4px

### Status Indicators
- **Success**: Green checkmark circle + "Completed"
- **Pending**: Yellow clock icon + "In Progress"
- **Requires Action**: Orange alert icon + "Action Needed"
- **Error**: Red X icon + "Error"

### Icons
- **Library**: Heroicons or Feather Icons (consistent stroke weight)
- **Size**: 20px (default), 24px (headers), 16px (inline)
- **Color**: Inherit text color (no custom icon colors)

---

## Accessibility Standards

- **Contrast**: WCAG AAA for all text (7:1 minimum on body, 4.5:1 on headings)
- **Focus states**: 3px colored ring (not just outline)
- **Color blindness**: No red/green only indicators (always include text/icon)
- **Motion**: Avoid auto-playing animations; support prefers-reduced-motion
- **Keyboard navigation**: All interactive elements keyboard accessible
- **Screen readers**: Semantic HTML, proper ARIA labels

---

## System Evolution

This document is a living guide. Updates require:
1. **Approval**: Lead Designer + Product Lead
2. **Documentation**: Updated in this file with rationale
3. **Communication**: Notified to all frontend developers
4. **Testing**: QA review on accessibility + desktop + mobile

---

## Files & Assets

```
/apps/web/
├── public/
│   └── branding/
│       ├── logo/
│       │   ├── logo-full.svg
│       │   ├── logo-icon-only.svg
│       │   ├── logo-monochrome.svg
│       │   └── logo-white.svg
│       ├── patterns/
│       │   └── gradient-bg.svg
│       └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Branding/
│   │   │   ├── Logo.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── ...
│   ├── styles/
│   │   └── branding.css
│   └── ...
```

---

## Contact & Questions

**Brand questions**: contact the design team
**System updates**: Submit PR with documentation
**Emergency changes**: Contact product lead directly
