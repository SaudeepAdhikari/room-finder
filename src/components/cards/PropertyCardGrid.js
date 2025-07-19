import React from 'react';
import PropertyCard from './PropertyCard';
import './PropertyCardGrid.css';
import { motion } from 'framer-motion';

const PropertyCardGrid = ({ properties }) => {
  // Animation variants for staggered card animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div 
      className="property-card-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {properties.map((property, index) => (
        <motion.div 
          key={property.id}
          variants={itemVariants}
          custom={index}
        >
          <PropertyCard property={property} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PropertyCardGrid;
