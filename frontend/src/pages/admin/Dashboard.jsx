import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { name, logout } = useContext(AuthContext);
  return (
    <div>
      <div className="topbar">
        <div className="topbar__brand">
          <span className="topbar__brand-dot" />
          College Transit
        </div>
        <div className="topbar__user">
          <span className="chip">Admin</span>
          <span>{name}</span>
          <button className="btn btn--ghost" onClick={logout}>Log out</button>
        </div>
      </div>
      <div className="page">
        <div className="page__eyebrow">Overview</div>
        <h1 className="page__title">Transport control</h1>
        <p style={{ color: 'var(--color-ink-soft)' }}>Bus management, allocation, and ticket queue coming in the next steps.</p>
        <Link to="/admin/buses" className="btn btn--primary" style={{ display: 'inline-block', marginTop: 16, textDecoration: 'none' }}>Manage Buses</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;