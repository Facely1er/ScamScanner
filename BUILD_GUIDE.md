# Build Guide

This project runs as a fully functional web app in all build modes.

## Default Commands

- **Development**: `npm run dev`
- **Production build**: `npm run build`
- **Preview**: `npm run preview`
- **Output directory**: `dist/`

## Development

### Start Local Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## How It Works

Feature-gating logic has been removed. The app always exposes guided scans and all analysis tools in normal web usage.

## Usage Limits

- Tool access is always enabled.
- Compatibility wrappers remain in place so existing components keep working without paywall enforcement.
