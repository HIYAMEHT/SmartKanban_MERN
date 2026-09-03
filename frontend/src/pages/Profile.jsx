import React, { useState, useEffect } from 'react';
import { userApi } from '../api/user.api';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';
import { ErrorState } from '../components/common/ErrorState';
import { User, Mail, Code, Clock, Sparkles, Save, CheckCircle2 } from 'lucide-react';

export const Profile = () => {
  const { user, updateUserState } = useAuth();

  const [profileData, setProfileData] = useState({ name: '', email: '', bio: '' });
  const [skills, setSkills] = useState([]);
  const [skillsInput, setSkillsInput] = useState('');
  const [availability, setAvailability] = useState({ status: 'available', hoursPerDay: 8 });
  const [intelligence, setIntelligence] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSkills, setSavingSkills] = useState(false);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadProfileDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const [profRes, skRes, avRes] = await Promise.all([
        userApi.getProfile(),
        userApi.getSkills(),
        userApi.getAvailability(),
      ]);

      if (profRes.data) {
        setProfileData({
          name: profRes.data.name || '',
          email: profRes.data.email || '',
          bio: profRes.data.bio || '',
        });
      }

      if (skRes.data?.skills) {
        setSkills(skRes.data.skills);
        setSkillsInput(skRes.data.skills.join(', '));
      }

      if (avRes.data?.availability) {
        setAvailability(avRes.data.availability);
      }

      if (user?._id) {
        try {
          const intelRes = await userApi.getUserIntelligence(user._id);
          setIntelligence(intelRes.data || null);
        } catch (err) {
          setIntelligence(null);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileDetails();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await userApi.updateProfile({
        name: profileData.name,
        bio: profileData.bio,
      });
      updateUserState(res.data);
      triggerSuccess('Profile details updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdateSkills = async (e) => {
    e.preventDefault();
    try {
      setSavingSkills(true);
      const skillArray = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await userApi.updateSkills(skillArray);
      setSkills(res.data?.skills || []);
      triggerSuccess('Skills updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update skills.');
    } finally {
      setSavingSkills(false);
    }
  };

  const handleUpdateAvailability = async (e) => {
    e.preventDefault();
    try {
      setSavingAvailability(true);
      const res = await userApi.updateAvailability({
        status: availability.status,
        hoursPerDay: Number(availability.hoursPerDay) || 8,
      });
      setAvailability(res.data?.availability || availability);
      triggerSuccess('Availability updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update availability.');
    } finally {
      setSavingAvailability(false);
    }
  };

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  if (loading) return <Loader message="Loading profile settings..." />;
  if (error) return <ErrorState message={error} onRetry={loadProfileDetails} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '900px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Profile & Preferences</h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Manage your personal details, skills, and daily capacity settings</p>
      </div>

      {successMsg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      {/* Profile Details Form */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={20} color="#4f46e5" /> Profile Information
        </h3>
        <form onSubmit={handleUpdateProfile}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                className="form-input"
                value={profileData.email}
                disabled
                style={{ background: '#f1f5f9', color: '#64748b' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Bio</label>
            <textarea
              className="form-textarea"
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              rows={3}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={savingProfile}>
            <Save size={16} /> {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Skills Management */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code size={20} color="#0284c7" /> Skills & Technical Stack
        </h3>
        <form onSubmit={handleUpdateSkills}>
          <div className="form-group">
            <label className="form-label">Skills (comma separated string)</label>
            <input
              type="text"
              className="form-input"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. React, Node.js, MongoDB, Docker"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {skills.map((skill, idx) => (
              <span key={idx} className="badge badge-in-progress" style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}>
                {skill}
              </span>
            ))}
          </div>

          <button type="submit" className="btn btn-primary" disabled={savingSkills}>
            <Save size={16} /> {savingSkills ? 'Updating...' : 'Update Skills'}
          </button>
        </form>
      </div>

      {/* Availability Management */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} color="#d97706" /> Availability & Daily Capacity
        </h3>
        <form onSubmit={handleUpdateAvailability}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={availability.status}
                onChange={(e) => setAvailability({ ...availability, status: e.target.value })}
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Working Hours Per Day</label>
              <input
                type="number"
                className="form-input"
                min={0}
                max={24}
                value={availability.hoursPerDay}
                onChange={(e) => setAvailability({ ...availability, hoursPerDay: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={savingAvailability}>
            <Save size={16} /> {savingAvailability ? 'Updating...' : 'Update Availability'}
          </button>
        </form>
      </div>

      {/* Intelligence Summary */}
      {intelligence && (
        <div className="card" style={{ background: '#f8fafc' }}>
          <h3 className="card-title" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="#4f46e5" /> User Telemetry Intelligence
          </h3>
          <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', gap: '1.5rem' }}>
            <span>Role: <strong style={{ color: '#0f172a' }}>{intelligence.role}</strong></span>
            <span>Total Skills Tagged: <strong style={{ color: '#0f172a' }}>{intelligence.skills?.length || 0}</strong></span>
            <span>Capacity Status: <strong style={{ color: '#0f172a' }}>{intelligence.availability?.status}</strong></span>
          </div>
        </div>
      )}

    </div>
  );
};
