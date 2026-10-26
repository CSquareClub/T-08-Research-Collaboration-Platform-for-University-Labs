import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { Save, User, Tag, BookOpen, FlaskConical } from 'lucide-react';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({
    name: '',
    department: '',
    skills: '',
    interests: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get('/users/me');
        const u = res.data;
        setForm({
          name: u.name || '',
          department: u.department || '',
          skills: (u.skills || []).join(', '),
          interests: (u.interests || []).join(', '),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put('/users/me', {
        name: form.name,
        department: form.department,
        skills: form.skills,
        interests: form.interests,
      });
      setSaved(true);
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <FlaskConical size={28} className="spin" />
        <span>Loading profile…</span>
      </div>
    );
  }

  return (
    <div className="profile-page animate-fadeIn" id="profile-page">
      <div className="container">
        <h1>My Profile</h1>
        <p className="profile-subtitle">Manage your personal and research information.</p>

        <div className="profile-layout">
          {/* Profile Card */}
          <div className="profile-card card">
            <div className="profile-avatar-large">
              {user?.name?.charAt(0) || '?'}
            </div>
            <h2 className="profile-display-name">{user?.name}</h2>
            <span className="badge badge-primary">{user?.role}</span>
            <p className="profile-email">{user?.email}</p>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="profile-form card" id="profile-form">
            <h2>Edit Profile</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">
                <User size={14} /> Full Name
              </label>
              <input
                id="profile-name"
                name="name"
                type="text"
                className="form-input"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-department">
                <BookOpen size={14} /> Department
              </label>
              <input
                id="profile-department"
                name="department"
                type="text"
                className="form-input"
                placeholder="e.g. Computer Science"
                value={form.department}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-skills">
                <Tag size={14} /> Skills (comma separated)
              </label>
              <input
                id="profile-skills"
                name="skills"
                type="text"
                className="form-input"
                placeholder="e.g. Python, Machine Learning, React"
                value={form.skills}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-interests">
                <Tag size={14} /> Research Interests (comma separated)
              </label>
              <input
                id="profile-interests"
                name="interests"
                type="text"
                className="form-input"
                placeholder="e.g. NLP, Reinforcement Learning"
                value={form.interests}
                onChange={handleChange}
              />
            </div>

            <div className="profile-form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                id="profile-save-btn"
              >
                <Save size={16} />
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              {saved && (
                <span className="save-success">Profile updated!</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
