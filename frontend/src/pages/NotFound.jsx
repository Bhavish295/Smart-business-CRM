import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => (
  <div className="not-found">
    <div className="not-found-code">404</div>
    <h1>Page not found</h1>
    <p>The page you&apos;re looking for doesn&apos;t exist or was moved.</p>
    <div className="not-found-actions">
      <Link to="/dashboard" className="btn btn-primary">
        <Home size={16} /> Go to Dashboard
      </Link>
      <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
        <ArrowLeft size={16} /> Go Back
      </button>
    </div>
  </div>
);

export default NotFound;
