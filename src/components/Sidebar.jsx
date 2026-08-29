import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarClock,
  Briefcase,
  BarChart3,
  Building2,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/clients', label: 'Clients', icon: UserCheck },
  { to: '/follow-ups', label: 'Follow-ups', icon: CalendarClock },
  { to: '/employees', label: 'Employees', icon: Briefcase },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
];

const Sidebar = ({ open, onClose }) => (
  <>
    {open && <div className="sidebar-backdrop" onClick={onClose} role="presentation" />}
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Building2 size={22} />
        </div>
        <div>
          <span className="brand-name">Smart CRM</span>
          <span className="brand-tag">Business Suite</span>
        </div>
        <button type="button" className="sidebar-close btn-icon" onClick={onClose} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>
      <p className="sidebar-section-label">Main Menu</p>
      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>Smart Business CRM</p>
        <span>v1.0</span>
      </div>
    </aside>
  </>
);

export default Sidebar;
