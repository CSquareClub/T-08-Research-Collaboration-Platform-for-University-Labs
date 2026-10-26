import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import {
  GitPullRequest,
  Check,
  X,
  FlaskConical,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import './Requests.css';

export default function Requests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await API.get('/collaboration-requests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, status) => {
    try {
      await API.put(`/collaboration-requests/${requestId}`, { status });
      fetchRequests();
    } catch (err) {
      alert('Failed to update request.');
    }
  };

  const incoming = requests.filter((r) => r.to === user?._id || r.to?._id === user?._id);
  const outgoing = requests.filter((r) => r.from === user?._id || r.from?._id === user?._id);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <FlaskConical size={28} className="spin" />
        <span>Loading requests…</span>
      </div>
    );
  }

  return (
    <div className="requests-page animate-fadeIn" id="requests-page">
      <div className="container">
        <h1>Collaboration Requests</h1>
        <p className="requests-subtitle">Manage incoming and outgoing collaboration requests.</p>

        {/* Incoming */}
        <div className="req-section">
          <h2><ArrowDownLeft size={18} /> Incoming Requests</h2>
          {incoming.length > 0 ? (
            <div className="req-list">
              {incoming.map((r) => (
                <div key={r._id} className="req-card card" id={`req-${r._id}`}>
                  <div className="req-top">
                    <div className="req-user">
                      <div className="req-avatar">{r.from?.name?.charAt(0) || '?'}</div>
                      <div>
                        <span className="req-name">{r.from?.name || 'Unknown'}</span>
                        <span className="req-dept">{r.from?.department || ''}</span>
                      </div>
                    </div>
                    <span className={`badge ${r.status === 'Pending' ? 'badge-warning' : r.status === 'Accepted' ? 'badge-success' : 'badge-danger'}`}>
                      {r.status}
                    </span>
                  </div>

                  <div className="req-project">
                    <span className="req-project-label">Project:</span>
                    <Link to={`/projects/${r.projectId?._id || r.projectId}`} className="req-project-name">
                      {r.projectId?.title || 'Unknown Project'}
                    </Link>
                  </div>

                  {r.message && <p className="req-message">"{r.message}"</p>}

                  {r.from?.skills?.length > 0 && (
                    <div className="req-skills">
                      {r.from.skills.slice(0, 5).map((s, i) => (
                        <span key={i} className="badge badge-primary">{s}</span>
                      ))}
                    </div>
                  )}

                  {r.status === 'Pending' && (
                    <div className="req-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAction(r._id, 'Accepted')}
                      >
                        <Check size={14} /> Accept
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleAction(r._id, 'Rejected')}
                      >
                        <X size={14} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <GitPullRequest size={32} strokeWidth={1.2} />
              <p>No incoming requests yet.</p>
            </div>
          )}
        </div>

        {/* Outgoing */}
        <div className="req-section">
          <h2><ArrowUpRight size={18} /> My Sent Requests</h2>
          {outgoing.length > 0 ? (
            <div className="req-list">
              {outgoing.map((r) => (
                <div key={r._id} className="req-card card">
                  <div className="req-top">
                    <div className="req-project">
                      <Link to={`/projects/${r.projectId?._id || r.projectId}`} className="req-project-name">
                        {r.projectId?.title || 'Unknown Project'}
                      </Link>
                    </div>
                    <span className={`badge ${r.status === 'Pending' ? 'badge-warning' : r.status === 'Accepted' ? 'badge-success' : 'badge-danger'}`}>
                      {r.status}
                    </span>
                  </div>
                  {r.message && <p className="req-message">"{r.message}"</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <ArrowUpRight size={32} strokeWidth={1.2} />
              <p>You haven't sent any requests yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
