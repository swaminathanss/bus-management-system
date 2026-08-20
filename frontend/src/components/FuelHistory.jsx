import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const FuelHistory = ({ busId }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axiosInstance.get(`/buses/${busId}/fuel-log`).then((res) => setLogs(res.data)).catch(() => {});
  }, [busId]);

  if (logs.length === 0) {
    return <p style={{ fontSize: 12, color: 'var(--color-ink-soft)', marginTop: 8 }}>No fuel logs yet.</p>;
  }

  const withMileage = logs.filter((l) => l.mileage);
  const avgMileage = withMileage.length > 0 ? (withMileage.reduce((sum, l) => sum + l.mileage, 0) / withMileage.length).toFixed(2) : '—';

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-ink-soft)', marginBottom: 6 }}>
        AVG MILEAGE: {avgMileage} km/l
      </div>
      {logs.slice(0, 5).map((l) => (
        <div key={l._id} style={{ padding: '6px 0', borderBottom: '1px solid var(--color-line)' }}>
          <div style={{ fontSize: 11, color: 'var(--color-ink-soft)', marginBottom: 2 }}>
            {new Date(l.filledAt).toLocaleDateString()}
          </div>
          <div style={{ display: 'flex', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 12, whiteSpace: 'nowrap' }}>
            <span>{l.litersFilled}L</span>
            <span>{l.kmCovered}km</span>
            <span style={{ color: 'var(--color-amber)', fontWeight: 600 }}>{l.mileage} km/l</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FuelHistory;