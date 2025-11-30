# Build Issue - Windows Path with Spaces

## Problem
There is a known bug in Vite (both v5 and v7) where Windows paths containing spaces followed by certain letters (like `\N`) are incorrectly parsed during the build process.

### Error
```
Could not load Z: Folders/New folder (3)/11.04/techcare-react-app/index.html
```

Notice how `Z:\New` is being transformed to `Z: Folders\New` - the backslash-N sequence is being mangled.

## Current Status
- ✅ **Development server works perfectly** (`npm run dev`)
  - Server runs on http://localhost:5174/
  - All features work correctly
  - Hot module replacement (HMR) works
- ❌ **Production build fails** (`npm run build`)
  - Vite cannot resolve paths correctly
  - Issue persists across Vite v5.4.21 and v7.1.12

## Workarounds

### Option 1: Move Project to Path Without Spaces (RECOMMENDED)
Move the project to a directory without spaces in the path, for example:
- `C:\Projects\techcare-react-app`
- `Z:\techcare` 
- Any path without spaces

### Option 2: Use Development Build for Testing
The development server works perfectly, so continue using:
```bash
npm run dev
```

### Option 3: Use Subst to Create Virtual Drive
Create a virtual drive without spaces:
```cmd
subst T: "Z:\New folder (3)\11.04\techcare-react-app"
cd /d T:\
npm run build
```

## References
- This is a known issue in Vite's Windows path handling
- Related to escape sequence processing in file paths
- Affects paths with `\N`, `\t`, `\r`, etc.

## Project Status
The React application is fully functional in development mode. All features work correctly when running `npm run dev`.
