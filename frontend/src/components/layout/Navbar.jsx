import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, User, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const pageTitles = {
  '/dashboard': 'Dashboard Overview',
  '/projects': 'Projects Management',
  '/tasks': 'My Tasks',
  '/time-tracking': 'Time Tracking Logs',
  '/analytics': 'Time Analytics & Metrics',
  '/workload': 'Workload & Capacity',
  '/recommendations': 'AI Task Allocations',
  '/profile': 'Profile & Settings',
};

export const Navbar = ({ onToggleSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();

  const title = pageTitles[location.pathname] || (location.pathname.startsWith('/projects/') ? 'Project Details' : location.pathname.startsWith('/boards/') ? 'Kanban Board' : 'SmartKanban');

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-icon" onClick={onToggleSidebar} style={{ display: 'none' }} id="sidebar-toggle-btn">
          <Menu size={20} />
        </button>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a' }}>{title}</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* User Profile Summary */}
        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '8px', transition: 'background 0.15s ease' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#e0e7ff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
              {user?.name || 'User'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize' }}>
              {user?.role || 'Member'}
            </span>
          </div>
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #sidebar-toggle-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
