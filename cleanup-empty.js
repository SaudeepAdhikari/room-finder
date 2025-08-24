/**
 * cleanup-empty.js - Find and remove empty files and directories
 */

const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.join(__dirname);
const ignoreDirs = ['node_modules', 'build', '.git'];
const minSizeBytes = 20; // Files smaller than this are considered potentially empty

// Stats
const emptyFiles = [];
const nearEmptyFiles = [];
const emptyDirs = [];

function isDirectoryEmpty(dirPath) {
  const files = fs.readdirSync(dirPath);
  return files.length === 0;
}

function checkFile(filePath) {
  try {
    const stats = fs.statSync(filePath);
    
    if (stats.size === 0) {
      emptyFiles.push(filePath);
    } else if (stats.size < minSizeBytes) {
      // Check if file just has whitespace or simple comments
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.trim() || content.trim().startsWith('//') && content.split('\n').length < 3) {
        nearEmptyFiles.push(filePath);
      }
    }
  } catch (err) {
    console.error(`Error checking file ${filePath}:`, err);
  }
}

function traverseDir(dir) {
  try {
    const files = fs.readdirSync(dir);
    
    if (files.length === 0) {
      emptyDirs.push(dir);
      return;
    }
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      
      if (ignoreDirs.includes(file)) {
        return;
      }
      
      try {
        if (fs.statSync(fullPath).isDirectory()) {
          traverseDir(fullPath);
        } else {
          checkFile(fullPath);
        }
      } catch (err) {
        console.error(`Error accessing ${fullPath}:`, err);
      }
    });
    
    // Check if directory is empty after traversing (may have contained only empty files/dirs)
    if (isDirectoryEmpty(dir)) {
      emptyDirs.push(dir);
    }
  } catch (err) {
    console.error(`Error traversing directory ${dir}:`, err);
  }
}
traverseDir(rootDir);
emptyFiles.forEach(file => console.log(file));
nearEmptyFiles.forEach(file => console.log(file));
emptyDirs.forEach(dir => console.log(dir));
// Create a cleanup script that can be run separately
const cleanupScript = `
#!/bin/bash
# Generated cleanup script - Review before running!

# Remove empty files
${emptyFiles.map(file => `rm "${file.replace(/\\/g, '/')}"`).join('\n')}

# Remove nearly empty files - REVIEW THESE FIRST
${nearEmptyFiles.map(file => `# rm "${file.replace(/\\/g, '/')}"`).join('\n')}

# Remove empty directories
${emptyDirs.map(dir => `rmdir "${dir.replace(/\\/g, '/')}"`).join('\n')}
`;

fs.writeFileSync(path.join(rootDir, 'remove-empty-files.sh'), cleanupScript);
// Generate PowerShell version for Windows
const psCleanupScript = `
# Generated cleanup script for PowerShell - Review before running!

# Remove empty files
${emptyFiles.map(file => `Remove-Item "${file}"`).join('\n')}

# Remove nearly empty files - REVIEW THESE FIRST
${nearEmptyFiles.map(file => `# Remove-Item "${file}"`).join('\n')}

# Remove empty directories
${emptyDirs.map(dir => `Remove-Item -Path "${dir}" -Force`).join('\n')}
`;

fs.writeFileSync(path.join(rootDir, 'remove-empty-files.ps1'), psCleanupScript);
