import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectApi } from '../api/project.api';
import { boardApi } from '../api/board.api';
import { timeTrackingApi } from '../api/timeTracking.api';
import { analyticsApi } from '../api/analytics.api';
import { Loader } from '../components/common/Loader';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Plus,
  Play,
  Square,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [projects, setProjects] = useState([]);
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState(null);

  // Quick Action Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);

  // New Project Form
  const [newProject, setNewProject] = useState({ name: '', description: '', deadline: '' });
  // New Task Form
  const [newTask, setNewTask] = useState({ title: '', project: '', board: '', column: 'To Do', deadline: '', estimatedHours: 2, priority: 'Medium' });
  // Timer Form
  const [selectedTaskForTimer, setSelectedTaskForTimer] = useState('');
  const [activeTimerLog, setActiveTimerLog] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectsRes, boardsRes, userTimeRes] = await Promise.allSettled([
        projectApi.getProjects(),
        boardApi.getBoards(),
        analyticsApi.getUserTimeAnalytics(),
      ]);

      const fetchedProjects = projectsRes.status === 'fulfilled' ? (projectsRes.value?.data || []) : [];
      const fetchedBoards = boardsRes.status === 'fulfilled' ? (boardsRes.value?.data || []) : [];
      setProjects(fetchedProjects);
      setBoards(fetchedBoards);

      if (userTimeRes.status === 'fulfilled' && Array.isArray(userTimeRes.value)) {
        const currentUserStats = userTimeRes.value.find((u) => u.userId === user?._id);
        setUserAnalytics(currentUserStats || null);
      }

      // Fetch tasks for the first available board if exists
      if (fetchedBoards.length > 0) {
        try {
          const tasksRes = await boardApi.getTasks(fetchedBoards[0]._id);
          setTasks(tasksRes?.data || []);
        } catch (err) {
          setTasks([]);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await projectApi.createProject({
        name: newProject.name,
        description: newProject.description,
        deadline: newProject.deadline || null,
      });
      setIsProjectModalOpen(false);
      setNewProject({ name: '', description: '', deadline: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.board) {
      alert('Please select a board');
      return;
    }
    try {
      setSubmitting(true);
      await boardApi.createTask(newTask.board, {
        title: newTask.title,
        project: newTask.project,
        deadline: newTask.deadline,
        estimatedHours: Number(newTask.estimatedHours),
        priority: newTask.priority,
        status: newTask.column,
      });
      setIsTaskModalOpen(false);
      setNewTask({ title: '', project: '', board: '', column: 'To Do', deadline: '', estimatedHours: 2, priority: 'Medium' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartTimer = async () => {
    if (!selectedTaskForTimer) {
      alert('Please select a task to track time.');
      return;
    }
    try {
      setSubmitting(true);
      const res = await timeTrackingApi.startTimer(selectedTaskForTimer);
      setActiveTimerLog(res);
      setIsTimerModalOpen(false);
      alert('Timer started successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start timer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStopTimer = async () => {
    try {
      setSubmitting(true);
      await timeTrackingApi.stopTimer();
      setActiveTimerLog(null);
      alert('Timer stopped and time log recorded!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to stop timer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading productivity dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const completedTasksCount = tasks.filter((t) => t.status === 'Completed').length;
  const totalTrackedHours = userAnalytics ? Number(userAnalytics.totalHours).toFixed(1) : '0.0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', padding: '1.75rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Productivity Suite
            </span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.25rem' }}>
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              Here is your current project velocity and task progress overview.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {activeTimerLog ? (
              <button onClick={handleStopTimer} className="btn btn-danger" disabled={submitting}>
                <Square size={16} /> Stop Active Timer
              </button>
            ) : (
              <button onClick={() => setIsTimerModalOpen(true)} className="btn btn-primary">
                <Play size={16} /> Start Timer
              </button>
            )}
            {(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'projectManager') && (
              <button onClick={() => setIsProjectModalOpen(true)} className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Plus size={16} /> New Project
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-4">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: '#e0e7ff', color: '#4f46e5', borderRadius: '12px' }}>
            <FolderKanban size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Active Projects</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>{projects.length}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: '#e0f2fe', color: '#0284c7', borderRadius: '12px' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Board Tasks</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>{tasks.length}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: '#dcfce7', color: '#16a34a', borderRadius: '12px' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Completed Tasks</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>{completedTasksCount}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: '#fef3c7', color: '#d97706', borderRadius: '12px' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Time Tracked</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>{totalTrackedHours} hrs</h3>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid-2">
        {/* Recent Projects */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Projects</h3>
            <Link to="/projects" style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {projects.length === 0 ? (
            <EmptyState title="No projects created yet" description="Start by creating a new project to organize your tasks." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {projects.slice(0, 5).map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  style={{
                    padding: '0.85rem 1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>{project.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{project.description || 'No description provided'}</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Recent Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '1rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {(user?.role === 'admin' || user?.role === 'manager' || user?.role === 'projectManager') && (
                <button onClick={() => setIsProjectModalOpen(true)} className="btn btn-primary btn-sm">
                  <Plus size={14} /> New Project
                </button>
              )}
              <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-secondary btn-sm">
                <Plus size={14} /> New Task
              </button>
              <button onClick={() => setIsTimerModalOpen(true)} className="btn btn-secondary btn-sm">
                <Play size={14} /> Start Timer
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Tasks Overview</h3>
              <Link to="/tasks" style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                View All <ArrowRight size={14} />
              </Link>
            </div>
            {tasks.length === 0 ? (
              <EmptyState title="No tasks found" description="Select a board or create a new task." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {tasks.slice(0, 4).map((task) => (
                  <div
                    key={task._id}
                    style={{
                      padding: '0.75rem 1rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <h5 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{task.title}</h5>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                    <span className={`badge badge-${task.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: New Project */}
      <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreateProject}>
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input
              type="text"
              className="form-input"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input
              type="date"
              className="form-input"
              value={newProject.deadline}
              onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsProjectModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: New Task */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask}>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Select Project *</label>
              <select
                className="form-select"
                value={newTask.project}
                onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                required
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Select Board *</label>
              <select
                className="form-select"
                value={newTask.board}
                onChange={(e) => setNewTask({ ...newTask, board: e.target.value })}
                required
              >
                <option value="">Select Board</option>
                {boards.map((b) => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Estimated Hours</label>
              <input
                type="number"
                className="form-input"
                min={0}
                value={newTask.estimatedHours}
                onChange={(e) => setNewTask({ ...newTask, estimatedHours: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Deadline *</label>
              <input
                type="date"
                className="form-input"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsTaskModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Start Timer */}
      <Modal isOpen={isTimerModalOpen} onClose={() => setIsTimerModalOpen(false)} title="Start Time Tracking">
        <div>
          <div className="form-group">
            <label className="form-label">Select Task to Track *</label>
            <select
              className="form-select"
              value={selectedTaskForTimer}
              onChange={(e) => setSelectedTaskForTimer(e.target.value)}
            >
              <option value="">-- Choose a Task --</option>
              {tasks.map((t) => (
                <option key={t._id} value={t._id}>{t.title} ({t.status})</option>
              ))}
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsTimerModalOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleStartTimer} disabled={submitting || !selectedTaskForTimer}>
              {submitting ? 'Starting...' : 'Start Timer Now'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
