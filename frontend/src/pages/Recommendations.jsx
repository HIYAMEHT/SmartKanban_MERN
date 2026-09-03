import React, { useState, useEffect } from 'react';
import { recommendationApi } from '../api/recommendation.api';
import { boardApi } from '../api/board.api';
import { projectApi } from '../api/project.api';
import { Loader } from '../components/common/Loader';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Lightbulb, Sparkles, UserCheck, CheckCircle2, AlertTriangle, Code, Award } from 'lucide-react';

export const Recommendations = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [recommendationData, setRecommendationData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assigning, setAssigning] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const projRes = await projectApi.getProjects();
      if (projRes.data?.length > 0) {
        const boardsRes = await boardApi.getBoards();
        if (boardsRes.data?.length > 0) {
          const tRes = await boardApi.getTasks(boardsRes.data[0]._id);
          const unassignedOrAll = tRes.data || [];
          setTasks(unassignedOrAll);
          if (unassignedOrAll.length > 0) {
            setSelectedTaskId(unassignedOrAll[0]._id);
            fetchRecommendationsForTask(unassignedOrAll[0]._id);
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks for recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendationsForTask = async (taskId) => {
    if (!taskId) return;
    try {
      setLoading(true);
      const res = await recommendationApi.getTaskRecommendations(taskId);
      setRecommendationData(res.data || null);
    } catch (err) {
      setRecommendationData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskChange = (taskId) => {
    setSelectedTaskId(taskId);
    fetchRecommendationsForTask(taskId);
  };

  const handleAssignTask = async (userId) => {
    if (!selectedTaskId || !userId) return;
    try {
      setAssigning(true);
      const res = await recommendationApi.assignTask(selectedTaskId, userId);
      alert(res.message || 'Task assigned successfully!');
      fetchRecommendationsForTask(selectedTaskId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign task.');
    } finally {
      setAssigning(false);
    }
  };

  if (loading && tasks.length === 0) return <Loader message="Analyzing AI task allocation recommendations..." />;
  if (error) return <ErrorState message={error} onRetry={fetchTasks} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)', color: '#ffffff', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.15)', borderRadius: '12px' }}>
            <Sparkles size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600, textTransform: 'uppercase' }}>
              Smart Intelligence
            </span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.15rem' }}>
              AI Task Allocation Recommendations
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#c7d2fe', marginTop: '0.2rem' }}>
              Optimal team member matching based on required skills, active capacity, and workload balance score.
            </p>
          </div>
        </div>
      </div>

      {/* Task Selector Bar */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>Select Task for Allocation Analysis:</label>
        <select
          className="form-select"
          style={{ maxWidth: '360px' }}
          value={selectedTaskId}
          onChange={(e) => handleTaskChange(e.target.value)}
        >
          {tasks.map((t) => (
            <option key={t._id} value={t._id}>{t.title} ({t.priority} Priority)</option>
          ))}
        </select>
      </div>

      {/* Target Task Summary Card */}
      {recommendationData?.task && (
        <div className="card" style={{ borderLeft: '4px solid #4f46e5' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
            Task: {recommendationData.task.title}
          </h3>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#64748b' }}>
            <span>Est. Hours: <strong>{recommendationData.task.estimatedHours || 0}h</strong></span>
            <span>Required Skills: <strong>{recommendationData.task.skillsRequired?.join(', ') || 'None specified'}</strong></span>
            <span>Deadline: <strong>{recommendationData.task.deadline ? new Date(recommendationData.task.deadline).toLocaleDateString() : 'N/A'}</strong></span>
          </div>
        </div>
      )}

      {/* Recommendations Cards Grid */}
      {!recommendationData || !recommendationData.recommendations || recommendationData.recommendations.length === 0 ? (
        <EmptyState title="No member recommendations available" description="Ensure project members have skills and availability set in their profiles." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recommendationData.recommendations.map((rec, idx) => {
            const suitabilityBadgeClass =
              rec.suitability === 'Perfect Match' ? 'badge-completed' : rec.suitability === 'Risk of Overload' ? 'badge-high' : 'badge-in-progress';

            return (
              <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  
                  {/* Member info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: '#e0e7ff',
                        color: '#4f46e5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                      }}
                    >
                      {rec.member?.name ? rec.member.name.charAt(0).toUpperCase() : 'M'}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>{rec.member?.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{rec.member?.email}</span>
                    </div>
                  </div>

                  {/* Suitability & Score */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${suitabilityBadgeClass}`} style={{ fontSize: '0.8rem', padding: '0.25rem 0.65rem' }}>
                        {rec.suitability}
                      </span>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4f46e5', marginTop: '0.25rem' }}>
                        Score: {rec.score} / 100
                      </div>
                    </div>

                    <button
                      onClick={() => handleAssignTask(rec.member._id)}
                      className="btn btn-primary btn-sm"
                      disabled={assigning}
                    >
                      <UserCheck size={14} /> Assign Task
                    </button>
                  </div>
                </div>

                {/* Recommendation Comment & telemetry */}
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                  <p style={{ color: '#0f172a', fontWeight: 500, marginBottom: '0.5rem' }}>{rec.comment}</p>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: '#64748b', fontSize: '0.8rem' }}>
                    <span>Skill Match: <strong>{rec.skillMatchPercentage}%</strong> ({rec.matchedSkills?.join(', ') || 'None'})</span>
                    <span>Active Hours: <strong>{rec.activeHours}h</strong></span>
                    <span>Remaining Capacity: <strong>{rec.remainingCapacity}h</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
