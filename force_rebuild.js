/**
 * force_rebuild.js - Clear build caches and force a clean rebuild
 * 
 * This script:
 * 1. Removes build artifacts and caches
 * 2. Reinstalls dependencies if needed
 * 3. Rebuilds the project with a clean slate
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const rootDir = path.join(__dirname);

// Directories to clean
const cleanDirs = [
  'node_modules/.cache',
  'build',
  '.next',
  'dist',
];

// Print header
// Clean directories
cleanDirs.forEach(dir => {
  const fullPath = path.join(rootDir, dir);
  
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } catch (err) {
      console.error(`Error removing ${dir}:`, err);
    }
  } else {
  }
});

// Clear dependency cache if needed
const clearDeps = process.argv.includes('--clear-deps');
if (clearDeps) {
  try {
    fs.rmSync(path.join(rootDir, 'node_modules'), { recursive: true, force: true });
  } catch (err) {
    console.error('Error removing node_modules:', err);
  }
}

// Check for backend node_modules
const backendDir = path.join(rootDir, 'backend');
if (fs.existsSync(backendDir) && fs.existsSync(path.join(backendDir, 'package.json'))) {
  if (clearDeps) {
    try {
      fs.rmSync(path.join(backendDir, 'node_modules'), { recursive: true, force: true });
    } catch (err) {
      console.error('Error removing backend/node_modules:', err);
    }
  }
}

// Install dependencies if needed
if (clearDeps) {
  try {
    execSync('npm install', { stdio: 'inherit', cwd: rootDir });
    
    if (fs.existsSync(path.join(backendDir, 'package.json'))) {
      execSync('npm install', { stdio: 'inherit', cwd: backendDir });
    }
  } catch (err) {
    console.error('Error installing dependencies:', err);
    process.exit(1);
  }
}

// Build the project
try {
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
