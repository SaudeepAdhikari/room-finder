import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaList, FaSignOutAlt, FaPalette } from 'react-icons/fa';

const UserSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigateAndClose = (path) => {
    navigate(path);
    onClose();
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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-2xl z-50 p-4 flex flex-col"
          >
            {/* User Info */}
            <div className="p-4 mb-6 text-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-16 h-16 rounded-full mx-auto mb-2 object-cover border-2 border-purple-500"
                />
              ) : (
                <div className="w-16 h-16 rounded-full mx-auto mb-2 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 flex items-center justify-center text-xl font-bold">
                  {user?.firstName?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <h3 className="text-lg font-bold">
                {user?.firstName || user?.name || 'User'}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
            
            {/* Navigation */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigateAndClose('/profile')}
                className="flex items-center gap-3 p-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                <FaUser />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => navigateAndClose('/post')}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                <FaList />
                <span>List Property</span>
              </button>
              
              <button
                onClick={() => navigateAndClose('/design-system')}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                <FaPalette />
                <span>Design System</span>
              </button>
            </div>
            
            {/* Logout */}
            <div className="mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 rounded-xl bg-red-900/40 text-red-300 hover:bg-red-800/60 transition-colors w-full"
              >
                <FaSignOutAlt />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserSidebar;
