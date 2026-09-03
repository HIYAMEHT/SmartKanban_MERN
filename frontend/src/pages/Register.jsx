import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, User, Mail, Lock, Briefcase, Code, Clock } from 'lucide-react';

export const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    role: 'user',
    skills: '',
    availabilityStatus: 'available',
    hoursPerDay: 8,
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      bio: formData.bio.trim(),
      role: formData.role,
      skills: formData.skills
        ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      availability: {
        status: formData.availabilityStatus,
        hoursPerDay: Number(formData.hoursPerDay) || 8,
      },
    };

    try {
      setSubmitting(true);
      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '520px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.25rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.6rem', background: '#4f46e5', borderRadius: '12px', color: '#ffffff', marginBottom: '0.75rem' }}>
            <Sparkles size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Create Your Account</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Join SmartKanban to streamline project workflow</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  style={{ paddingLeft: '2.35rem' }}
                  placeholder="Rohan Verma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <select
                  name="role"
                  className="form-select"
                  style={{ paddingLeft: '2.35rem' }}
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">User / Developer</option>
                  <option value="projectManager">Project Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                name="email"
                className="form-input"
                style={{ paddingLeft: '2.35rem' }}
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                name="password"
                className="form-input"
                style={{ paddingLeft: '2.35rem' }}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skills (comma separated)</label>
            <div style={{ position: 'relative' }}>
              <Code size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                name="skills"
                className="form-input"
                style={{ paddingLeft: '2.35rem' }}
                placeholder="React, Node.js, MongoDB"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Availability Status</label>
              <select
                name="availabilityStatus"
                className="form-select"
                value={formData.availabilityStatus}
                onChange={handleChange}
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Hours / Day</label>
              <div style={{ position: 'relative' }}>
                <Clock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="number"
                  name="hoursPerDay"
                  className="form-input"
                  style={{ paddingLeft: '2.35rem' }}
                  min={0}
                  max={24}
                  value={formData.hoursPerDay}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Bio (optional)</label>
            <textarea
              name="bio"
              className="form-textarea"
              placeholder="Tell us briefly about your experience..."
              value={formData.bio}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: '100%', padding: '0.65rem', fontSize: '0.95rem' }}
          >
            {submitting ? 'Creating account...' : 'Complete Registration'}
            {!submitting && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4f46e5', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
