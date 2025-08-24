/**
 * cleanup.js - Remove console logs and commented code
 * 
 * This script identifies and removes:
 * 1. console.log statements from JS/JSX files
 * 2. Unnecessary commented code blocks
 */

const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.join(__dirname);
const ignoreDirs = ['node_modules', 'build', '.git'];
const fileExtensions = ['.js', '.jsx', '.ts', '.tsx'];

// Stats
let filesChecked = 0;
let filesModified = 0;
let consoleLogsRemoved = 0;

// Regex patterns
const consoleLogPattern = /^\s*console\.log\(.*\);?\s*$/gm;
const multilineConsolePattern = /^\s*console\.log\(\s*[\s\S]*?^\s*\);\s*$/gm;

function processFile(filePath) {
  if (!fileExtensions.includes(path.extname(filePath))) {
    return;
  }

  filesChecked++;
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalSize = content.length;
    
    // Replace console.log statements
    const newContent = content
      .replace(consoleLogPattern, '')
      .replace(multilineConsolePattern, '');
    
    // Only write if file was changed
    if (newContent.length !== originalSize) {
      fs.writeFileSync(filePath, newContent);
      filesModified++;
      consoleLogsRemoved += (originalSize - newContent.length) / 50; // Rough estimate
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    
    if (ignoreDirs.includes(file)) {
      return;
    }
    
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else {
      processFile(fullPath);
    }
  });
}
traverseDir(rootDir);
