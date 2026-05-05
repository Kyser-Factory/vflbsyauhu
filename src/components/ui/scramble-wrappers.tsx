"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SmoothReplaceProps {
  messages: string[];
  averageDelayMs?: number;
  className?: string;
}

export const SmoothReplace = ({ 
  messages, 
  averageDelayMs = 3000, 
  className 
}: SmoothReplaceProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, averageDelayMs);
    return () => clearInterval(interval);
  }, [messages.length, averageDelayMs]);

  return (
    <span className={className}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="inline-block text-accent font-black italic"
        >
          {messages[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
