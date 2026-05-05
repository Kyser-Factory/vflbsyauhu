'use client';
import { useState } from 'react';

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  metadata?: Record<string, any>;
}

export function useLeadCapture() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureLead = async (data: LeadData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: window.location.pathname
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { captureLead, loading, success, error };
}
