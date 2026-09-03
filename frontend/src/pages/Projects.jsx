import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectApi } from '../api/project.api';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { FolderKanban, Plus, Calendar, Users, Trash2, Edit, ExternalLink } from 'lucide-react';

export const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create / Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', deadline: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectApi.getProjects();
      setProjects(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({ name: '', description: '', deadline: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project, e) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingProject(project);
    setFormData({
      name: project.name || '',
      description: project.description || '',
      deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingProject) {
        await projectApi.updateProject(editingProject._id, formData);
      } else {
        await projectApi.createProject(formData);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (projectId, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectApi.deleteProject(projectId);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project.');
    }
  };

  if (loading) return <Loader message="Fetching projects..." />;
  if (error) return <ErrorState message={error} onRetry={fetchProjects} />;

  const canCreate = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'projectManager';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Projects</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Manage your workspace projects and team members</p>
        </div>
        {canCreate && (
          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            <Plus size={16} /> Create Project
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <EmptyState
          title="No projects created yet"
          description="Get started by creating a new project for your team."
          action={
            canCreate && (
              <button onClick={handleOpenCreateModal} className="btn btn-primary btn-sm">
                <Plus size={14} /> Create Project
              </button>
            )
          }
        />
      ) : (
        <div className="grid-3">
          {projects.map((project) => (
            <div key={project._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ padding: '0.5rem', background: '#e0e7ff', color: '#4f46e5', borderRadius: '8px' }}>
                    <FolderKanban size={20} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button className="btn-icon" onClick={(e) => handleOpenEditModal(project, e)} title="Edit project">
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon" onClick={(e) => handleDelete(project._id, e)} title="Delete project" style={{ color: '#ef4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.35rem' }}>
                  {project.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                  {project.description || 'No description provided.'}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748b' }}>
                  <Users size={15} />
                  <span>{project.members ? project.members.length : 0} members</span>
                </div>
                <Link to={`/projects/${project._id}`} className="btn btn-secondary btn-sm">
                  Open Details <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProject ? 'Edit Project' : 'Create New Project'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Deadline</label>
            <input
              type="date"
              className="form-input"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
