import { Menu, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button type="button" className="btn-icon menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="navbar-greeting">
          <span className="greeting-label">Welcome back,</span>
          <span className="greeting-name">{user?.name?.split(' ')[0]}</span>
        </div>
      </div>
      <div className="navbar-right">
        <button type="button" className="btn-icon" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <div className="user-chip">
          <div className="avatar">{initials}</div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role || 'Admin'}</span>
          </div>
        </div>
        <button type="button" className="btn-icon logout-btn" onClick={handleLogout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
