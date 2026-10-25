import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FlaskConical,
  LayoutDashboard,
  FolderSearch,
  UserCircle,
  GitPullRequest,
  Database,
  BookOpen,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: FolderSearch },
    { to: '/datasets', label: 'Datasets', icon: Database },
    { to: '/publications', label: 'Publications', icon: BookOpen },
    { to: '/requests', label: 'Requests', icon: GitPullRequest },
    { to: '/profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <nav className="navbar" id="main-nav">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand" id="nav-brand">
          <FlaskConical size={24} strokeWidth={2} />
          <span className="brand-text">ResearchHub</span>
        </Link>

        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
          id="nav-mobile-toggle"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="navbar-user">
          {user && (
            <>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role badge badge-primary">{user.role}</span>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={handleLogout}
                id="nav-logout-btn"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
