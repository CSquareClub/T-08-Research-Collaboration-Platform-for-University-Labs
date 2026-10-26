import { useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { BookOpen, Plus, FileText, ExternalLink } from 'lucide-react';
import './Publications.css';

export default function Publications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [doi, setDoi] = useState('');
  const [authors, setAuthors] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const res = await API.get('/publications');
      setPublications(res.data);
    } catch (err) {
      toast.error('Failed to load publications');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPublication = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Adding publication...');
    try {
      await API.post('/publications', {
        title,
        doi,
        authors,
        publicationDate,
        pdfUrl
      });
      toast.success('Publication added successfully!', { id: toastId });
      setShowModal(false);
      resetForm();
      fetchPublications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add publication', { id: toastId });
    }
  };

  const resetForm = () => {
    setTitle('');
    setDoi('');
    setAuthors('');
    setPublicationDate('');
    setPdfUrl('');
  };

  if (loading) {
    return <div className="publications-loading">Loading publications...</div>;
  }

  return (
    <div className="publications-container fade-in">
      <div className="publications-header">
        <div>
          <h1><BookOpen size={28} /> Publications</h1>
          <p>Browse research papers and publications from the community.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Publication
        </button>
      </div>

      <div className="publications-list">
        {publications.length === 0 ? (
          <div className="empty-state">No publications found. Be the first to add one!</div>
        ) : (
          publications.map((pub) => (
            <div key={pub._id} className="pub-card">
              <div className="pub-icon">
                <FileText size={32} />
              </div>
              <div className="pub-content">
                <h3 className="pub-title">{pub.title}</h3>
                <p className="pub-authors">{pub.authors?.join(', ')}</p>
                <div className="pub-meta">
                  {pub.publicationDate && (
                    <span>Published: {new Date(pub.publicationDate).toLocaleDateString()}</span>
                  )}
                  {pub.owner && (
                    <span>Added by: {pub.owner.name}</span>
                  )}
                  {pub.projectId && (
                    <span className="badge badge-neutral">{pub.projectId.title}</span>
                  )}
                </div>
              </div>
              <div className="pub-actions">
                {pub.doi && (
                  <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">
                    <ExternalLink size={14} /> DOI
                  </a>
                )}
                {pub.pdfUrl && (
                  <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">
                    <FileText size={14} /> PDF
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Publication</h2>
            <form onSubmit={handleAddPublication}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Authors (comma separated)</label>
                <input type="text" value={authors} onChange={(e) => setAuthors(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>DOI (optional)</label>
                <input type="text" value={doi} onChange={(e) => setDoi(e.target.value)} placeholder="e.g. 10.1038/nphys1170" />
              </div>
              <div className="form-group">
                <label>Publication Date</label>
                <input type="date" value={publicationDate} onChange={(e) => setPublicationDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>PDF URL (optional)</label>
                <input type="url" value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Publication</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
