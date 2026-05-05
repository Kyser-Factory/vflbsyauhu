'use client';
import React from 'react';

export default function GradientSplash() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-background">
      <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full bg-tertiary/10 blur-[120px]" />
    </div>
  );
}
