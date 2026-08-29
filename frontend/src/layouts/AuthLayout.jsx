import { Building2 } from 'lucide-react';

const AuthLayout = ({ children }) => (
  <div className="auth-layout">
    <div className="auth-visual">
      <div className="auth-visual-content">
        <div className="auth-logo">
          <Building2 size={32} />
        </div>
        <h2>Smart Business CRM</h2>
        <p>Manage leads, clients, and grow your business — all in one place.</p>
        <ul className="auth-features">
          <li>Track leads & conversions</li>
          <li>Schedule follow-ups</li>
          <li>Team & client management</li>
          <li>Real-time analytics</li>
        </ul>
      </div>
    </div>
    <div className="auth-form-side">
      <div className="auth-card">{children}</div>
    </div>
  </div>
);

export default AuthLayout;
