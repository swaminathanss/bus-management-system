import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';

const StudentDashboard = () => {
  const { name, logout } = useContext(AuthContext);
  const [attendance, setAttendance] = useState(null);
  const [bus, setBus] = useState(null);

  useEffect(() => {
    axiosInstance.get('/attendance/today').then((res) => setAttendance(res.data)).catch(() => {});
    axiosInstance.get('/allocation/my-bus').then((res) => setBus(res.data)).catch(() => {});
  }, []);

  const isPresent = attendance?.status === 'present';
  const hasBus = bus && bus.busId;

  return (
    <div>
      <div className="topbar">
        <div className="topbar__brand">
          <span className="topbar__brand-dot" />
          College Transit
        </div>
        <div className="topbar__user">
          <span className="chip">Student</span>
          <span>{name}</span>
          <button className="btn btn--ghost" onClick={logout}>Log out</button>
        </div>
      </div>

      <div className="page">
        <div className="page__eyebrow">Today</div>
        <h1 className="page__title">Welcome back, {name?.split(' ')[0]}</h1>

        <div className="grid" style={{ marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-card__label">Attendance</div>
            <span className={`badge ${isPresent ? 'badge--success' : 'badge--pending'}`}>
              {isPresent ? 'Present' : 'Not marked'}
            </span>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Bus status</div>
            <span className={`badge ${hasBus ? 'badge--success' : 'badge--pending'}`}>
              {hasBus ? 'Allocated' : 'Awaiting allocation'}
            </span>
          </div>
        </div>

        {hasBus ? (
          <div className="ticket">
            <div className="ticket__row">
              <div>
                <div className="ticket__label">Bus</div>
                <div className="ticket__value">{bus.busId.busNumber}</div>
              </div>
              <div>
                <div className="ticket__label">Seat</div>
                <div className="ticket__seat">{bus.seatNumber}</div>
              </div>
            </div>
            <div className="ticket__stub">
              <span>{bus.busId.driverName}</span>
              <span>{bus.busId.parkingSlotNumber}</span>
            </div>
          </div>
        ) : (
          <div className="ticket ticket--empty">
            <div className="ticket__label">Bus assignment</div>
            <div className="ticket__value">Not allocated yet &mdash; mark attendance to be included in today's run.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;