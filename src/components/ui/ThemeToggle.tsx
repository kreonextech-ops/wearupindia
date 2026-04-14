'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium Theme Toggle component.
 * Features smooth Framer Motion transitions and Lucide icons.
 */
export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-10 h-10 flex items-center justify-center rounded-full bg-muted border border-border text-foreground hover:bg-wu-red/10 hover:border-wu-red transition-all duration-300 group overflow-hidden"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: 20, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.3, ease: 'backOut' }}
          className="relative z-10"
        >
          {isDark ? (
            <Sun size={18} className="group-hover:text-wu-red transition-colors" />
          ) : (
            <Moon size={18} className="group-hover:text-wu-red transition-colors" />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Background Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-wu-red/0 to-wu-red/0 group-hover:from-wu-red/5 group-hover:to-transparent transition-all duration-500" />
    </button>
  );
}
