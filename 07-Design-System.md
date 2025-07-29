# Design System: Rates & Inventory Management Platform
## Component Library & Design Tokens

**Version:** 2.0  
**Last Updated:** Phase 2 Implementation  
**Design Philosophy:** Modern, Clean, Data-Dense Without Overwhelming  

---

## 🎨 Design Tokens

### Color System
```scss
/**
 * Primary Brand Colors
 * Used for primary actions, navigation, and brand elements
 */
:root {
  /* Primary Colors */
  --color-primary-50: #EFF6FF;
  --color-primary-100: #DBEAFE;
  --color-primary-200: #BFDBFE;
  --color-primary-300: #93C5FD;
  --color-primary-400: #60A5FA;
  --color-primary-500: #2563EB;  /* Primary brand */
  --color-primary-600: #1D4ED8;
  --color-primary-700: #1E40AF;  /* Dark variant */
  --color-primary-800: #1E3A8A;
  --color-primary-900: #1E293B;

  /* Semantic Colors */
  --color-success-50: #ECFDF5;
  --color-success-500: #059669;  /* Success actions */
  --color-success-700: #047857;
  
  --color-warning-50: #FFFBEB;
  --color-warning-500: #D97706;  /* Warning states */
  --color-warning-700: #B45309;
  
  --color-danger-50: #FEF2F2;
  --color-danger-500: #DC2626;   /* Error states */
  --color-danger-700: #B91C1C;
  
  --color-info-50: #F0F9FF;
  --color-info-500: #0891B2;     /* Information */
  --color-info-700: #0E7490;

  /* Neutral Palette */
  --color-gray-50: #F9FAFB;      /* Page backgrounds */
  --color-gray-100: #F3F4F6;     /* Card backgrounds */
  --color-gray-200: #E5E7EB;     /* Borders, dividers */
  --color-gray-300: #D1D5DB;     /* Disabled states */
  --color-gray-400: #9CA3AF;     /* Placeholders */
  --color-gray-500: #6B7280;     /* Secondary text */
  --color-gray-600: #4B5563;     /* Body text */
  --color-gray-700: #374151;     /* Headings */
  --color-gray-800: #1F2937;     /* Dark text */
  --color-gray-900: #111827;     /* Titles, emphasis */
}
```

### Typography Scale
```scss
/**
 * Typography System
 * Inter font family optimized for data-dense interfaces
 */
:root {
  /* Font Families */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;

  /* Font Sizes (8px grid aligned) */
  --text-xs: 0.75rem;    /* 12px - Captions, labels */
  --text-sm: 0.875rem;   /* 14px - Body text */
  --text-base: 1rem;     /* 16px - Default body */
  --text-lg: 1.125rem;   /* 18px - Large body */
  --text-xl: 1.25rem;    /* 20px - Small headings */
  --text-2xl: 1.5rem;    /* 24px - Section headings */
  --text-3xl: 2rem;      /* 32px - Page titles */

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

### Spacing System
```scss
/**
 * Spacing Scale (8px grid system)
 * Consistent spacing for layouts and components
 */
:root {
  --space-0: 0;
  --space-1: 0.25rem;    /* 4px - Tight spacing */
  --space-2: 0.5rem;     /* 8px - Standard small */
  --space-3: 0.75rem;    /* 12px - Medium-small */
  --space-4: 1rem;       /* 16px - Standard medium */
  --space-5: 1.25rem;    /* 20px - Medium-large */
  --space-6: 1.5rem;     /* 24px - Large */
  --space-8: 2rem;       /* 32px - Extra large */
  --space-10: 2.5rem;    /* 40px - Section spacing */
  --space-12: 3rem;      /* 48px - Page spacing */
  --space-16: 4rem;      /* 64px - Major sections */
  --space-20: 5rem;      /* 80px - Layout spacing */
}
```

---

## 🧩 Core Components

### Grid Cell Component
```scss
/**
 * Rate/Inventory Grid Cell
 * Core component for calendar interface
 */
.grid-cell {
  position: relative;
  min-height: 36px;
  padding: var(--space-2);
  border: 1px solid var(--color-gray-200);
  background: var(--color-gray-50);
  font-size: var(--text-sm);
  transition: all 0.15s ease;
  cursor: pointer;

  /* Primary value display */
  .cell-primary {
    font-weight: var(--font-semibold);
    color: var(--color-gray-900);
    font-size: var(--text-base);
  }

  /* Secondary information */
  .cell-secondary {
    font-size: var(--text-xs);
    color: var(--color-gray-500);
    margin-top: var(--space-1);
  }

  /* AI recommendation overlay */
  .cell-ai-recommendation {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(90deg, var(--color-success-50) 0%, transparent 100%);
    border-top: 1px solid var(--color-success-200);
    padding: var(--space-1) var(--space-2);
    font-size: var(--text-xs);
    color: var(--color-success-700);
    
    .ai-icon {
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-right: var(--space-1);
    }
  }

  /* States */
  &:hover {
    border-color: var(--color-primary-300);
    box-shadow: 0 0 0 1px var(--color-primary-200);
  }

  &.selected {
    background: var(--color-primary-50);
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 2px var(--color-primary-200);
  }

  &.editing {
    background: var(--color-gray-50);
    border-color: var(--color-success-500);
    box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
  }

  /* Cell variants */
  &.cell-closed {
    background: var(--color-danger-50);
    border-color: var(--color-danger-200);
    color: var(--color-danger-700);
  }

  &.cell-limited {
    background: var(--color-warning-50);
    border-color: var(--color-warning-200);
  }

  &.cell-high-demand {
    background: var(--color-info-50);
    border-color: var(--color-info-200);
  }
}
```

### AI Recommendation Modal
```scss
/**
 * AI Explanation Modal
 * Detailed AI recommendation display
 */
.ai-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .modal-content {
    background: white;
    border-radius: 12px;
    padding: var(--space-6);
    max-width: 600px;
    width: 90vw;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

    .modal-header {
      display: flex;
      align-items: center;
      margin-bottom: var(--space-6);
      
      .ai-icon {
        width: 24px;
        height: 24px;
        margin-right: var(--space-3);
      }

      h2 {
        font-size: var(--text-xl);
        font-weight: var(--font-semibold);
        color: var(--color-gray-900);
      }
    }

    .recommendation-summary {
      background: var(--color-gray-50);
      border-radius: 8px;
      padding: var(--space-4);
      margin-bottom: var(--space-6);
      text-align: center;

      .current-rate {
        font-size: var(--text-lg);
        color: var(--color-gray-600);
      }

      .suggested-rate {
        font-size: var(--text-2xl);
        font-weight: var(--font-bold);
        color: var(--color-success-600);
        margin: var(--space-2) 0;
      }

      .percentage-change {
        color: var(--color-success-600);
        font-weight: var(--font-medium);
      }
    }

    .impact-forecast {
      margin-bottom: var(--space-6);

      h3 {
        font-size: var(--text-lg);
        font-weight: var(--font-semibold);
        margin-bottom: var(--space-3);
        color: var(--color-gray-900);
      }

      .metric-row {
        display: flex;
        justify-content: space-between;
        padding: var(--space-2) 0;
        border-bottom: 1px solid var(--color-gray-100);

        .metric-label {
          color: var(--color-gray-600);
        }

        .metric-value {
          font-weight: var(--font-medium);
          color: var(--color-gray-900);
        }

        .metric-change {
          margin-left: var(--space-2);
          font-size: var(--text-sm);

          &.positive {
            color: var(--color-success-600);
          }

          &.negative {
            color: var(--color-danger-600);
          }
        }
      }
    }

    .key-factors {
      margin-bottom: var(--space-6);

      .factor-list {
        list-style: none;
        padding: 0;

        .factor-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: var(--space-2);

          .factor-icon {
            width: 16px;
            height: 16px;
            margin-right: var(--space-2);
            margin-top: 2px;
            color: var(--color-info-500);
          }

          .factor-text {
            color: var(--color-gray-700);
            line-height: var(--leading-snug);
          }
        }
      }
    }

    .modal-actions {
      display: flex;
      gap: var(--space-3);
      justify-content: flex-end;
      margin-top: var(--space-6);
      padding-top: var(--space-4);
      border-top: 1px solid var(--color-gray-200);
    }
  }
}
```

### Bulk Operations Panel
```scss
/**
 * Bulk Operations Panel
 * Slides in from right for multi-cell editing
 */
.bulk-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 380px;
  background: white;
  box-shadow: -4px 0 24px -4px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 900;

  &.active {
    transform: translateX(0);
  }

  .panel-header {
    padding: var(--space-4);
    border-bottom: 1px solid var(--color-gray-200);
    background: var(--color-gray-50);

    .panel-title {
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--color-gray-900);
      margin-bottom: var(--space-2);
    }

    .selection-count {
      font-size: var(--text-sm);
      color: var(--color-gray-600);
    }
  }

  .panel-content {
    padding: var(--space-4);
    height: calc(100vh - 140px);
    overflow-y: auto;

    .operation-section {
      margin-bottom: var(--space-6);

      .section-title {
        font-size: var(--text-base);
        font-weight: var(--font-medium);
        color: var(--color-gray-900);
        margin-bottom: var(--space-3);
      }

      .operation-row {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        margin-bottom: var(--space-3);

        .operation-input {
          flex: 1;
          padding: var(--space-2);
          border: 1px solid var(--color-gray-300);
          border-radius: 6px;
          font-size: var(--text-sm);

          &:focus {
            outline: none;
            border-color: var(--color-primary-500);
            box-shadow: 0 0 0 2px var(--color-primary-100);
          }
        }

        .apply-button {
          padding: var(--space-2) var(--space-3);
          background: var(--color-primary-500);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          cursor: pointer;
          transition: background 0.15s ease;

          &:hover {
            background: var(--color-primary-600);
          }
        }
      }
    }
  }

  .panel-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--space-4);
    background: white;
    border-top: 1px solid var(--color-gray-200);

    .actions-row {
      display: flex;
      gap: var(--space-3);

      .preview-button {
        flex: 1;
        padding: var(--space-3);
        background: var(--color-gray-100);
        color: var(--color-gray-700);
        border: 1px solid var(--color-gray-300);
        border-radius: 8px;
        font-weight: var(--font-medium);
        cursor: pointer;
        transition: all 0.15s ease;

        &:hover {
          background: var(--color-gray-200);
        }
      }

      .execute-button {
        flex: 1;
        padding: var(--space-3);
        background: var(--color-success-500);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: var(--font-medium);
        cursor: pointer;
        transition: background 0.15s ease;

        &:hover {
          background: var(--color-success-600);
        }

        &:disabled {
          background: var(--color-gray-300);
          cursor: not-allowed;
        }
      }
    }
  }
}
```

---

## 📱 Responsive Components

### Mobile Grid Cell
```scss
/**
 * Mobile-optimized grid cell
 */
@media (max-width: 768px) {
  .grid-cell {
    min-height: 44px; /* Touch-friendly minimum */
    padding: var(--space-3);
    
    .cell-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .cell-primary {
      font-size: var(--text-lg);
    }

    .cell-ai-recommendation {
      position: relative;
      margin-top: var(--space-2);
      border-radius: 4px;
    }
  }
}
```

---

## 🎭 Animation & Interactions

### Micro-interactions
```scss
/**
 * Smooth transitions and micro-interactions
 */
.fade-in {
  animation: fadeIn 0.2s ease-out;
}

.slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

.pulse-success {
  animation: pulseSuccess 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes pulseSuccess {
  0% {
    box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(5, 150, 105, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(5, 150, 105, 0);
  }
}
```

---

## ♿ Accessibility Features

### Focus Management
```scss
/**
 * Accessible focus indicators and keyboard navigation
 */
.focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .grid-cell {
    border-width: 2px;
  }
  
  .grid-cell:hover {
    border-width: 3px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🧪 Component Testing

### Test Coverage Requirements
- **Visual Regression Testing:** Chromatic for all component states
- **Accessibility Testing:** axe-core integration
- **Interaction Testing:** Cypress for keyboard navigation
- **Performance Testing:** Lighthouse scores >90
- **Browser Testing:** Chrome, Safari, Firefox, Edge latest versions

### Component Documentation
Each component includes:
- **Props interface** with TypeScript definitions
- **Usage examples** in multiple contexts
- **Accessibility guidelines** and ARIA patterns
- **Performance considerations** and optimization tips
- **Design rationale** and UX best practices

---

**Design System Status:**
- ✅ **Color tokens** - Complete
- ✅ **Typography scale** - Complete  
- ✅ **Spacing system** - Complete
- ✅ **Grid cell component** - Complete
- ✅ **Modal components** - Complete
- ✅ **Responsive design** - Complete
- ✅ **Accessibility features** - Complete
- 🔄 **Icon library** - In progress
- 🔄 **Form components** - Next phase 