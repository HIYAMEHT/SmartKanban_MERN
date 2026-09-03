import React, { useState, useEffect } from 'react';
import { workloadApi } from '../api/workload.api';
import { projectApi } from '../api/project.api';
import { boardApi } from '../api/board.api';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Users, AlertTriangle, Gauge, Calendar, CheckCircle2, ShieldAlert } from 'lucide-react';

export const Workload = () => {
  const { user } = useAuth();
  const [overloadedMembers, setOverloadedMembers] = useState([]);
  const [userCapacity, setUserCapacity] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectWorkload, setProjectWorkload] = useState(null);
  const [deadlinePrediction, setDeadlinePrediction] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [projectTasks, setProjectTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkloadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [overloadedRes, projRes, capacityRes] = await Promise.allSettled([
        workloadApi.getOverloadedMembers(),
        projectApi.getProjects(),
        user?._id ? workloadApi.getMemberCapacity(user._id) : Promise.reject(),
      ]);

      if (overloadedRes.status === 'fulfilled') setOverloadedMembers(overloadedRes.value.data || []);
      if (capacityRes.status === 'fulfilled') setUserCapacity(capacityRes.value.data || null);

      const fetchedProjects = projRes.status === 'fulfilled' ? (projRes.value.data || []) : [];
      setProjects(fetchedProjects);

      if (fetchedProjects.length > 0) {
        const firstProjId = fetchedProjects[0]._id;
        setSelectedProjectId(firstProjId);
        const pwRes = await workloadApi.getProjectWorkload(firstProjId);
        setProjectWorkload(pwRes.data || null);

        const boardsRes = await boardApi.getBoards();
        if (boardsRes.data?.length > 0) {
          const tRes = await boardApi.getTasks(boardsRes.data[0]._id);
          setProjectTasks(tRes.data || []);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load workload information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkloadData();
  }, []);

  const handleSelectProject = async (projId) => {
    setSelectedProjectId(projId);
    if (!projId) return;
    try {
      const res = await workloadApi.getProjectWorkload(projId);
      setProjectWorkload(res.data || null);
    } catch (err) {
      setProjectWorkload(null);
    }
  };

  const handlePredictDeadline = async (taskId) => {
    setSelectedTaskId(taskId);
    if (!taskId) {
      setDeadlinePrediction(null);
      return;
    }
    try {
      const res = await workloadApi.getDeadlinePrediction(taskId);
      setDeadlinePrediction(res.data || null);
    } catch (err) {
      setDeadlinePrediction(null);
    }
  };

  if (loading) return <Loader message="Analyzing team workload & capacity..." />;
  if (error) return <ErrorState message={error} onRetry={fetchWorkloadData} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Smart Workload & Capacity</h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Monitor team bandwidth, velocity ratios, and deadline risks</p>
      </div>

      {/* User Capacity Card (If Available) */}
      {userCapacity && (
        <div className="card" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase' }}>My Capacity Profile</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '0.2rem' }}>
                {userCapacity.member?.name || 'My Workload'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#c7d2fe', marginTop: '0.2rem' }}>
                Capacity Status: <strong style={{ color: userCapacity.status === 'Overloaded' ? '#f87171' : '#4ade80' }}>{userCapacity.status}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '0.65rem 1.25rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Load %</span>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{userCapacity.loadPercentage}%</h4>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '0.65rem 1.25rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Velocity Ratio</span>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{userCapacity.velocityRatio}x</h4>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '0.65rem 1.25rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Completed Tasks</span>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{userCapacity.completedTasksCount}</h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Overloaded Members Alert & Deadline Predictor */}
      <div className="grid-2">
        {/* Overloaded Members Alert List */}
        <div className="card" style={{ borderTop: '4px solid #ef4444' }}>
          <h3 className="card-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c' }}>
            <ShieldAlert size={20} color="#ef4444" /> Overloaded Team Members
          </h3>
          {overloadedMembers.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#16a34a', padding: '1rem 0', fontWeight: 500 }}>
              No team members are currently overloaded!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {overloadedMembers.map((item, idx) => (
                <div key={idx} style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#991b1b' }}>{item.member?.name || 'Member'}</h5>
                    <span style={{ fontSize: '0.75rem', color: '#7f1d1d' }}>
                      Active Tasks: {item.activeTasksCount} | Active Hours: {item.activeHours}h
                    </span>
                  </div>
                  <span className="badge badge-high">
                    +{item.overloadDelta}h Over Capacity
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deadline Predictor Tool */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="#4f46e5" /> AI Deadline Risk Predictor
          </h3>
          <div className="form-group">
            <label className="form-label">Select Task to Predict Risk:</label>
            <select
              className="form-select"
              value={selectedTaskId}
              onChange={(e) => handlePredictDeadline(e.target.value)}
            >
              <option value="">-- Choose Task --</option>
              {projectTasks.map((t) => (
                <option key={t._id} value={t._id}>{t.title} ({t.status})</option>
              ))}
            </select>
          </div>

          {deadlinePrediction && (
            <div style={{ padding: '1rem', background: deadlinePrediction.status === 'At Risk' ? '#fef2f2' : '#f0fdf4', border: `1px solid ${deadlinePrediction.status === 'At Risk' ? '#fecaca' : '#bbf7d0'}`, borderRadius: '8px', marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h5 style={{ fontSize: '0.95rem', fontWeight: 600, color: deadlinePrediction.status === 'At Risk' ? '#991b1b' : '#166534' }}>
                  {deadlinePrediction.taskTitle || 'Task'}
                </h5>
                <span className={`badge ${deadlinePrediction.status === 'At Risk' ? 'badge-high' : 'badge-completed'}`}>
                  {deadlinePrediction.status}
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.4 }}>
                {deadlinePrediction.message || `Estimated working days needed: ${deadlinePrediction.daysNeeded || 0} days.`}
              </p>
              {deadlinePrediction.delayDays > 0 && (
                <p style={{ fontSize: '0.8rem', color: '#b91c1c', fontWeight: 600, marginTop: '0.35rem' }}>
                  Predicted Delay: +{deadlinePrediction.delayDays} calendar days past target deadline!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Project Workload Distribution */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Project Team Workload Breakdown</h3>
          <select
            className="form-select"
            style={{ width: '220px' }}
            value={selectedProjectId}
            onChange={(e) => handleSelectProject(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        {!projectWorkload ? (
          <p style={{ fontSize: '0.875rem', color: '#64748b', padding: '1rem 0' }}>Select a project to view team workload breakdown.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Active Tasks</th>
                  <th>Total Active Hours</th>
                  <th>Capacity Status</th>
                </tr>
              </thead>
              <tbody>
                {projectWorkload.membersWorkload?.map((m, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{m.member?.name || 'Member'}</td>
                    <td>{m.activeTasksCount}</td>
                    <td>{m.activeHours} hrs</td>
                    <td>
                      <span className={`badge ${m.overloaded ? 'badge-high' : 'badge-completed'}`}>
                        {m.overloaded ? 'Overloaded' : 'Optimal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
