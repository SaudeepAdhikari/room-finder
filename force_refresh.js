/**
 * force_refresh.js - Clear all caches and refresh the development environment
 * 
 * This script:
 * 1. Clears browser caches
 * 2. Restarts development servers
 * 3. Forces a clean state for development
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// Configuration
const rootDir = path.join(__dirname);
const backendDir = path.join(rootDir, 'backend');

// Print header
// Kill any running servers
try {
  if (process.platform === 'win32') {
    execSync('taskkill /f /im node.exe', { stdio: 'ignore' });
  } else {
    execSync('pkill -f node', { stdio: 'ignore' });
  }
} catch (err) {
  // Ignore errors here as there might not be any processes to kill
}

// Clear development caches
const cacheDirs = [
  'node_modules/.cache',
  '.cache'
];

cacheDirs.forEach(dir => {
  const fullPath = path.join(rootDir, dir);
  
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } catch (err) {
      console.error(`Error removing ${dir}:`, err);
    }
  }
});

// Start backend server
let backendProcess;

if (fs.existsSync(path.join(backendDir, 'server.js'))) {
  backendProcess = spawn('node', ['server.js'], {
    cwd: backendDir,
    stdio: 'pipe',
    shell: true,
    detached: true
  });
  
  backendProcess.stdout.on('data', (data) => {
  });
  
  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend error: ${data.toString().trim()}`);
  });
  
  // Detach the process
  backendProcess.unref();
} else {
}

// Start React development server
const frontendProcess = spawn('npm', ['start'], {
  cwd: rootDir,
  stdio: 'pipe',
  shell: true,
  detached: true
});

frontendProcess.stdout.on('data', (data) => {
  // Check if the server has started
  if (data.toString().includes('You can now view') || data.toString().includes('Local:')) {
  }
});

frontendProcess.stderr.on('data', (data) => {
  console.error(`Frontend error: ${data.toString().trim()}`);
});

// Detach the process
frontendProcess.unref();

// Print instructions
// Keep the script running to show server output
process.stdin.resume();
