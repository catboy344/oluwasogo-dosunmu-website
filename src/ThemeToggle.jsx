import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleToggle = () => {
    toggleTheme();
    setHasInteracted(true);
    // Show tooltip briefly when clicked
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => !hasInteracted && setShowTooltip(true)}
      onMouseLeave={() => !hasInteracted && setShowTooltip(false)}
    >
      {/* Animated Button */}
      <motion.button
        onClick={handleToggle}
        whileTap={{ scale: 0.85 }}
        animate={{
          rotate: isDark ? 0 : 360,
        }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all relative"
        style={{
          background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
          boxShadow: isDark 
            ? "0 0 20px rgba(255,255,255,0.05)" 
            : "0 0 20px rgba(0,0,0,0.05)"
        }}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {/* Pulsing glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isDark 
              ? ["0 0 10px rgba(255,255,255,0.1)", "0 0 30px rgba(255,255,255,0.2)", "0 0 10px rgba(255,255,255,0.1)"]
              : ["0 0 10px rgba(0,0,0,0.05)", "0 0 30px rgba(0,0,0,0.1)", "0 0 10px rgba(0,0,0,0.05)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Icon with rotation */}
        <motion.span 
          className="text-lg relative z-10"
          animate={{ 
            scale: isDark ? 1 : 1.2,
            rotate: isDark ? 0 : 180 
          }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          {isDark ? "☀️" : "🌙"}
        </motion.span>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute right-full mr-3 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-body"
            style={{
              background: isDark ? "rgba(20,20,28,0.95)" : "rgba(255,255,255,0.95)",
              border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
              color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
              boxShadow: isDark ? "0 10px 40px rgba(0,0,0,0.5)" : "0 10px 40px rgba(0,0,0,0.1)"
            }}
          >
            <div className="flex items-center gap-2">
              <span>{isDark ? "Switch to Light" : "Switch to Dark"}</span>
              <span className="text-xs opacity-50">☀️ ↔ 🌙</span>
            </div>
            {/* Small triangle pointer */}
            <div 
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full"
              style={{
                borderLeft: `8px solid ${isDark ? "rgba(20,20,28,0.95)" : "rgba(255,255,255,0.95)"}`,
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
