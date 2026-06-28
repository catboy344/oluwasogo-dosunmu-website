import React from 'react';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
      style={{
        background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
        color: isDark ? "#ffffff" : "#000000",
        fontSize: "16px"
      }}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? "☀️" : "🌙"}
    </motion.button>
  );
};

export default ThemeToggle;
