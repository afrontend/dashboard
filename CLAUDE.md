# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based bookmark dashboard application written in TypeScript that displays bookmarks from local JSON files or allows manual JSON input. The app uses Parcel as the build tool and includes both Pico CSS and Tailwind CSS for styling.

## Development Commands

- **Development server**: `npm run serve` - Starts Parcel dev server, then copies JSON files to dist
- **Build for production**: `npm run build` - Builds the app to `dist/` directory
- **Watch mode**: `npm run watch` - Watches files for changes without serving
- **Type checking**: `npm run typecheck` - Runs TypeScript compiler without emitting files
- **Linting**: `npm run lint` - Runs ESLint on all TypeScript source directories
- **Fix linting**: `npm run lint:fix` - Auto-fixes ESLint issues
- **Deploy**: `npm run deploy` - Deploys to GitHub Pages via `gh-pages`

## Important Development Notes

- **Data Format Migration**: The README.md shows old object format `{"name": "...", "link": "..."}`, but the current implementation uses tuple format `[string, string]` where first element is display name and second is URL
- **Always run type checking and linting** after making changes to ensure code quality
- **JSON files are cached**: Development server uses cache-busting query parameters when fetching JSON files

## Project Architecture

### Data Sources
The application supports two modes for displaying bookmarks:
- **File mode**: Loads bookmarks from JSON files in `json/` directory (`dashboard.json`)
- **Manual mode**: Allows direct JSON input via textarea with live validation

Additional JSON files supported:
- **text.json**: Contains copyable text items with `{"content": "text"}` format (handled by TextForCopy component)

### Component Structure
- **App.tsx**: Main application component with toggle switch for data source modes
- **BookmarksInFile.tsx**: Fetches and displays data from JSON files with error handling and loading states
- **BookmarksInURL.tsx**: Provides textarea for manual JSON input with live preview and validation
- **BookmarkJsonData.tsx**: Core component for rendering bookmark lists (used by both modes) - simple rendering component without keyboard navigation
- **ErrorBoundary.tsx**: React error boundary component for graceful error handling with reload functionality
- **TextForCopy.tsx**: Component for displaying copyable text items from `text.json` (currently commented out in App.tsx)
- **useLocalFileFlag.tsx**: Custom hook managing localStorage-persisted mode switching

### Component Composition Pattern
The architecture uses a shared `BookmarkJsonData` component that both `BookmarksInFile` and `BookmarksInURL` components use for rendering. This ensures consistent bookmark display regardless of data source.

### Data Format
Bookmark data uses array format: `[string, string]` where first element is display name and second is URL:
```json
[
  ["Display Name", "https://example.com"],
  ["🌤 Daily", ""],
  ["Another Link", "https://another.com"]
]
```

### Styling
- Uses both Pico CSS (via CDN) and Tailwind CSS (via browser CDN version)
- Components use Tailwind utility classes for layout and styling
- Custom styles defined in `index.html` for link decoration removal

### Build System
- **Parcel 2.8.3**: Main build tool and dev server with TypeScript support
- **TypeScript**: Configured with strict type checking and React JSX support
- **ESLint**: Configured with TypeScript and React plugins for code quality
- Supports hot reloading and automatic dependency resolution
- JSON files are copied to `dist/` during build process

### Type Definitions
All components use TypeScript with consistent type definitions:
- `Bookmark`: Defined as `[string, string]` tuple type
- Component props are strictly typed with optional properties marked appropriately
- Custom hooks return properly typed objects

### Utilities
- `utils.ts`: Contains JSON validation and data parsing utilities
- `getJsonData()`: Parses URL parameters for bookmark data
- `isJSON()`: Validates JSON strings

## Setup Instructions

To set up the project for development:
1. Install dependencies: `yarn install` or `npm install`
2. Create `json/` directory if it doesn't exist
3. Add sample JSON files using correct tuple format:
   ```bash
   echo '[["Google", "https://google.com"], ["🌤 Daily", ""]]' > json/dashboard.json
   ```
4. Run development server: `npm run serve`

## Configuration Files

### TypeScript (`tsconfig.json`)
- Target: ES2020 with DOM libraries  
- Strict mode enabled with React JSX support
- Includes: `src/`, `components/`, `hooks/`, `js/` directories

### ESLint (`eslint.config.mjs`)
- TypeScript and React plugins enabled
- Custom rules: disabled prop-types, error on unused vars
- Ignores: `dist/`, `build/`, `node_modules/`

### Build Process
- **Entry Point**: `src/index.tsx` renders React app to DOM
- **Hot Reloading**: Automatic via Parcel with dependency resolution
- **Asset Copying**: JSON files copied to `dist/` during build
- **Cache Busting**: Development mode uses timestamps for JSON requests