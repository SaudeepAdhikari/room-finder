/**
 * organize-folders.js - Reorganize project structure according to best practices
 */

const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.join(__dirname);
const srcDir = path.join(rootDir, 'src');

// Structure plan - files and folders that should be moved
const moveOperations = [
  // Move root components to appropriate folders
  { 
    pattern: /^src\/([A-Z][A-Za-z0-9]*)(\.js|\.jsx)$/,
    destination: 'src/components/$1$2',
    description: 'Move root components to components folder' 
  },
  
  // Move CSS files to accompany their components
  {
    pattern: /^src\/([A-Z][A-Za-z0-9]*)\.css$/,
    destination: 'src/components/$1.css',
    description: 'Move component CSS files to components folder'
  },
  
  // Organize components by type
  {
    pattern: /^src\/components\/([A-Z][A-Za-z0-9]*)Card(\.js|\.jsx|\.css)$/,
    destination: 'src/components/cards/$1Card$2',
    description: 'Move card components to cards subfolder'
  },
  
  {
    pattern: /^src\/components\/([A-Z][A-Za-z0-9]*)(Form|Input|Select|Checkbox|Radio)(\.js|\.jsx|\.css)$/,
    destination: 'src/components/forms/$1$2$3',
    description: 'Move form components to forms subfolder'
  },
  
  {
    pattern: /^src\/components\/([A-Z][A-Za-z0-9]*)(Button|Toggle|Switch)(\.js|\.jsx|\.css)$/,
    destination: 'src/components/ui/$1$2$3',
    description: 'Move UI components to ui subfolder'
  },
  
  {
    pattern: /^src\/components\/([A-Z][A-Za-z0-9]*)(Layout|Header|Footer|Sidebar|Navbar)(\.js|\.jsx|\.css)$/,
    destination: 'src/layouts/$1$2$3',
    description: 'Move layout components to layouts folder'
  },
  
  // Move Page components to pages folder
  {
    pattern: /^src\/components\/([A-Z][A-Za-z0-9]*)(Page)(\.js|\.jsx|\.css)$/,
    destination: 'src/pages/$1$3',
    description: 'Move page components to pages folder'
  },
];

// Stats
let filesToMove = [];
let dirsToCreate = new Set();

// Function to collect files to move
function analyzeStructure() {
  function collectFiles(dir, relativePath = '') {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const relativeFsPath = path.join(relativePath, file);
      
      if (fs.statSync(fullPath).isDirectory()) {
        collectFiles(fullPath, relativeFsPath);
        return;
      }
      
      // Check if this file matches any patterns
      moveOperations.forEach(op => {
        const normalizedPath = relativeFsPath.replace(/\\/g, '/');
        const match = normalizedPath.match(op.pattern);
        
        if (match) {
          const dest = normalizedPath.replace(op.pattern, op.destination);
          filesToMove.push({
            source: normalizedPath,
            destination: dest,
            description: op.description
          });
          
          // Collect directories that need to be created
          const destDir = path.dirname(dest);
          dirsToCreate.add(destDir);
        }
      });
    });
  }
  
  collectFiles(rootDir);
}

// Generate move operations script
function generateMoveScript() {
  analyzeStructure();
  // Group by operation type for clearer output
  const groupedOperations = {};
  filesToMove.forEach(op => {
    if (!groupedOperations[op.description]) {
      groupedOperations[op.description] = [];
    }
    groupedOperations[op.description].push(op);
  });
  
  // Generate PowerShell script
  let psScript = `
# Project Reorganization Script
# Generated: ${new Date().toISOString()}
# 
# This script will move files according to the project organization plan.
# Review before running!

# Create required directories
`;

  // Add directory creation commands
  Array.from(dirsToCreate).sort().forEach(dir => {
    psScript += `New-Item -Path "${dir.replace(/\//g, '\\')}" -ItemType Directory -Force\n`;
  });
  
  psScript += `\n# Move files to their new locations\n`;
  
  // Add move commands grouped by operation type
  Object.entries(groupedOperations).forEach(([description, operations]) => {
    psScript += `\n# ${description}\n`;
    
    operations.forEach(op => {
      const sourcePath = path.join(rootDir, op.source.replace(/\//g, '\\'));
      const destPath = path.join(rootDir, op.destination.replace(/\//g, '\\'));
      
      psScript += `Move-Item -Path "${sourcePath}" -Destination "${destPath}" -Force\n`;
    });
  });
  
  fs.writeFileSync(path.join(rootDir, 'organize_folders.ps1'), psScript);
  // Also generate a report of planned moves
  let reportContent = `# Project Reorganization Plan\n\n`;
  
  Object.entries(groupedOperations).forEach(([description, operations]) => {
    reportContent += `## ${description}\n\n`;
    
    operations.forEach(op => {
      reportContent += `- \`${op.source}\` → \`${op.destination}\`\n`;
    });
    
    reportContent += '\n';
  });
  
  fs.writeFileSync(path.join(rootDir, 'reorganization_plan.md'), reportContent);
}

// Execute the script
generateMoveScript();
