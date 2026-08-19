import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import { Link } from 'react-router-dom';

const AdminBuses = () => {
  const { name, logout } = useContext(AuthContext);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({
    busNumber: '', capacity: '', routeId: '', driverName: '', driverPhone: '', parkingSlotNumber: ''
  });
  const [error, setError] = useState('');

  const loadData = () => {
    axiosInstance.get('/buses').then((res) => setBuses(res.data)).catch(() => {});
    axiosInstance.get('/routes').then((res) => setRoutes(res.data)).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axiosInstance.post('/buses', { ...form, capacity: Number(form.capacity) });
      setForm({ busNumber: '', capacity: '', routeId: '', driverName: '', driverPhone: '', parkingSlotNumber: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add bus');
    }
  };

  const markRefueled = async (busId) => {
    await axiosInstance.put(`/buses/${busId}`, { fuelLevel: 'full' });
    loadData();
  };

  const toggleService = async (busId, currentStatus) => {
    const nextStatus = currentStatus === 'maintenance' ? 'active' : 'maintenance';
    await axiosInstance.put(`/buses/${busId}`, { status: nextStatus });
    loadData();
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
        <h1 className="page__title">Bus Management</h1>

        <form onSubmit={handleSubmit} className="stat-card" style={{ marginBottom: 24 }}>
          <div className="stat-card__label">Add a new bus</div>
          <div className="grid" style={{ gap: 12, marginBottom: 12 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Bus Number</label>
              <input name="busNumber" value={form.busNumber} onChange={handleChange} required />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Capacity</label>
              <input name="capacity" type="number" value={form.capacity} onChange={handleChange} required />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Route</label>
              <select name="routeId" value={form.routeId} onChange={handleChange} required style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid var(--color-line)' }}>
                <option value="">Select route</option>
                {routes.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Driver Name</label>
              <input name="driverName" value={form.driverName} onChange={handleChange} required />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Driver Phone</label>
              <input name="driverPhone" value={form.driverPhone} onChange={handleChange} required />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Parking Slot</label>
              <input name="parkingSlotNumber" value={form.parkingSlotNumber} onChange={handleChange} required />
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn--primary">Add Bus</button>
        </form>

        <div className="grid">
          {buses.map((bus) => (
            <div key={bus._id} className="stat-card">
              <div className="stat-card__label">{bus.busNumber} &mdash; {bus.parkingSlotNumber}</div>
              <div style={{ fontSize: 13, color: 'var(--color-ink-soft)', marginBottom: 10 }}>
                {bus.driverName} &middot; {bus.routeId?.name || 'No route'}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                <span className={`badge ${bus.status === 'active' ? 'badge--success' : 'badge--pending'}`}>{bus.status}</span>
                <span className={`badge ${bus.fuelLevel === 'low' || bus.fuelLevel === 'empty' ? 'badge--pending' : 'badge--success'}`}>{bus.fuelLevel}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn--ghost" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => markRefueled(bus._id)}>Mark Refueled</button>
                <button className="btn btn--ghost" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => toggleService(bus._id, bus.status)}>
                  {bus.status === 'maintenance' ? 'Mark Active' : 'Send to Service'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBuses;