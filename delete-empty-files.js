/**
 * delete-empty-files.js
 * This script will delete the specified empty files
 */

const fs = require('fs');
const path = require('path');

// List of files to delete
const filesToDelete = [
  'src/components/UniversalSearchBar.js',
  'src/UIShowcase.js',
  'src/UIShowcase.css',
  'src/TestImports.js',
  'src/Testimonials.js',
  'src/SearchPage.js',
  'src/SearchFilterShowcase.js',
  'src/SearchFilterShowcase.css',
  'src/RoomCard.css',
  'src/PropertyShowcase.css',
  'src/PropertyShowcase.js',
  'src/ListingsGrid.js',
  'src/index.css',
  'src/HomePage.js',
  'src/FooterDemo.js',
  'src/FooterDemo.css',
  'src/DesignSystemPage.js',
  'src/DesignSystemPage.css',
  'src/ContactPage.js',
  'src/colors.css',
  'src/ColorPaletteShowcase.js',
  'src/ColorPaletteShowcase.css',
  'src/background-fix.css',
  'src/AboutPage.js',
  'src/utils/ultraStableBackground.js'
];

// Count deleted files
let deletedCount = 0;
let errorCount = 0;
let skippedCount = 0;

// Function to check if file is empty and delete it
function deleteIfEmpty(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    skippedCount++;
    return;
  }
  
  // Check if file is empty
  const stats = fs.statSync(fullPath);
  if (stats.size === 0) {
    try {
      fs.unlinkSync(fullPath);
      console.log(`Deleted empty file: ${filePath}`);
      deletedCount++;
    } catch (err) {
      console.error(`Error deleting ${filePath}:`, err);
      errorCount++;
    }
  } else {
    console.log(`File is not empty, skipping: ${filePath} (${stats.size} bytes)`);
    skippedCount++;
  }
}

console.log('Starting deletion of empty files...');
filesToDelete.forEach(deleteIfEmpty);

console.log('\nDeletion Summary:');
console.log(`- Files deleted: ${deletedCount}`);
console.log(`- Files skipped: ${skippedCount}`);
console.log(`- Errors encountered: ${errorCount}`);
