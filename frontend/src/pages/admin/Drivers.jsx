import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';

const AdminDrivers = () => {
  const { name, logout } = useContext(AuthContext);
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', licenseNumber: '' });
  const [error, setError] = useState('');

  const loadDrivers = () => {
    axiosInstance.get('/drivers/attendance/today').then((res) => setDrivers(res.data)).catch(() => {});
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axiosInstance.post('/drivers', form);
      setForm({ name: '', phone: '', licenseNumber: '' });
      loadDrivers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add driver');
    }
  };

  const markStatus = async (driverId, status) => {
    await axiosInstance.post('/drivers/attendance', { driverId, status });
    loadDrivers();
  };

  const statusBadge = (status) => {
    if (status === 'available') return 'badge--success';
    if (status === 'unavailable') return 'badge--pending';
    return 'badge--pending';
  };

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
        <div className="page__eyebrow"><Link to="/admin/dashboard">&larr; Dashboard</Link></div>
        <h1 className="page__title">Driver Attendance</h1>

        <form onSubmit={handleSubmit} className="stat-card" style={{ marginBottom: 24 }}>
          <div className="stat-card__label">Add a new driver</div>
          <div className="grid" style={{ gap: 12, marginBottom: 12 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>License Number</label>
              <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} required />
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn--primary">Add Driver</button>
        </form>

        <div className="grid">
          {drivers.map((d) => (
            <div key={d._id} className="stat-card">
              <div className="stat-card__label">{d.name}</div>
              <div style={{ fontSize: 13, color: 'var(--color-ink-soft)', marginBottom: 10 }}>
                {d.phone} &middot; {d.assignedBus?.busNumber || 'Unassigned'}
              </div>
              <span className={`badge ${statusBadge(d.status)}`} style={{ marginBottom: 10, display: 'inline-block' }}>{d.status}</span>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="btn btn--ghost" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => markStatus(d._id, 'available')}>Mark Available</button>
                <button className="btn btn--ghost" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => markStatus(d._id, 'unavailable')}>Mark Unavailable</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDrivers;