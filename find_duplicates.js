/**
 * find_duplicates.js - Detect duplicate code and components
 * 
 * This script helps identify:
 * 1. Duplicate or very similar JS/JSX files
 * 2. Components with similar names that might be consolidated
 * 3. Files that export components with the same names
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const rootDir = path.join(__dirname);
const srcDir = path.join(rootDir, 'src');
const fileExtensions = ['.js', '.jsx'];
const ignorePatterns = [/node_modules/, /build/, /\.git/];

// Results
const componentExports = {};
const similarFiles = {};
const similarNames = [];
const duplicateContents = {};

// Helper to calculate file hash for similarity comparison
function calculateFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Remove comments and whitespace to focus on actual code
    const cleanContent = content
      .replace(/\/\/.*$/gm, '') // Remove single line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    return {
      hash: crypto.createHash('md5').update(cleanContent).digest('hex'),
      size: cleanContent.length
    };
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return { hash: '', size: 0 };
  }
}

// Extract component name from file content
function extractComponentName(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Look for React component definitions
    const patterns = [
      /function\s+([A-Z][A-Za-z0-9_]*)\s*\(/g, // Function components
      /class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+React\.Component/g, // Class components
      /class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+Component/g, // Class components (imported Component)
      /const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\(\s*\)/g, // Arrow function components
      /const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\([^)]*\)\s*=>/g, // Arrow function with params
      /const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*React\.forwardRef/g, // forwardRef components
      /export\s+default\s+([A-Z][A-Za-z0-9_]*)/g // Default exports
    ];
    
    let componentNames = [];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        componentNames.push(match[1]);
      }
    });
    
    // Remove duplicates
    componentNames = [...new Set(componentNames)];
    
    return componentNames;
  } catch (err) {
    console.error(`Error extracting component name from ${filePath}:`, err);
    return [];
  }
}

// Analyze project files
function analyzeFiles() {
  const fileHashes = {};
  
  function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      
      // Skip ignored patterns
      if (ignorePatterns.some(pattern => pattern.test(fullPath))) {
        return;
      }
      
      try {
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          traverseDir(fullPath);
        } else if (fileExtensions.includes(path.extname(fullPath))) {
          // Collect file hash for similarity detection
          const { hash, size } = calculateFileHash(fullPath);
          
          if (!fileHashes[hash]) {
            fileHashes[hash] = [];
          }
          fileHashes[hash].push({ path: fullPath, size });
          
          // Collect component names
          const componentNames = extractComponentName(fullPath);
          
          componentNames.forEach(name => {
            if (!componentExports[name]) {
              componentExports[name] = [];
            }
            componentExports[name].push(fullPath);
          });
          
          // Check for similar component names
          const baseName = path.basename(fullPath, path.extname(fullPath));
          Object.keys(componentExports).forEach(component => {
            // Skip perfect matches and very short names
            if (component === baseName || component.length < 5 || baseName.length < 5) return;
            
            // Check if one is a substring of the other
            if (component.includes(baseName) || baseName.includes(component)) {
              similarNames.push({
                name1: baseName,
                name2: component,
                file1: fullPath,
                file2: componentExports[component][0]
              });
            }
          });
        }
      } catch (err) {
        console.error(`Error accessing ${fullPath}:`, err);
      }
    });
  }
  
  traverseDir(srcDir);
  
  // Find duplicate files
  Object.entries(fileHashes).forEach(([hash, files]) => {
    if (files.length > 1 && hash !== '') {
      duplicateContents[hash] = files;
    }
  });
}

// Main execution
analyzeFiles();

// Generate report
const reportContent = `# Duplicate Code Analysis Report

## Components with Same Name
${Object.entries(componentExports)
  .filter(([_, files]) => files.length > 1)
  .map(([name, files]) => {
    return `### ${name}\n\nFound in ${files.length} files:\n${files.map(f => `- \`${path.relative(rootDir, f)}\``).join('\n')}\n`;
  })
  .join('\n')}

## Similar Component Names
${similarNames.map(item => {
  return `- "${item.name1}" in \`${path.relative(rootDir, item.file1)}\` is similar to "${item.name2}" in \`${path.relative(rootDir, item.file2)}\``;
}).join('\n')}

## Duplicate or Nearly Identical Files
${Object.entries(duplicateContents).map(([hash, files]) => {
  return `### Files with hash ${hash.substring(0, 8)}\n\n${files.map(f => `- \`${path.relative(rootDir, f.path)}\` (${f.size} bytes)`).join('\n')}\n`;
}).join('\n')}
`;

fs.writeFileSync(path.join(rootDir, 'duplicate_code_report.md'), reportContent);
// Summary
