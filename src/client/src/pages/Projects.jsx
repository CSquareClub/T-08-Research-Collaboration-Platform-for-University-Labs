import { useState, useEffect } from 'react';
import API from '../utils/api';
import ProjectCard from '../components/ProjectCard';
import { Search, Filter, X, FolderSearch } from 'lucide-react';
import './Projects.css';

const DOMAINS = ['AI', 'Machine Learning', 'Blockchain', 'IoT', 'Data Science', 'Cybersecurity', 'Bioinformatics', 'Robotics', 'NLP', 'Computer Vision'];
const STATUSES = ['Open', 'Ongoing', 'Closed', 'Completed'];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.q = searchQuery;
      if (selectedDomain) params.domain = selectedDomain;
      if (selectedStatus) params.status = selectedStatus;
      const res = await API.get('/projects', { params });
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedDomain, selectedStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDomain('');
    setSelectedStatus('');
  };

  const hasFilters = searchQuery || selectedDomain || selectedStatus;

  return (
    <div className="projects-page animate-fadeIn" id="projects-page">
      <div className="container">
        <div className="projects-header">
          <div>
            <h1>Project Registry</h1>
            <p>Discover research projects and find collaboration opportunities</p>
          </div>
        </div>

        {/* Search + Filter Bar */}
        <div className="search-bar-wrapper">
          <form onSubmit={handleSearch} className="search-form" id="project-search-form">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="form-input search-input"
                placeholder="Search by title, abstract, or keywords…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="project-search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary" id="project-search-btn">
              Search
            </button>
            <button
              type="button"
              className={`btn btn-outline filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filters
            </button>
          </form>

          {/* Filter Panel */}
          {showFilters && (
            <div className="filter-panel">
              <div className="filter-group">
                <label className="form-label">Domain</label>
                <select
                  className="form-select"
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  id="filter-domain"
                >
                  <option value="">All Domains</option>
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  id="filter-status"
                >
                  <option value="">All Statuses</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {hasFilters && (
                <button className="btn btn-outline btn-sm" onClick={clearFilters}>
                  <X size={14} /> Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="empty-state">
            <FolderSearch size={36} className="spin" />
            <p>Searching projects…</p>
          </div>
        ) : projects.length > 0 ? (
          <>
            <p className="results-count">{projects.length} project{projects.length !== 1 ? 's' : ''} found</p>
            <div className="projects-grid">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <FolderSearch size={40} strokeWidth={1.2} />
            <h3>No projects found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
