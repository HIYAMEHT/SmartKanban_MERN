import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({ title = 'No data available', description, action }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', textAlign: 'center', background: '#ffffff', borderRadius: '12px', border: '1px border #e2e8f0' }}>
      <div style={{ padding: '0.75rem', background: '#f1f5f9', borderRadius: '50%', color: '#64748b', marginBottom: '0.75rem' }}>
        <Inbox size={28} />
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>{title}</h3>
      {description && <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '360px', marginBottom: action ? '1rem' : 0 }}>{description}</p>}
      {action}
    </div>
  );
};
