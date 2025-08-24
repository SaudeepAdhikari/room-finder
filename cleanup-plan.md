# Room Finder - Codebase Cleanup and Organization Plan

## 1. Remove Unnecessary Files

### Duplicate Files

- `src/components/AdvancedSearchFilter.js.new` - Remove this backup file
- Remove duplicate CSS files in `src/components` like `SearchLayoutFix.css` vs `ExactSearchLayoutFix.css`

### Testing/Debug Files

- `test-api-server.js` - Remove if not needed
- `test-admin-api.js` in backend folder
- `test-admin-auth.js` in backend folder
- `test-cloudinary.js` in backend folder
- `test-connection.js` in backend folder
- `src/EnvTest.js` - Remove if not needed

### Batch Files

- Consolidate batch files (`fix_search_dropdowns.bat`, `fix_search_layout_complete.bat`, etc.) into a single development script or npm command

### Old Backups

- Remove or archive the `_backup` folder which contains old versions

## 2. Clean Up Code

### Remove Console Logs

- Remove all `console.log` statements from production code
- Focus on `src/api.js` which has many console logs
- Clean up logs in form components

### Remove Unused Variables & Imports

- Check all components for unused imports and variables

### Remove Commented Out Code

- Look for commented out code blocks that are no longer needed

## 3. Reorganize Project Structure

### Frontend Organization

- Move all pages to the `src/pages` directory
- Group related components into subdirectories within `src/components`
- Reorganize duplicate components (there are multiple search components)

### Consolidate CSS Files

- Move all CSS files to their respective component folders
- Standardize CSS naming conventions

### Component Renaming for Clarity

- Rename confusing or duplicate components for clarity
- Standardize naming conventions (e.g., ModernNavbar vs UniversalNavbar)

## 4. Streamline Duplicate Components

### Merge Similar Components

- `HomePage.js` in src root and in pages directory
- Multiple navbar components that should be consolidated
- Search components that can be consolidated

### Standardize Patterns

- Create a consistent approach for forms
- Standardize on a single styling approach (CSS modules, styled components, or direct CSS)

## 5. Documentation Updates

### Add README Files

- Update main README.md with project structure
- Add component-specific documentation
- Document the project architecture

### Codebase Navigation Guide

- Create a guide explaining where to find key functionality
- Document the folder structure and naming conventions

## 6. Final Steps

### Testing After Changes

- Ensure all routes still work
- Test key functionality
- Verify imports are still working

### Update Package.json

- Remove unused dependencies
- Add useful scripts for development
