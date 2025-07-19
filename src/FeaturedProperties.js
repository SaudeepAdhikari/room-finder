import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import PropertyCardGrid from "./components/cards/PropertyCardGrid";
import { ScrollReveal, staggerContainer, fadeInUp } from './utils/animations';

// Sample properties data for the new cards
const sampleProperties = [
  {
    id: 1,
    image: "https://cdn.jsdelivr.net/gh/SaudeepAdhikari/room-finder-assets@main/property-1.jpg",
    title: "Modern Studio Apartment with City View",
    location: "Downtown, Kathmandu",
    price: 350,
    priceUnit: "month",
    beds: 1,
    baths: 1,
    area: 450,
    rating: 4.8,
    reviewCount: 24,
    tags: ["Featured"],
    amenities: ["WiFi", "Air Conditioning", "Furnished", "Parking"],
    isVerified: true,
    isNew: false
  },
  {
    id: 2,
    image: "https://cdn.jsdelivr.net/gh/SaudeepAdhikari/room-finder-assets@main/property-2.jpg",
    title: "Cozy Single Room near University",
    location: "Kirtipur, Kathmandu",
    price: 150,
    priceUnit: "month",
    beds: 1,
    baths: 1,
    area: 200,
    rating: 4.2,
    reviewCount: 16,
    tags: ["Student Friendly"],
    amenities: ["WiFi", "Laundry", "Water Supply"],
    isVerified: false,
    isNew: true
  },
  {
    id: 3,
    image: "https://cdn.jsdelivr.net/gh/SaudeepAdhikari/room-finder-assets@main/property-3.jpg",
    title: "Luxury 2BHK Apartment with Mountain View",
    location: "Lazimpat, Kathmandu",
    price: 650,
    priceUnit: "month",
    beds: 2,
    baths: 2,
    area: 900,
    rating: 4.9,
    reviewCount: 32,
    tags: ["Premium", "Featured"],
    amenities: ["WiFi", "AC", "Parking", "Security", "Furnished", "Kitchen"],
    isVerified: true,
    isNew: false
  }
];

// Legacy properties data (keeping for reference)
const legacyProperties = [
  { icon: "🏠", name: "Modern Apartment", color: "from-purple-500 to-blue-500", count: "120+ Available", price: "From $50/night" },
  { icon: "🏡", name: "Cozy House", color: "from-blue-500 to-cyan-500", count: "85+ Available", price: "From $75/night" },
  { icon: "🏢", name: "City Studio", color: "from-cyan-500 to-purple-500", count: "95+ Available", price: "From $40/night" },
  { icon: "🏘️", name: "Shared Flat", color: "from-purple-600 to-blue-600", count: "150+ Available", price: "From $25/night" },
  { icon: "🏕️", name: "Eco Retreat", color: "from-blue-600 to-cyan-600", count: "35+ Available", price: "From $90/night" },
];

export default function FeaturedProperties() {
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();
  
  useEffect(() => {
    // Start animations after component mounts
    const timeout = setTimeout(() => {
      setIsVisible(true);
      controls.start("visible");
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [controls]);
  
  // Enhanced staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  // Enhanced item animations
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  return (
    <section className="my-20 px-4">
      <ScrollReveal variant={fadeInUp}>
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 font-poppins bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
          ✨ Featured Properties
        </h2>
      </ScrollReveal>
      
      <ScrollReveal variant={fadeInUp} delay={0.2}>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Discover our handpicked selection of premium properties with verified hosts and excellent amenities
        </p>
      </ScrollReveal>
      
      {/* New Property Cards */}
      <div className="max-w-7xl mx-auto mb-20">
        <ScrollReveal variant={fadeInUp} delay={0.3}>
          <PropertyCardGrid properties={sampleProperties} />
        </ScrollReveal>
      </div>
      
      {/* Legacy Property Icons with enhanced animations */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        viewport={{ once: true, margin: "-50px" }}
      >
        {legacyProperties.map((p, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ 
              y: -8, 
              scale: 1.03,
              transition: { 
                type: "spring", 
                stiffness: 400, 
                damping: 17 
              }
            }}
            whileTap={{ 
              scale: 0.98,
              transition: { 
                duration: 0.1 
              }
            }}
            className="group relative overflow-hidden"
          >
            <div className="flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-8 transition-all duration-300 cursor-pointer min-h-[240px] hover:shadow-2xl hover:border-purple-300/50 dark:hover:border-purple-500/30">
              {/* Gradient background overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
              
              {/* Icon with enhanced animations */}
              <motion.span 
                className="text-6xl mb-4 drop-shadow-lg relative z-10"
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 5,
                  transition: { 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 10 
                  }
                }}
              >
                {p.icon}
              </motion.span>
              
              {/* Name with gradient text */}
              <span className={`font-bold text-lg text-center mb-2 relative z-10 bg-gradient-to-r ${p.color} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                {p.name}
              </span>
              
              {/* Count and price info */}
              <div className="text-center relative z-10">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{p.count}</div>
                <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">{p.price}</div>
              </div>
              
              {/* Subtle glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl`}></div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
