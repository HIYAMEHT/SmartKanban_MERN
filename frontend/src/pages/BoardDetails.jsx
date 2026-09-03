import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { boardApi } from '../api/board.api';
import { taskApi } from '../api/task.api';
import { projectApi } from '../api/project.api';
import { timeTrackingApi } from '../api/timeTracking.api';
import { Loader } from '../components/common/Loader';
import { ErrorState } from '../components/common/ErrorState';
import { Modal } from '../components/common/Modal';
import {
  KanbanSquare,
  Plus,
  Clock,
  User,
  Calendar,
  AlertCircle,
  Play,
  Trash2,
  MoveRight,
} from 'lucide-react';

export const BoardDetails = () => {
  const { boardId } = useParams();

  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Task Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskColumn, setNewTaskColumn] =
  useState("todo");
  const [taskForm, setTaskForm] = useState({
  title: "",
  description: "",
  project: "",
  priority: "medium",
  estimatedHours: 2,
  deadline: "",
  skillsRequired: "",
});

  const [submitting, setSubmitting] = useState(false);

  const fetchBoardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [boardRes, tasksRes, projRes] = await Promise.all([
        boardApi.getBoard(boardId),
        boardApi.getTasks(boardId),
        projectApi.getProjects(),
      ]);

      setBoard(boardRes.data);
      setTasks(tasksRes.data || []);
      setProjects(projRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load Kanban board.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, [boardId]);

  const handleOpenTaskModal = (columnName) => {
    setNewTaskColumn(columnName);
    setTaskForm({
      title: '',
      description: '',
      project: projects.length > 0 ? projects[0]._id : '',
      priority: 'Medium',
      estimatedHours: 2,
      deadline: '',
      skillsRequired: '',
    });
    setIsTaskModalOpen(true);
  };

const handleCreateTask = async (e) => {
  e.preventDefault();

  if (!taskForm.project) {
    alert(
      "Please select a project for this task"
    );
    return;
  }

  try {
    setSubmitting(true);

    await boardApi.createTask(
      boardId,
      {
        title: taskForm.title.trim(),

        description:
          taskForm.description.trim(),

        project: taskForm.project,

        priority:
          taskForm.priority,

        estimatedHours:
          Number(
            taskForm.estimatedHours
          ) || 0,

        deadline:
          taskForm.deadline || null,

        skillsRequired:
          taskForm.skillsRequired
            ? taskForm.skillsRequired
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],

        column: newTaskColumn,

        status: newTaskColumn,
      }
    );

    setIsTaskModalOpen(false);

    await fetchBoardData();
  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
        "Failed to create task."
    );
  } finally {
    setSubmitting(false);
  }
};

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      fetchBoardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await boardApi.deleteTask(taskId);
      fetchBoardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task.');
    }
  };

  const handleStartTimer = async (taskId) => {
    try {
      await timeTrackingApi.startTimer(taskId);
      alert('Timer started for task!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start timer.');
    }
  };

  if (loading) return <Loader message="Loading Kanban board..." />;
  if (error) return <ErrorState message={error} onRetry={fetchBoardData} />;

  // Dynamic columns from board or fallback
  const columnsList = board?.columns?.length > 0
    ? board.columns.map((c) => c.name)
    : ['To Do', 'In Progress', 'Review', 'Completed'];

  const statusOptions = ['To Do', 'In Progress', 'Review', 'Completed'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      
      {/* Board Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <KanbanSquare size={22} color="#4f46e5" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{board.name}</h1>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.2rem' }}>
            {board.description || 'Interactive project Kanban workflow board'}
          </p>
        </div>

        <button onClick={() => handleOpenTaskModal('To Do')} className="btn btn-primary">
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* Kanban Board Container (Horizontally Scrollable) */}
      <div
        style={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(280px, 340px)',
          gap: '1.25rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
          alignItems: 'start',
        }}
      >
        {columnsList.map((colName) => {
          const colTasks = tasks.filter((t) => (t.column === colName || t.status === colName || (colName === 'Done' && t.status === 'Completed')));

          return (
            <div
              key={colName}
              style={{
                background: '#f1f5f9',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 'calc(100vh - 220px)',
              }}
            >
              {/* Column Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>{colName}</h3>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, background: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: '9999px', color: '#64748b' }}>
                    {colTasks.length}
                  </span>
                </div>
                <button className="btn-icon" onClick={() => handleOpenTaskModal(colName)} title={`Add task to ${colName}`}>
                  <Plus size={16} />
                </button>
              </div>

              {/* Task Cards Column Body */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', overflowY: 'auto', paddingRight: '0.2rem' }}>
                {colTasks.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', border: '2px dashed #cbd5e1', borderRadius: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
                    No tasks in {colName}
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task._id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '1rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>{task.title}</h4>
                        <button className="btn-icon" onClick={() => handleDeleteTask(task._id)} style={{ color: '#ef4444' }} title="Delete task">
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {task.description && (
                        <p style={{ fontSize: '0.8rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {task.description}
                        </p>
                      )}

                      {/* Badges Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className={`badge badge-${(task.priority || 'medium').toLowerCase()}`}>
                          {task.priority || 'Medium'}
                        </span>
                        {task.estimatedHours > 0 && (
                          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Clock size={12} /> {task.estimatedHours}h
                          </span>
                        )}
                      </div>

                      {/* Footer Info */}
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <User size={13} />
                          <span>{task.assignee?.name || 'Unassigned'}</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <button className="btn-icon" onClick={() => handleStartTimer(task._id)} title="Start tracking time">
                            <Play size={13} color="#4f46e5" />
                          </button>
                          
                          {/* Quick Status Select */}
                          <select
                            value={task.status || colName}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            style={{ fontSize: '0.75rem', padding: '0.15rem 0.35rem', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff' }}
                          >
                            {statusOptions.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: New Task */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title={`Add Task to Column: ${newTaskColumn}`}>
        <form onSubmit={handleCreateTask}>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select Project *</label>
            <select
              className="form-select"
              value={taskForm.project}
              onChange={(e) => setTaskForm({ ...taskForm, project: e.target.value })}
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Hours</label>
              <input
                type="number"
                className="form-input"
                min={0}
                value={taskForm.estimatedHours}
                onChange={(e) => setTaskForm({ ...taskForm, estimatedHours: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Deadline *</label>
            <input
              type="date"
              className="form-input"
              value={taskForm.deadline}
              onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsTaskModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
