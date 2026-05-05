'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImageSplashProps {
  src?: string;
  overlayOpacity?: number;
  className?: string;
}

export default function ImageSplash({ 
  src, 
  overlayOpacity = 0.8,
  className 
}: ImageSplashProps) {
  if (!src) return null;

  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
      <motion.img
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        src={src.startsWith('keyword:') 
          ? `https://loremflickr.com/1920/1080/${src.split(':')[1]}` 
          : src}
        alt=""
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://loremflickr.com/1920/1080/industrial,abstract`;
        }}
      />
      <div 
        className="absolute inset-0 bg-background" 
        style={{ opacity: overlayOpacity }} 
      />
    </div>
  );
}
