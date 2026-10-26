import { useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { Database, Upload, FileText, Lock, Globe, Plus } from 'lucide-react';
import './Datasets.css';

export default function Datasets() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [access, setAccess] = useState('public');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const res = await API.get('/datasets');
      setDatasets(res.data);
    } catch (err) {
      toast.error('Failed to load datasets');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      return toast.error('Please select a file');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('access', access);
    formData.append('file', file);

    const toastId = toast.loading('Uploading dataset...');
    try {
      await API.post('/datasets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Dataset uploaded successfully!', { id: toastId });
      setShowModal(false);
      resetForm();
      fetchDatasets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed', { id: toastId });
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAccess('public');
    setFile(null);
  };

  if (loading) {
    return <div className="datasets-loading">Loading datasets...</div>;
  }

  return (
    <div className="datasets-container fade-in">
      <div className="datasets-header">
        <div>
          <h1><Database size={28} /> Dataset Library</h1>
          <p>Discover and share research data with the community.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Upload Dataset
        </button>
      </div>

      <div className="datasets-grid">
        {datasets.length === 0 ? (
          <div className="empty-state">No datasets found. Be the first to upload one!</div>
        ) : (
          datasets.map((dataset) => (
            <div key={dataset._id} className="dataset-card">
              <div className="dataset-card-header">
                <h3>{dataset.title}</h3>
                <span className={`access-badge ${dataset.access}`}>
                  {dataset.access === 'private' ? <Lock size={12} /> : <Globe size={12} />}
                  {dataset.access}
                </span>
              </div>
              <p className="dataset-desc">{dataset.description}</p>
              <div className="dataset-meta">
                <span>By: {dataset.owner?.name || 'Unknown'}</span>
                <span>Versions: {dataset.versions?.length || 1}</span>
              </div>
              <div className="dataset-actions">
                <a href={dataset.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <FileText size={16} /> View / Download
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Upload Dataset</h2>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" />
              </div>
              <div className="form-group">
                <label>Access Level</label>
                <select value={access} onChange={(e) => setAccess(e.target.value)}>
                  <option value="public">Public (Anyone can view)</option>
                  <option value="private">Private (Request access)</option>
                </select>
              </div>
              <div className="form-group">
                <label>File (CSV, PDF, ZIP, etc.)</label>
                <div className="file-input-wrapper">
                  <Upload size={20} />
                  <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
                  <span className="file-name">{file ? file.name : 'Choose a file'}</span>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
