// React development build trigger script
// This script adds a timestamp comment to force webpack to rebuild components

const fs = require('fs');
const path = require('path');

// List of files to update with timestamps to force rebuild
const filesToRebuild = [
  path.join(__dirname, 'src', 'components', 'Header.js'),
  path.join(__dirname, 'src', 'components', 'ModernNavbar.js'),
  path.join(__dirname, 'src', 'components', 'SajiloStayLogo.js')
];

// CSS files to update
const cssFilesToRebuild = [
  path.join(__dirname, 'src', 'components', 'ModernNavbar.css')
];

// Function to update a file with a timestamp
function updateFileWithTimestamp(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      console.log(`Reading ${path.basename(filePath)}...`);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Add or update timestamp comment at the top of the file
      const timestamp = new Date().toISOString();
      
      if (content.includes('// Last modified:')) {
        content = content.replace(/\/\/ Last modified:.*/, `// Last modified: ${timestamp}`);
      } else {
        content = `// Last modified: ${timestamp}\n${content}`;
      }
      
      console.log(`Writing updated ${path.basename(filePath)}...`);
      fs.writeFileSync(filePath, content);
      
      console.log(`✓ ${path.basename(filePath)} has been updated with a new timestamp`);
      return true;
    } else {
      console.log(`⚠ File not found: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`⚠ Error updating ${path.basename(filePath)}:`, error);
    return false;
  }
}

// Process JS files
console.log('=== Updating JS files to force rebuild ===');
let successCount = 0;
filesToRebuild.forEach(file => {
  if (updateFileWithTimestamp(file)) {
    successCount++;
  }
});

// Process CSS files
console.log('\n=== Updating CSS files to force rebuild ===');
cssFilesToRebuild.forEach(file => {
  if (updateFileWithTimestamp(file)) {
    successCount++;
  }
});

console.log(`\nCompleted with ${successCount} files updated.`);
console.log('This should force webpack to rebuild the components');
console.log('Please refresh your browser to see the changes');
