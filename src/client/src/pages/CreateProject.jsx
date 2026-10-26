import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { ArrowLeft, Plus, FlaskConical } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CreateProject.css';

const DOMAINS = ['AI', 'Machine Learning', 'Blockchain', 'IoT', 'Data Science', 'Cybersecurity', 'Bioinformatics', 'Robotics', 'NLP', 'Computer Vision'];

export default function CreateProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    abstract: '',
    domain: '',
    requiredSkills: '',
    teamSizeNeeded: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        teamSizeNeeded: form.teamSizeNeeded ? Number(form.teamSizeNeeded) : undefined,
        requiredSkills: form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const res = await API.post('/projects', payload);
      navigate(`/projects/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project-page animate-fadeIn" id="create-project-page">
      <div className="container">
        <Link to="/projects" className="back-link">
          <ArrowLeft size={18} /> Back to Projects
        </Link>

        <div className="create-project-card card">
          <div className="cp-header">
            <div className="cp-icon">
              <FlaskConical size={24} />
            </div>
            <div>
              <h1>Create New Project</h1>
              <p>Share your research opportunity with the community.</p>
            </div>
          </div>

          {error && (
            <div className="auth-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="cp-form" id="create-project-form">
            <div className="form-group">
              <label className="form-label" htmlFor="cp-title">Project Title *</label>
              <input
                id="cp-title"
                name="title"
                type="text"
                className="form-input"
                placeholder="e.g. Federated Learning for Edge Devices"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cp-abstract">Abstract *</label>
              <textarea
                id="cp-abstract"
                name="abstract"
                className="form-textarea"
                placeholder="Describe your research project, objectives, and expected outcomes…"
                value={form.abstract}
                onChange={handleChange}
                required
                rows={5}
              />
            </div>

            <div className="cp-row">
              <div className="form-group">
                <label className="form-label" htmlFor="cp-domain">Domain</label>
                <select
                  id="cp-domain"
                  name="domain"
                  className="form-select"
                  value={form.domain}
                  onChange={handleChange}
                >
                  <option value="">Select a domain</option>
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cp-teamsize">Team Size Needed</label>
                <input
                  id="cp-teamsize"
                  name="teamSizeNeeded"
                  type="number"
                  className="form-input"
                  placeholder="e.g. 5"
                  value={form.teamSizeNeeded}
                  onChange={handleChange}
                  min={1}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cp-skills">Required Skills (comma separated)</label>
              <input
                id="cp-skills"
                name="requiredSkills"
                type="text"
                className="form-input"
                placeholder="e.g. Python, TensorFlow, Docker"
                value={form.requiredSkills}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              id="cp-submit-btn"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Plus size={18} />
              {loading ? 'Creating…' : 'Create Project'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
