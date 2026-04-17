const fs = require('fs');
const path = require('path');

const dirsToCreate = [
    'client/src/services',
    'client/src/layouts',
    'client/src/components/room',
    'admin/src/pages',
    'admin/src/services',
    'admin/src/layouts',
    'admin/src/components/common'
];

dirsToCreate.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

const fileMoves = [
    // Client migrations
    { old: 'client/src/api.js', new: 'client/src/services/apiService.js' },
    { old: 'client/src/components/Header.js', new: 'client/src/layouts/Header.js' },
    { old: 'client/src/components/UniversalNavbar.js', new: 'client/src/layouts/UniversalNavbar.js' },
    { old: 'client/src/RoomCard.js', new: 'client/src/components/room/RoomCard.js' },
    { old: 'client/src/RoomInfo.js', new: 'client/src/components/room/RoomInfo.js' },
    { old: 'client/src/ContactHostButton.js', new: 'client/src/components/room/ContactHostButton.js' },
    { old: 'client/src/ReviewForm.js', new: 'client/src/components/room/ReviewForm.js' },
    { old: 'client/src/ReviewForm.css', new: 'client/src/components/room/ReviewForm.css' },
    { old: 'client/src/ReviewsSection.js', new: 'client/src/components/room/ReviewsSection.js' },
    { old: 'client/src/AmenitiesList.js', new: 'client/src/components/room/AmenitiesList.js' },

    // Admin migrations - Services & Layouts
    { old: 'admin/src/api.js', new: 'admin/src/services/apiService.js' },
    { old: 'admin/src/admin/AdminHeader.js', new: 'admin/src/layouts/AdminHeader.js' },
    { old: 'admin/src/admin/AdminHeader.css', new: 'admin/src/layouts/AdminHeader.css' },
    { old: 'admin/src/admin/AdminSidebar.js', new: 'admin/src/layouts/AdminSidebar.js' },
    { old: 'admin/src/admin/AdminSidebar.css', new: 'admin/src/layouts/AdminSidebar.css' },
    { old: 'admin/src/admin/AdminLayout.js', new: 'admin/src/layouts/AdminLayout.js' },
    { old: 'admin/src/admin/AdminLayout.css', new: 'admin/src/layouts/AdminLayout.css' },
    
    // Admin migrations - Pages
    { old: 'admin/src/admin/AdminDashboardPage.js', new: 'admin/src/pages/AdminDashboardPage.js' },
    { old: 'admin/src/admin/AdminDashboardPage.css', new: 'admin/src/pages/AdminDashboardPage.css' },
    { old: 'admin/src/admin/AdminLogin.js', new: 'admin/src/pages/AdminLogin.js' },
    { old: 'admin/src/admin/AdminLogin.css', new: 'admin/src/pages/AdminLogin.css' },
    { old: 'admin/src/admin/AdminUsersPage.js', new: 'admin/src/pages/AdminUsersPage.js' },
    { old: 'admin/src/admin/AdminRoomsPage.js', new: 'admin/src/pages/AdminRoomsPage.js' },
    { old: 'admin/src/admin/AdminReviewsPage.js', new: 'admin/src/pages/AdminReviewsPage.js' },
    { old: 'admin/src/admin/AdminBookingsPage.js', new: 'admin/src/pages/AdminBookingsPage.js' },
    { old: 'admin/src/admin/AdminPaymentsPage.js', new: 'admin/src/pages/AdminPaymentsPage.js' },
    { old: 'admin/src/admin/AdminAnalyticsPage.js', new: 'admin/src/pages/AdminAnalyticsPage.js' },
    { old: 'admin/src/admin/AdminAnalyticsPage.css', new: 'admin/src/pages/AdminAnalyticsPage.css' }
];

console.log('--- Moving Files ---');
fileMoves.forEach(move => {
    const oldPath = path.join(__dirname, move.old);
    const newPath = path.join(__dirname, move.new);
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Moved: ${move.old} -> ${move.new}`);
    }
});

const filesToDelete = [
    'client/src/components/Footer.js', // Blank 1-byte file
];

console.log('\n--- Deleting Dead Code ---');
filesToDelete.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Deleted: ${file}`);
    }
});

// VERY basic regex replacements for the API service imports in the client.
// In a true environment we would run eslint --fix or use an AST parser.
function updateImports(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            updateImports(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Fix client api.js to apiService.js
            if (content.includes("from './api'") || content.includes("from '../api'") || content.includes("from '../../api'")) {
                content = content.replace(/from '(\.\.?\/?.*)api'/g, "from '$1services/apiService'");
                modified = true;
            }

            // Fix layout header from components to layouts
            if (content.includes("from './components/Header'")) {
                content = content.replace("from './components/Header'", "from './layouts/Header'");
                modified = true;
            }
            if (content.includes("from './UniversalNavbar'")) {
                content = content.replace("from './UniversalNavbar'", "from '../layouts/UniversalNavbar'");
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated imports in: ${fullPath.replace(__dirname, '')}`);
            }
        }
    });
}

console.log('\n--- Updating Import Dependencies ---');
updateImports(path.join(__dirname, 'client/src'));
updateImports(path.join(__dirname, 'admin/src'));

console.log('\n✅ Restructure Complete!');
