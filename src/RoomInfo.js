import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './utils/animations.css';

function RoomInfo({ title, price, available, roommatePref }) {
  const [isAnimated, setIsAnimated] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mount
    setIsAnimated(true);
  }, []);

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const priceVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1]
      }
    },
    hover: {
      scale: 1.05,
      color: "#4f46e5",
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="card flex items-center justify-between mb-4 gap-6 flex-wrap"
      initial="hidden"
      animate={isAnimated ? "visible" : "hidden"}
      variants={contentVariants}
    >
      <div>
        <motion.div 
          className="font-bold text-2xl mb-1"
          variants={itemVariants}
        >
          {title}
        </motion.div>
        
        <motion.div 
          className="text-blue-600 font-semibold text-xl mb-1"
          variants={priceVariants}
          whileHover="hover"
        >
          NPR {price}
        </motion.div>
        
        <motion.div 
          className={available ? 'text-green-600 font-semibold text-base animate-pulse' : 'text-red-600 font-semibold text-base'}
          variants={itemVariants}
        >
          {available ? 'Available' : 'Not Available'}
        </motion.div>
        
        <motion.div 
          className="text-gray-600 mt-1"
          variants={itemVariants}
        >
          Preference: {roommatePref}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default RoomInfo;
