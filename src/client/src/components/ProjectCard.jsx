import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import './ProjectCard.css';

const statusColors = {
  Open: 'badge-success',
  Ongoing: 'badge-warning',
  Closed: 'badge-danger',
  Completed: 'badge-primary',
};

export default function ProjectCard({ project }) {
  const ownerName = project.owner?.name || 'Unknown';
  const ownerDept = project.owner?.department || '';

  return (
    <Link to={`/projects/${project._id}`} className="project-card card" id={`project-card-${project._id}`}>
      <div className="pc-header">
        <span className={`badge ${statusColors[project.status] || 'badge-neutral'}`}>
          {project.status}
        </span>
        {project.domain && (
          <span className="badge badge-neutral">{project.domain}</span>
        )}
      </div>

      <h3 className="pc-title">{project.title}</h3>

      <p className="pc-abstract">
        {project.abstract?.length > 140
          ? project.abstract.substring(0, 140) + '…'
          : project.abstract}
      </p>

      <div className="pc-skills">
        {project.requiredSkills?.slice(0, 4).map((skill, i) => (
          <span key={i} className="badge badge-primary">{skill}</span>
        ))}
        {project.requiredSkills?.length > 4 && (
          <span className="badge badge-neutral">+{project.requiredSkills.length - 4}</span>
        )}
      </div>

      <div className="pc-footer">
        <div className="pc-owner">
          <div className="pc-owner-avatar">{ownerName.charAt(0)}</div>
          <div className="pc-owner-info">
            <span className="pc-owner-name">{ownerName}</span>
            {ownerDept && <span className="pc-owner-dept">{ownerDept}</span>}
          </div>
        </div>
        <div className="pc-team">
          <Users size={14} />
          <span>{project.collaborators?.length || 0}{project.teamSizeNeeded ? `/${project.teamSizeNeeded}` : ''}</span>
        </div>
      </div>

      <div className="pc-cta">
        <span>View Details</span>
        <ArrowRight size={16} />
      </div>
    </Link>
  );
}
