const fs = require('fs');
const path = require('path');

const emptyData = JSON.parse(fs.readFileSync('empty_results.json', 'utf8'));
const unusedData = JSON.parse(fs.readFileSync('unused_results.json', 'utf8'));

const filesToDelete = [
    ...emptyData.emptyFiles,
    ...unusedData.clientUnused,
    ...unusedData.backendUnused,
    ...unusedData.adminUnused
];

const dirsToDelete = [
    ...emptyData.emptyDirs
];

let deletedFiles = 0;
let deletedDirs = 0;

for (const file of filesToDelete) {
    if (fs.existsSync(file)) {
        try {
            fs.unlinkSync(file);
            deletedFiles++;
        } catch (e) {
            console.error(`Failed to delete ${file}: ${e.message}`);
        }
    }
}

for (const dir of dirsToDelete) {
    if (fs.existsSync(dir)) {
        try {
            fs.rmdirSync(dir);
            deletedDirs++;
        } catch (e) {
            console.error(`Failed to delete ${dir}: ${e.message}`);
        }
    }
}

console.log(`Deleted ${deletedFiles} files and ${deletedDirs} directories.`);
// Delete the temporary json files, and our helper scripts
try {
    fs.unlinkSync('empty_results.json');
    fs.unlinkSync('unused_results.json');
    fs.unlinkSync('find_empty.js');
    fs.unlinkSync('find_unused.js');
    fs.unlinkSync('empty_files.txt');
    fs.unlinkSync('empty_folders.txt');
} catch (e) {}
