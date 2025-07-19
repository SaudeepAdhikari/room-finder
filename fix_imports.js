// Fix imports utility for the Room Finder app
// This script will check and fix any import issues in the Header component

const fs = require('fs');
const path = require('path');

console.log('Starting import fix process...');

// Define the paths
const basePath = __dirname;
const componentsDir = path.join(basePath, 'src', 'components');
const headerPath = path.join(componentsDir, 'Header.js');
const userSidebarPath = path.join(componentsDir, 'UserSidebar.js');
const profileModalPath = path.join(componentsDir, 'ProfileModal.js');
const appPath = path.join(basePath, 'src', 'App.js');

// Check if required components exist
console.log('Checking for required component files...');

if (!fs.existsSync(headerPath)) {
    console.error('ERROR: Header.js does not exist!');
    process.exit(1);
}

// Create a basic UserSidebar component if it doesn't exist
if (!fs.existsSync(userSidebarPath)) {
    console.log('UserSidebar.js does not exist. Creating a basic version...');
    
    const userSidebarContent = `import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { FaUser, FaCog, FaSignOutAlt, FaTimes } from 'react-icons/fa';

function UserSidebar({ isOpen, onClose }) {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 40 }}
            className="fixed top-0 right-0 h-full w-80 bg-gray-50 dark:bg-gray-900 shadow-2xl z-50 p-6 overflow-y-auto"
          >
            {/* Header with close button */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Profile</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* User info */}
            <div className="flex items-center gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  user.firstName?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.firstName && user.lastName ? \`\${user.firstName} \${user.lastName}\` : user.name || 'User'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
              </div>
            </div>

            {/* Navigation Options */}
            <nav className="space-y-2 mb-8">
              <button
                onClick={() => { navigate('/profile'); onClose(); }}
                className="flex items-center gap-3 w-full p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FaUser className="text-purple-600" />
                <span className="font-medium text-gray-900 dark:text-white">My Profile</span>
              </button>
              
              <button
                onClick={() => { navigate('/settings'); onClose(); }}
                className="flex items-center gap-3 w-full p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FaCog className="text-purple-600" />
                <span className="font-medium text-gray-900 dark:text-white">Settings</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-left hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <FaSignOutAlt className="text-red-600" />
                <span className="font-medium text-red-600 dark:text-red-400">Logout</span>
              </button>
            </nav>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                &copy; {new Date().getFullYear()} SajiloStay
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default UserSidebar;
`;
    fs.writeFileSync(userSidebarPath, userSidebarContent);
    console.log('Created UserSidebar.js successfully');
}
// Create ProfileModal component if it doesn't exist
if (!fs.existsSync(profileModalPath)) {
    console.log('ProfileModal.js does not exist. Creating a basic version...');
    
    const profileModalContent = `import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

function ProfileModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl mt-16"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Edit Profile
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ProfileModal;
`;
    fs.writeFileSync(profileModalPath, profileModalContent);
    console.log('Created ProfileModal.js successfully');
}

// Check if App.js is using the correct navigation component
console.log('Checking App.js navigation component usage...');
try {
    let appContent = fs.readFileSync(appPath, 'utf8');
    let modified = false;
    let usesModernNavbar = false;
    let usesHeader = false;
    
    // Check imports
    if (appContent.includes("import ModernNavbar from './components/ModernNavbar';")) {
        usesModernNavbar = true;
    }
    
    if (appContent.includes("import Header from './components/Header';")) {
        usesHeader = true;
    }
    
    // Check component usage
    const hasModernNavbarComponent = appContent.includes('<ModernNavbar');
    const hasHeaderComponent = appContent.includes('<Header');
    
    console.log(`App.js current state: ${usesModernNavbar ? 'Imports ModernNavbar' : 'Does not import ModernNavbar'}, ${usesHeader ? 'Imports Header' : 'Does not import Header'}`);
    console.log(`Components used: ${hasModernNavbarComponent ? 'Uses <ModernNavbar>' : 'Does not use <ModernNavbar>'}, ${hasHeaderComponent ? 'Uses <Header>' : 'Does not use <Header>'}`);
    
    // Make sure SajiloStayLogo is imported for the ModernNavbar
    const modernNavbarPath = path.join(componentsDir, 'ModernNavbar.js');
    if (fs.existsSync(modernNavbarPath)) {
        let modernNavbarContent = fs.readFileSync(modernNavbarPath, 'utf8');
        
        if (!modernNavbarContent.includes("import SajiloStayLogo from './SajiloStayLogo'")) {
            modernNavbarContent = modernNavbarContent.replace(
                /import React.*?\n/,
                `import React from 'react';\nimport SajiloStayLogo from './SajiloStayLogo';\n`
            );
            fs.writeFileSync(modernNavbarPath, modernNavbarContent);
            console.log('Updated ModernNavbar.js to import SajiloStayLogo');
        }
    }
    
} catch (error) {
    console.error('Error checking App.js navigation components:', error);
}

console.log('Import fix process completed successfully!');
console.log('Please restart your development server to see the changes.'););

console.log(`Fixed imports in ${filesFixed} files.`);
