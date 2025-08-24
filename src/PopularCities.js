import React from "react";

import { motion } from "framer-motion";

const cities = [
  { icon: "🏙️", name: "Kathmandu", color: "from-purple-500 to-pink-500", description: "Capital City", properties: "200+ Properties" },
  { icon: "🌉", name: "Pokhara", color: "from-blue-500 to-purple-500", description: "Lake City", properties: "150+ Properties" },
  { icon: "🏞️", name: "Lalitpur", color: "from-cyan-500 to-blue-500", description: "Cultural Hub", properties: "120+ Properties" },
  { icon: "🌄", name: "Biratnagar", color: "from-purple-600 to-cyan-500", description: "Industrial City", properties: "80+ Properties" },
  { icon: "🌆", name: "Chitwan", color: "from-blue-600 to-purple-600", description: "Nature's Gateway", properties: "60+ Properties" },
];

export default function PopularCities() {
  return (
    <section className="my-20 px-4">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-extrabold text-center mb-16 font-poppins bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent"
      >
        🌟 Popular Cities
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {cities.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -10, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg p-8 transition-all duration-300 min-h-[220px] hover:shadow-2xl hover:border-purple-300/50 dark:hover:border-purple-500/30">
              {/* Animated gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-0 group-hover:opacity-15 transition-all duration-500 rounded-2xl`}></div>

              {/* Floating orb effect */}
              <motion.div
                className={`absolute top-2 right-2 w-3 h-3 bg-gradient-to-r ${c.color} rounded-full opacity-0 group-hover:opacity-80`}
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>

              {/* Icon with enhanced animations */}
              <motion.span
                className="text-6xl mb-4 drop-shadow-lg relative z-10"
                whileHover={{ scale: 1.3, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {c.icon}
              </motion.span>

              {/* City name with gradient */}
              <span className={`font-bold text-xl text-center mb-2 relative z-10 bg-gradient-to-r ${c.color} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                {c.name}
              </span>

              {/* Description */}
              <span className="text-sm text-gray-600 dark:text-gray-300 text-center mb-1 relative z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                {c.description}
              </span>

              {/* Properties count */}
              <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold text-center relative z-10">
                {c.properties}
              </span>

              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-0 group-hover:opacity-25 blur-xl transition-opacity duration-700 rounded-2xl`}></div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
