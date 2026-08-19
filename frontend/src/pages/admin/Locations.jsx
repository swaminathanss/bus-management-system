import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';

const AdminLocations = () => {
  const { name, logout } = useContext(AuthContext);
  const [routes, setRoutes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [routeForm, setRouteForm] = useState({ name: '', stops: '' });
  const [locationForm, setLocationForm] = useState({ name: '', routeId: '' });
  const [routeError, setRouteError] = useState('');
  const [locationError, setLocationError] = useState('');

  const loadData = () => {
    axiosInstance.get('/routes').then((res) => setRoutes(res.data)).catch(() => {});
    axiosInstance.get('/locations').then((res) => setLocations(res.data)).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRouteChange = (e) => setRouteForm({ ...routeForm, [e.target.name]: e.target.value });
  const handleLocationChange = (e) => setLocationForm({ ...locationForm, [e.target.name]: e.target.value });

  const submitRoute = async (e) => {
    e.preventDefault();
    setRouteError('');
    try {
      const stopsArray = routeForm.stops.split(',').map((s) => s.trim()).filter(Boolean);
      await axiosInstance.post('/routes', { name: routeForm.name, stops: stopsArray });
      setRouteForm({ name: '', stops: '' });
      loadData();
    } catch (err) {
      setRouteError(err.response?.data?.message || 'Failed to add route');
    }
  };

  const submitLocation = async (e) => {
    e.preventDefault();
    setLocationError('');
    try {
      await axiosInstance.post('/locations', locationForm);
      setLocationForm({ name: '', routeId: '' });
      loadData();
    } catch (err) {
      setLocationError(err.response?.data?.message || 'Failed to add location');
    }
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
        <h1 className="page__title">Routes &amp; Locations</h1>

        <form onSubmit={submitRoute} className="stat-card" style={{ marginBottom: 24 }}>
          <div className="stat-card__label">Add a new route</div>
          <div className="field">
            <label>Area Name (e.g. Kattur, Adyar)</label>
            <input name="name" value={routeForm.name} onChange={handleRouteChange} placeholder="Just the area name — the Route code is added automatically" required />
          </div>
          <div className="field">
            <label>Stops (comma-separated, in order)</label>
            <input name="stops" value={routeForm.stops} onChange={handleRouteChange} placeholder="Sathyabama, Koyambedu, Anna Nagar" />
          </div>
          {routeError && <p className="form-error">{routeError}</p>}
          <button type="submit" className="btn btn--primary">Add Route</button>
        </form>

        <form onSubmit={submitLocation} className="stat-card" style={{ marginBottom: 24 }}>
          <div className="stat-card__label">Add a new drop-off location</div>
          <div className="grid" style={{ gap: 12, marginBottom: 12 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Location Name</label>
              <input name="name" value={locationForm.name} onChange={handleLocationChange} required />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Route</label>
              <select name="routeId" value={locationForm.routeId} onChange={handleLocationChange} required style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid var(--color-line)' }}>
                <option value="">Select route</option>
                {routes.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>
          </div>
          {locationError && <p className="form-error">{locationError}</p>}
          <button type="submit" className="btn btn--primary">Add Location</button>
        </form>

        <div className="grid">
          {routes.map((r) => (
            <div key={r._id} className="stat-card">
              <div className="stat-card__label">{r.name}</div>
              <div style={{ fontSize: 13, color: 'var(--color-ink-soft)', marginBottom: 8 }}>
                {r.stops?.length || 0} stops
              </div>
              {r.stops?.length > 0 && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                  {r.stops.join(' → ')}
                </div>
              )}
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--color-ink-soft)' }}>
                Locations: {locations.filter((l) => l.routeId?._id === r._id).map((l) => l.name).join(', ') || 'None yet'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminLocations;