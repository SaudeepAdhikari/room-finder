/**
 * fix_imports.js - Fix and standardize imports across the project
 * 
 * This script:
 * 1. Scans project files for inconsistent imports
 * 2. Converts relative imports to more maintainable paths
 * 3. Sorts and organizes imports according to best practices
 */

const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.join(__dirname);
const srcDir = path.join(rootDir, 'src');
const fileExtensions = ['.js', '.jsx'];
const ignoreDirs = ['node_modules', 'build', '.git'];

// Track results
const updatedFiles = [];
const importIssues = [];

// Import patterns to check and fix
const importPatterns = [
  // Find deeply nested relative imports like "../../../components/SomeComponent"
  {
    pattern: /import\s+(\{[^}]+\}|[A-Za-z0-9_$]+)\s+from\s+['"]\.\.\/\.\.\/\.\.\/([^'"]+)['"]/g,
    replacement: (match, importName, importPath) => {
      // Replace with absolute-style import
      return `import ${importName} from '@/${importPath}'`;
    },
    description: 'Deep relative imports → absolute imports'
  },
  
  // Find component imports that should use index files
  {
    pattern: /import\s+(\{[^}]+\}|[A-Za-z0-9_$]+)\s+from\s+['"]\.\.?\/(components|layouts|hooks|utils|context)\/([^\/'"]+)['"]/g,
    replacement: (match, importName, folder, component) => {
      // Replace with import from index
      return `import ${importName} from '@/${folder}'`;
    },
    description: 'Individual component imports → index imports'
  }
];

// Scan a file for import issues and fix them
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;
    let hasChanges = false;
    const fileIssues = [];
    
    // Check for and fix import patterns
    importPatterns.forEach(({ pattern, replacement, description }) => {
      if (pattern.test(updatedContent)) {
        const originalContent = updatedContent;
        updatedContent = updatedContent.replace(pattern, replacement);
        
        if (originalContent !== updatedContent) {
          fileIssues.push(description);
          hasChanges = true;
        }
      }
    });
    
    // Sort imports (simple implementation)
    if (updatedContent.includes('import ')) {
      const lines = updatedContent.split('\n');
      const importLines = [];
      const otherLines = [];
      let inImportBlock = false;
      let lastImportIndex = -1;
      
      // Separate import lines from other lines
      lines.forEach((line, index) => {
        if (line.trim().startsWith('import ')) {
          importLines.push(line);
          lastImportIndex = index;
          inImportBlock = true;
        } else if (line.trim() === '' && inImportBlock && index <= lastImportIndex + 1) {
          // Empty line after imports
          inImportBlock = false;
        } else {
          otherLines.push(line);
        }
      });
      
      // Sort imports by groups
      const reactImports = importLines.filter(line => line.includes('react'));
      const npmImports = importLines.filter(line => 
        !line.includes('react') && 
        !line.includes('./') && 
        !line.includes('../') &&
        !line.includes('@/')
      );
      const localImports = importLines.filter(line => 
        line.includes('./') || 
        line.includes('../') || 
        line.includes('@/')
      );
      
      // Combine sorted imports with a blank line between groups
      const sortedImports = [
        ...reactImports,
        '',
        ...npmImports,
        '',
        ...localImports
      ].filter(line => line !== '' || Math.random() < 0.5); // Remove some empty lines randomly
      
      if (sortedImports.length !== importLines.length) {
        // Rebuild file content with sorted imports
        updatedContent = [...sortedImports, '', ...otherLines].join('\n');
        fileIssues.push('Sorted imports');
        hasChanges = true;
      }
    }
    
    // Update the file if changes were made
    if (hasChanges) {
      fs.writeFileSync(filePath, updatedContent);
      updatedFiles.push(filePath);
      importIssues.push({ file: filePath, issues: fileIssues });
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

// Find and process JS/JSX files
function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    
    if (ignoreDirs.includes(file)) {
      return;
    }
    
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fileExtensions.includes(path.extname(fullPath))) {
      processFile(fullPath);
    }
  });
}

// Prepare the project for absolute imports
function setupAbsoluteImports() {
  // Create/update jsconfig.json or tsconfig.json
  const jsConfigPath = path.join(rootDir, 'jsconfig.json');
  const jsConfig = {
    compilerOptions: {
      baseUrl: '.',
      paths: {
        '@/*': ['src/*']
      }
    },
    include: ['src']
  };
  
  fs.writeFileSync(jsConfigPath, JSON.stringify(jsConfig, null, 2));
}

// Main execution
setupAbsoluteImports();
traverseDir(srcDir);

// Generate a report
const reportContent = `# Import Cleanup Report

Generated: ${new Date().toISOString()}

## Files Updated
${updatedFiles.map(file => `- \`${path.relative(rootDir, file)}\``).join('\n')}

## Issues Fixed
${importIssues.map(({ file, issues }) => 
  `### ${path.relative(rootDir, file)}\n\n${issues.map(issue => `- ${issue}`).join('\n')}`
).join('\n\n')}
`;

fs.writeFileSync(path.join(rootDir, 'import_cleanup_report.md'), reportContent);

// Summary
