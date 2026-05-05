'use client';

import { motion } from 'framer-motion';

export default function BeamSplash() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%]">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, rotate: 30 + i * 15 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1],
              rotate: [30 + i * 15, 35 + i * 15, 30 + i * 15]
            }}
            transition={{ 
              duration: 10 + i * 2, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.5
            }}
            className="absolute top-1/2 left-1/2 w-[200%] h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent origin-left"
            style={{ transform: `translate(-50%, -50%) rotate(${30 + i * 15}deg)` }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-background/50 to-background" />
    </div>
  );
}
