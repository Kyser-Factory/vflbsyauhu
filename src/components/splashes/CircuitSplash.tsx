'use client';

import { motion } from 'framer-motion';

export default function CircuitSplash() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-20">
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 0 10 H 20 V 30 H 40 V 10 H 60 V 50 H 80 V 30 H 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/30" />
          <circle cx="20" cy="30" r="1.5" className="fill-primary/40" />
          <circle cx="60" cy="50" r="1.5" className="fill-primary/40" />
          <circle cx="80" cy="30" r="1.5" className="fill-primary/40" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"
      />
    </div>
  );
}
