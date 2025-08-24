import React from 'react';
import { motion } from 'framer-motion';
import './home.css';
import FeaturedProperties from './FeaturedProperties';
import PopularCities from './PopularCities';
import TestimonialsSection from './components/TestimonialsSection';
import WhyChooseUs from './WhyChooseUs';
import HeroSection from './components/home/HeroSection';
import { ScrollReveal, fadeInUp, staggerContainer, fadeIn } from './utils/animations';

const HomePage = () => (
  <>
    {/* Modern Hero Section */}
    <HeroSection />
    {/* ...existing homepage content... */}

    // ...existing code...
    
    {/* Main content with enhanced spacing and background */}
    <main className="relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-purple-50/30 dark:via-gray-900/30 dark:to-gray-800/30 pointer-events-none"></div>
      
      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        {/* Featured Properties Section */}
        <ScrollReveal variant={fadeInUp}>
          <FeaturedProperties />
        </ScrollReveal>
        
        {/* Popular Cities Section */}
        <ScrollReveal variant={fadeInUp} delay={0.2}>
          <PopularCities />
        </ScrollReveal>

        {/* Why Choose Us Section */}
        <ScrollReveal variant={fadeInUp} delay={0.3}
        >          <WhyChooseUs />
        </ScrollReveal>

        {/* Testimonials Section */}
        <ScrollReveal variant={fadeInUp} delay={0.4}>
          <TestimonialsSection />
        </ScrollReveal>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="my-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
              <div className="absolute top-32 right-20 w-16 h-16 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Perfect Stay?</h2>
              <p className="text-xl mb-8 opacity-90">Join thousands of satisfied customers who found their ideal accommodation</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  🏠 List Your Property
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300"
                >
                  🔍 Start Searching
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Bottom decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-100/20 via-blue-100/20 to-transparent dark:from-purple-900/20 dark:via-blue-900/20 pointer-events-none"></div>
    </main>
  </>
);

export default HomePage;
