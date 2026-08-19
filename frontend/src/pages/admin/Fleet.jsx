import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import BarChart from '../../components/BarChart';

const AdminFleet = () => {
  const { name, logout } = useContext(AuthContext);
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    axiosInstance.get('/buses').then((res) => setBuses(res.data)).catch(() => {});
  }, []);

  const statusCounts = { active: 0, maintenance: 0, inactive: 0 };
  const fuelCounts = { full: 0, half: 0, low: 0, empty: 0 };
  buses.forEach((b) => {
    statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
    fuelCounts[b.fuelLevel] = (fuelCounts[b.fuelLevel] || 0) + 1;
  });

  const today = new Date();
  const needsFuel = buses.filter((b) => b.fuelLevel === 'low' || b.fuelLevel === 'empty');
  const needsService = buses.filter((b) => !b.lastServiceDate || (b.nextServiceDue && new Date(b.nextServiceDue) < today));

  const statusData = [
    { label: 'Active', value: statusCounts.active, color: 'var(--color-success)' },
    { label: 'Maintenance', value: statusCounts.maintenance, color: 'var(--color-amber)' },
    { label: 'Inactive', value: statusCounts.inactive, color: 'var(--color-danger)' }
  ];

  const fuelData = [
    { label: 'Full', value: fuelCounts.full, color: 'var(--color-success)' },
    { label: 'Half', value: fuelCounts.half, color: 'var(--color-teal)' },
    { label: 'Low', value: fuelCounts.low, color: 'var(--color-amber)' },
    { label: 'Empty', value: fuelCounts.empty, color: 'var(--color-danger)' }
  ];

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
        <h1 className="page__title">Fleet Overview</h1>

        <div className="grid" style={{ marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-card__label">Total Buses</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>{buses.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Need Fuel</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: needsFuel.length > 0 ? 'var(--color-danger)' : 'var(--color-ink)' }}>{needsFuel.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Need Service</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: needsService.length > 0 ? 'var(--color-danger)' : 'var(--color-ink)' }}>{needsService.length}</div>
          </div>
        </div>

        <div className="grid" style={{ marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-card__label">Fleet Status</div>
            <BarChart data={statusData} />
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Fuel Levels</div>
            <BarChart data={fuelData} />
          </div>
        </div>

        {needsFuel.length > 0 && (
          <div className="stat-card" style={{ marginBottom: 20 }}>
            <div className="stat-card__label">Buses needing fuel</div>
            {needsFuel.map((b) => (
              <div key={b._id} style={{ fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--color-line)' }}>
                {b.busNumber} &middot; {b.parkingSlotNumber} &middot; <span className="badge badge--pending">{b.fuelLevel}</span>
              </div>
            ))}
          </div>
        )}

        {needsService.length > 0 && (
          <div className="stat-card">
            <div className="stat-card__label">Buses needing service</div>
            {needsService.map((b) => (
              <div key={b._id} style={{ fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--color-line)' }}>
                {b.busNumber} &middot; {b.parkingSlotNumber} &middot; {b.lastServiceDate ? `Last serviced ${new Date(b.lastServiceDate).toLocaleDateString()}` : 'Never serviced'}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFleet;