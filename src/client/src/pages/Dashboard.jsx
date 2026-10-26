import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import ProjectCard from '../components/ProjectCard';
import {
  FolderSearch,
  GitPullRequest,
  Users,
  Plus,
  ArrowRight,
  FlaskConical,
  TrendingUp,
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, reqRes] = await Promise.all([
          API.get('/projects'),
          API.get('/collaboration-requests'),
        ]);
        setProjects(Array.isArray(projRes.data) ? projRes.data : []);
        setRequests(Array.isArray(reqRes.data) ? reqRes.data : []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const projectList = Array.isArray(projects) ? projects : [];
  const requestList = Array.isArray(requests) ? requests : [];
  const pendingRequests = requestList.filter((r) => r.status === 'Pending');
  const myProjects = projectList.filter(
    (p) => p.owner?._id === user?._id || p.owner === user?._id
  );
  const openProjects = projectList.filter((p) => p.status === 'Open');

  const isFacultyOrPI = user?.role === 'Faculty' || user?.role === 'PI';

  if (loading) {
    return (
      <div className="dashboard-loading">
        <FlaskConical size={28} className="spin" />
        <span>Loading your workspace…</span>
      </div>
    );
  }

  return (
    <div className="dashboard animate-fadeIn" id="dashboard-page">
      <div className="container">
        {/* Greeting */}
        <div className="dash-greeting">
          <div>
            <h1>Welcome back, {user?.name ? user.name.split(' ')[0] : 'Researcher'}!</h1>
            <p>Here's an overview of your research activity.</p>
          </div>
          {isFacultyOrPI && (
            <Link to="/projects/new" className="btn btn-primary" id="create-project-btn">
              <Plus size={18} />
              New Project
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="dash-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
              <FolderSearch size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{projectList.length}</span>
              <span className="stat-label">Total Projects</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
              <TrendingUp size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{openProjects.length}</span>
              <span className="stat-label">Open for Collaboration</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
              <GitPullRequest size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{pendingRequests.length}</span>
              <span className="stat-label">Pending Requests</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
              <Users size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{myProjects.length}</span>
              <span className="stat-label">My Projects</span>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="dash-section">
          <div className="section-header">
            <h2>Recent Open Projects</h2>
            <Link to="/projects" className="section-link">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          {openProjects.length > 0 ? (
            <div className="projects-grid">
              {openProjects.slice(0, 4).map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FolderSearch size={40} strokeWidth={1.2} />
              <p>No open projects yet. {isFacultyOrPI ? 'Create one to get started!' : 'Check back soon!'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
