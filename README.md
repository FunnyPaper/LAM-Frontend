# LAM Frontend

Reusable React UI component library for LAM, built with Material-UI, Vite, and TypeScript.

## Badges

[![GitHub License](https://img.shields.io/github/license/FunnyPaper/LAM)](https://github.com/FunnyPaper/LAM/blob/main/LICENSE)

## Description

The LAM Frontend package is a distributable React component library that provides reusable UI components, hooks, and utilities for building the LAM application interface. It leverages Material-UI for design system components, Zustand for state management, and React Flow for graph/flow visualization.

## Project Structure

```
packages/lam/frontend/
├── src/                    # Source files
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Zustand state stores
│   └── index.tsx           # Library entry point
├── dist/                   # Built output (CJS, ESM, types)
├── package.json            # npm dependencies and exports
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── eslint.config.js        # ESLint configuration
```

## Prerequisites

- [Node.js](https://nodejs.org/) 24.x or later
- [npm](https://www.npmjs.com/) 9.x or later

## Setup

```bash
# Install dependencies
npm install

# Link to workspace (if used as workspace dependency)
npm link
```

## Available Modes & Scripts

### Development

```bash
# Start Vite dev server with hot module replacement
npm run dev
```

### Production Build

```bash
# Build the library (CJS, ESM, and TypeScript declarations)
npm run build

# Preview the built library
npm run preview
```

### Code Quality

```bash
# Run ESLint
npm run lint
```

## Package Exports

This package exports as both ESM and CJS:

```json
{
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js",
    "require": "./dist/index.cjs"
  }
}
```

## Dependencies

| Dependency | Type | Version |
|-----------|------|---------|
| react / react-dom | peer | 19.2.x |
| @mui/material | peer | 7.3.x |
| @monaco-editor/react | runtime | 4.7.x |
| @xyflow/react | runtime | 12.10.x |
| zustand | runtime | 5.0.x |
| react-hook-form | runtime | 7.71.x |
| date-fns | runtime | 4.1.x |
| use-debounce | runtime | 10.1.x |
| sass | runtime | 1.97.x |
| vite | dev | 7.2.x |
| typescript | dev | 5.9.x |

## License

[MIT License](../../LICENSE)