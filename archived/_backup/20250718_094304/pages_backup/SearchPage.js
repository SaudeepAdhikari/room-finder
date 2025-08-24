import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SortBar from './SortBar';
import ListingsGrid from './ListingsGrid';
import Container from './components/Container';
import RevampedSearch from './components/RevampedSearch';
import './utils/animations.css';

export default function SearchPage() {
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    location: '',
    roomType: 'any',
    genderPreference: 'any',
  });
  const [sortBy, setSortBy] = useState('price');
  const [showResults, setShowResults] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMapView, setIsMapView] = useState(false);

  useEffect(() => {
    // Set loaded state after component mounts to trigger animations
    setIsLoaded(true);
    
    // Check for URL params to pre-fill filters
    const urlParams = new URLSearchParams(window.location.search);
    const urlFilters = {};
    
    if (urlParams.has('location')) urlFilters.location = urlParams.get('location');
    if (urlParams.has('priceMin')) urlFilters.priceMin = urlParams.get('priceMin');
    if (urlParams.has('priceMax')) urlFilters.priceMax = urlParams.get('priceMax');
    if (urlParams.has('roomType')) urlFilters.roomType = urlParams.get('roomType');
    if (urlParams.has('gender')) urlFilters.genderPreference = urlParams.get('gender');
    
    if (Object.keys(urlFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...urlFilters }));
      setShowResults(true);
    }
  }, []);

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    setShowResults(true);
    
    // Update URL with filters
    const params = new URLSearchParams();
    if (searchFilters.location) params.append('location', searchFilters.location);
    if (searchFilters.priceMin) params.append('priceMin', searchFilters.priceMin);
    if (searchFilters.priceMax) params.append('priceMax', searchFilters.priceMax);
    if (searchFilters.roomType) params.append('roomType', searchFilters.roomType);
    if (searchFilters.genderPreference) params.append('gender', searchFilters.genderPreference);
    
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const buttonVariants = {
    rest: { 
      scale: 1,
      background: "linear-gradient(90deg, rgb(126, 58, 242), rgb(59, 130, 246), rgb(6, 182, 212))"
    },
    hover: { 
      scale: 1.03,
      background: "linear-gradient(90deg, rgb(139, 92, 246), rgb(59, 130, 246), rgb(14, 165, 233))",
      transition: {
        duration: 0.3,
        ease: [0.33, 1, 0.68, 1]
      }
    },
    tap: { 
      scale: 0.97,
      background: "linear-gradient(90deg, rgb(107, 33, 168), rgb(29, 78, 216), rgb(8, 145, 178))",
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <Container>
      {/* Page header with enhanced animations */}
      <motion.div
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={headerVariants}
        className="text-center py-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent mb-4">
          🔍 Search Rooms
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Find your perfect room with our advanced search and filtering options
        </p>
      </motion.div>

      {/* Main search interface with staggered animations */}
      <motion.div
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={containerVariants}
        className="flex flex-col gap-8 items-start py-8 max-w-7xl mx-auto px-4"
      >
        {/* RevampedSearch component */}
        <motion.div
          className="w-full"
          variants={itemVariants}
        >
          <RevampedSearch 
            onSearch={handleSearch} 
            initialFilters={filters}
            showMap={true}
          />
        </motion.div>

        {/* Main content area with enhanced animations */}
        <motion.div
          className="flex-1 min-w-0"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <SortBar sortBy={sortBy} onChange={setSortBy} />
            <div className="flex gap-2">
              <button 
                className={`p-2 ${!isMapView ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-500 border border-indigo-500/20' : 'bg-white dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700'} rounded-xl shadow-sm transition-all duration-300`}
                aria-label="Grid view"
                onClick={() => setIsMapView(false)}
              >
                <i className="fas fa-th-large"></i>
              </button>
              <button 
                className={`p-2 ${isMapView ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-500 border border-indigo-500/20' : 'bg-white dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700'} rounded-xl shadow-sm transition-all duration-300`}
                aria-label="Map view"
                onClick={() => setIsMapView(true)}
              >
                <i className="fas fa-map-marked-alt"></i>
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {showResults ? (
              <motion.div
                key={isMapView ? "map-view" : "grid-view"}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ 
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="mt-8"
              >
                {isMapView ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg h-[600px] relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        <i className="fas fa-map-marked-alt text-3xl mb-4 block"></i>
                        Interactive map view coming soon!
                      </p>
                    </div>
                    <img 
                      src="https://cdn.jsdelivr.net/gh/SaudeepAdhikari/room-finder-assets@main/kathmandu-map-full.jpg" 
                      alt="Map view" 
                      className="w-full h-full object-cover opacity-30"
                    />
                  </div>
                ) : (
                  <ListingsGrid filters={filters} sortBy={sortBy} />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 px-8 text-center"
              >
                <motion.div 
                  className="text-6xl mb-6 animate-float"
                  animate={{ 
                    y: [0, -15, 0], 
                    transition: { 
                      duration: 3, 
                      ease: "easeInOut", 
                      repeat: Infinity 
                    } 
                  }}
                >
                  🏠
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">Ready to find your perfect room?</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg">
                  Set your preferences using the filters and click Search to see available listings.
                </p>
                <motion.button
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white rounded-xl font-bold shadow-lg"
                  onClick={handleSearch}
                >
                  Search Now
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </Container>
  );
}
