import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorState = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#991b1b', margin: '1rem 0' }}>
      <AlertCircle size={24} style={{ marginBottom: '0.5rem' }} />
      <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: onRetry ? '0.75rem' : 0 }}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary btn-sm" style={{ borderColor: '#fca5a5', color: '#991b1b' }}>
          Try Again
        </button>
      )}
    </div>
  );
};
