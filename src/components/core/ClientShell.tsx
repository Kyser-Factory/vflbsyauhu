'use client';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <SimpleBar style={{ maxHeight: '100vh' }} autoHide={false} className="h-full">
      {children}
    </SimpleBar>
  );
}
