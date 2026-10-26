import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import {
  ArrowLeft,
  Users,
  Calendar,
  FlaskConical,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import './ProjectDetail.css';

const statusColors = {
  Open: 'badge-success',
  Ongoing: 'badge-warning',
  Closed: 'badge-danger',
  Completed: 'badge-primary',
};

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: '', deadline: '' });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await API.get(`/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleSendRequest = async () => {
    setSendingRequest(true);
    try {
      await API.post('/collaboration-requests', {
        projectId: id,
        message: requestMessage,
      });
      setRequestSent(true);
      setShowRequestForm(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request.');
    } finally {
      setSendingRequest(false);
    }
  };

  const handleAddMilestone = async () => {
    try {
      const res = await API.post(`/projects/${id}/milestones`, newMilestone);
      setProject({ ...project, milestones: res.data });
      setShowAddMilestone(false);
      setNewMilestone({ title: '', deadline: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add milestone.');
    }
  };

  const handleUpdateMilestone = async (mid, updates) => {
    try {
      const res = await API.put(`/projects/${id}/milestones/${mid}`, updates);
      setProject({ ...project, milestones: res.data });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update milestone.');
    }
  };

  const handleDeleteMilestone = async (mid) => {
    if (!window.confirm('Are you sure you want to delete this milestone?')) return;
    try {
      const res = await API.delete(`/projects/${id}/milestones/${mid}`);
      setProject({ ...project, milestones: res.data });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete milestone.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <FlaskConical size={28} className="spin" />
        <span>Loading project…</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="empty-state" style={{ margin: '80px auto' }}>
        <AlertCircle size={36} />
        <h3>Project not found</h3>
        <Link to="/projects" className="btn btn-outline">Back to Projects</Link>
      </div>
    );
  }

  const isOwner = project.owner?._id === user?._id;
  const isCollaborator = project.collaborators?.some((c) => c._id === user?._id);
  const canRequest = !isOwner && !isCollaborator && project.status === 'Open' && !requestSent;

  return (
    <div className="project-detail animate-fadeIn" id="project-detail-page">
      <div className="container">
        <Link to="/projects" className="back-link">
          <ArrowLeft size={18} /> Back to Projects
        </Link>

        <div className="pd-layout">
          {/* Main Content */}
          <div className="pd-main">
            <div className="pd-header">
              <span className={`badge ${statusColors[project.status] || 'badge-neutral'}`}>
                {project.status}
              </span>
              {project.domain && (
                <span className="badge badge-neutral">{project.domain}</span>
              )}
            </div>

            <h1 className="pd-title">{project.title}</h1>

            <div className="pd-meta">
              <div className="pd-meta-item">
                <Calendar size={15} />
                <span>Created {new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="pd-meta-item">
                <Users size={15} />
                <span>{project.collaborators?.length || 0}{project.teamSizeNeeded ? ` / ${project.teamSizeNeeded} members` : ' members'}</span>
              </div>
            </div>

            <div className="pd-section">
              <h2>Abstract</h2>
              <p className="pd-abstract">{project.abstract}</p>
            </div>

            {project.requiredSkills?.length > 0 && (
              <div className="pd-section">
                <h2>Required Skills</h2>
                <div className="pd-skills">
                  {project.requiredSkills.map((skill, i) => (
                    <span key={i} className="badge badge-primary">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Milestones */}
            {(project.milestones?.length > 0 || isOwner) && (
              <div className="pd-section">
                <div className="section-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ margin: 0 }}>Milestones</h2>
                  {isOwner && (
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => setShowAddMilestone(!showAddMilestone)}
                    >
                      <Plus size={14} /> Add
                    </button>
                  )}
                </div>
                
                {showAddMilestone && isOwner && (
                  <div className="add-milestone-form card" style={{ marginBottom: '16px', padding: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Title</label>
                      <input 
                        type="text" 
                        className="form-input"
                        value={newMilestone.title}
                        onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                        placeholder="e.g. Literature Review"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Deadline</label>
                      <input 
                        type="date" 
                        className="form-input"
                        value={newMilestone.deadline}
                        onChange={(e) => setNewMilestone({...newMilestone, deadline: e.target.value})}
                      />
                    </div>
                    <div className="request-form-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => setShowAddMilestone(false)}>Cancel</button>
                      <button className="btn btn-primary btn-sm" onClick={handleAddMilestone} disabled={!newMilestone.title}>Save</button>
                    </div>
                  </div>
                )}

                <div className="milestones-list">
                  {project.milestones?.map((ms) => (
                    <div key={ms._id} className="milestone-item">
                      <div className="ms-header">
                        <span className="ms-title">{ms.title}</span>
                        <div className="ms-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {ms.approved ? (
                            <span className="badge badge-success"><CheckCircle size={12} /> Approved</span>
                          ) : (
                            <span className="badge badge-neutral"><Clock size={12} /> Pending</span>
                          )}
                          {isOwner && !ms.approved && (
                            <button className="btn btn-sm" style={{ padding: '4px 8px', fontSize: '12px', background: 'var(--success)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleUpdateMilestone(ms._id, { approved: true })}>Approve</button>
                          )}
                          {isOwner && (
                            <button className="btn btn-sm btn-icon" style={{ padding: '4px', background: 'transparent', color: 'var(--danger)', border: 'none', cursor: 'pointer' }} onClick={() => handleDeleteMilestone(ms._id)}>
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="ms-bar-bg">
                        <div
                          className="ms-bar-fill"
                          style={{ width: `${ms.progress || 0}%` }}
                        />
                      </div>
                      <div className="ms-footer">
                        {(!ms.approved && (isOwner || isCollaborator)) ? (
                          <div className="progress-updater" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input 
                              type="range" 
                              min="0" max="100" 
                              value={ms.progress || 0}
                              onChange={(e) => {
                                const newMilestones = project.milestones.map(m => 
                                  m._id === ms._id ? { ...m, progress: Number(e.target.value) } : m
                                );
                                setProject({ ...project, milestones: newMilestones });
                              }}
                              onMouseUp={(e) => handleUpdateMilestone(ms._id, { progress: Number(e.target.value) })}
                              onTouchEnd={(e) => handleUpdateMilestone(ms._id, { progress: Number(e.target.value) })}
                            />
                            <span>{ms.progress || 0}%</span>
                          </div>
                        ) : (
                          <span>{ms.progress || 0}% complete</span>
                        )}
                        {ms.deadline && (
                          <span>Due: {new Date(ms.deadline).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {project.milestones?.length === 0 && !showAddMilestone && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No milestones added yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="pd-sidebar">
            {/* Owner Card */}
            <div className="sidebar-card">
              <h3>Project Lead</h3>
              <div className="pd-owner">
                <div className="pd-owner-avatar">
                  {project.owner?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <div className="pd-owner-name">{project.owner?.name}</div>
                  <div className="pd-owner-dept">{project.owner?.department || 'No department'}</div>
                </div>
              </div>
            </div>

            {/* Team */}
            {project.collaborators?.length > 0 && (
              <div className="sidebar-card">
                <h3>Team Members</h3>
                <div className="pd-team-list">
                  {project.collaborators.map((collab) => (
                    <div key={collab._id} className="pd-team-member">
                      <div className="pd-team-avatar">{collab.name?.charAt(0)}</div>
                      <div>
                        <span className="pd-team-name">{collab.name}</span>
                        <span className="pd-team-role">{collab.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request to Collaborate */}
            {canRequest && (
              <div className="sidebar-card">
                <h3>Interested?</h3>
                {!showRequestForm ? (
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => setShowRequestForm(true)}
                    id="request-collab-btn"
                  >
                    <Send size={16} />
                    Request to Collaborate
                  </button>
                ) : (
                  <div className="request-form">
                    <textarea
                      className="form-textarea"
                      placeholder="Introduce yourself and explain your interest…"
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      rows={4}
                    />
                    <div className="request-form-actions">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setShowRequestForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleSendRequest}
                        disabled={sendingRequest}
                      >
                        {sendingRequest ? 'Sending…' : 'Send Request'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {requestSent && (
              <div className="sidebar-card" style={{ background: 'var(--success-bg)', border: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
                  <CheckCircle size={18} />
                  <span style={{ fontWeight: 500 }}>Request sent!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
