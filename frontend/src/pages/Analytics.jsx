import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../api/analytics.api';
import { Loader } from '../components/common/Loader';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, AlertTriangle, Users, FolderKanban, CheckSquare } from 'lucide-react';

export const Analytics = () => {
  const [taskData, setTaskData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [bottleneckData, setBottleneckData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tRes, uRes, pRes, bRes] = await Promise.allSettled([
        analyticsApi.getTaskTimeAnalytics(),
        analyticsApi.getUserTimeAnalytics(),
        analyticsApi.getProjectTimeAnalytics(),
        analyticsApi.getBottleneckAnalytics(),
      ]);

      if (tRes.status === 'fulfilled') setTaskData(tRes.value || []);
      if (uRes.status === 'fulfilled') setUserData(uRes.value || []);
      if (pRes.status === 'fulfilled') setProjectData(pRes.value || []);
      if (bRes.status === 'fulfilled') setBottleneckData(bRes.value || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <Loader message="Analyzing productivity metrics..." />;
  if (error) return <ErrorState message={error} onRetry={fetchAnalytics} />;

  // Prepare chart data objects safely formatted
  const formattedTaskChart = taskData.map((d) => ({
    name: d.title || 'Task',
    Estimated: Number(d.estimatedHours || 0),
    Actual: Number((d.actualHours || 0).toFixed(1)),
  }));

  const formattedUserChart = userData.map((d) => ({
    name: d.name || 'User',
    Hours: Number((d.totalHours || 0).toFixed(1)),
  }));

  const formattedProjectChart = projectData.map((d) => ({
    name: d.projectName || 'Project',
    Estimated: Number(d.estimatedHours || 0),
    Actual: Number((d.actualHours || 0).toFixed(1)),
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Time & Bottleneck Analytics</h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Real-time telemetry and estimates vs actual duration metrics</p>
      </div>

      {/* Grid 1: Project Time & User Time Charts */}
      <div className="grid-2">
        {/* Project Time Analytics */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FolderKanban size={20} color="#4f46e5" /> Project Estimated vs Actual Hours
          </h3>
          {formattedProjectChart.length === 0 ? (
            <EmptyState title="No project time logs yet" description="Log time on project tasks to visualize data." />
          ) : (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedProjectChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Estimated" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Actual" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* User Time Analytics */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="#0284c7" /> User Tracked Hours
          </h3>
          {formattedUserChart.length === 0 ? (
            <EmptyState title="No user time logs yet" description="No hours recorded by team members." />
          ) : (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedUserChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="Hours" fill="#0284c7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Grid 2: Task Time Analytics & Bottleneck Ranking */}
      <div className="grid-2">
        {/* Task Time Analytics */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckSquare size={20} color="#16a34a" /> Task Time Details
          </h3>
          {taskData.length === 0 ? (
            <EmptyState title="No task time data" description="Complete task timer sessions to view details." />
          ) : (
            <div className="table-container" style={{ maxHeight: '280px', overflowY: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Task Title</th>
                    <th>Estimated</th>
                    <th>Actual</th>
                    <th>Diff</th>
                  </tr>
                </thead>
                <tbody>
                  {taskData.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{item.title}</td>
                      <td>{item.estimatedHours}h</td>
                      <td>{item.actualHours ? item.actualHours.toFixed(1) : 0}h</td>
                      <td>
                        <span className={`badge ${item.differenceHours > 0 ? 'badge-high' : 'badge-completed'}`}>
                          {item.differenceHours ? item.differenceHours.toFixed(1) : 0}h
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bottleneck Analytics */}
        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <h3 className="card-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c' }}>
            <AlertTriangle size={20} color="#ef4444" /> Bottleneck Warning Tasks
          </h3>
          {bottleneckData.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#16a34a', padding: '1rem 0', fontWeight: 500 }}>
              No bottlenecks detected! All tasks completed within expected estimate thresholds.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto' }}>
              {bottleneckData.map((item, idx) => (
                <div key={idx} style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#991b1b' }}>{item.taskTitle}</h5>
                    <span style={{ fontSize: '0.75rem', color: '#7f1d1d' }}>
                      Est: {item.estimatedHours}h | Act: {item.actualHours ? item.actualHours.toFixed(1) : 0}h
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-high" style={{ fontSize: '0.75rem' }}>
                      +{item.exceededByPercentage ? item.exceededByPercentage.toFixed(0) : 0}% Exceeded
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
