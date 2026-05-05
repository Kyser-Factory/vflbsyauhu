'use client';
import React from 'react';

export default function DotsSplash() {
  return (
    <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(#80808012_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
    </div>
  );
}
