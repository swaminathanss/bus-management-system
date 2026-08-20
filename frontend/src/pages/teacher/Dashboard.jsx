import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import axiosInstance from '../../api/axiosInstance';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TeacherDashboard = () => {
  const { name, logout } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [entries, setEntries] = useState([]);
  const [openWindows, setOpenWindows] = useState({});
  const [now, setNow] = useState(Date.now());

  const today = DAYS[new Date().getDay()];

  useEffect(() => {
    axiosInstance.get('/timetable/mine').then((res) => setEntries(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const openAttendance = async (entry) => {
    try {
      const res = await axiosInstance.post('/attendance-windows', {
        classSectionId: entry.classSectionId._id,
        subjectId: entry.subjectId._id,
        periodNumber: entry.periodNumber
      });
      setOpenWindows({ ...openWindows, [entry._id]: res.data.closesAt });
      showToast(`Attendance window opened for ${entry.classSectionId.name}, Period ${entry.periodNumber} \u2014 closes in 3:00`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to open attendance window', 'error');
    }
  };

  const todayEntries = entries.filter((e) => e.dayOfWeek === today);

  return (
    <div>
      <div className="topbar">
        <div className="topbar__brand">
          <span className="topbar__brand-dot" />
          College Transit
        </div>
        <div className="topbar__user">
          <span className="chip">Teacher</span>
          <span>{name}</span>
          <button className="btn btn--ghost" onClick={logout}>Log out</button>
        </div>
      </div>

      <div className="page">
        <div className="page__eyebrow">{today}</div>
        <h1 className="page__title">Your classes today</h1>

        {todayEntries.length === 0 ? (
          <p style={{ color: 'var(--color-ink-soft)' }}>No classes scheduled for today.</p>
        ) : (
          <div className="grid">
            {todayEntries.map((entry) => {
              const closesAt = openWindows[entry._id];
              const secondsLeft = closesAt ? Math.max(0, Math.round((new Date(closesAt) - now) / 1000)) : 0;
              const isOpen = secondsLeft > 0;
              const mins = Math.floor(secondsLeft / 60);
              const secs = secondsLeft % 60;

              return (
                <div key={entry._id} className="stat-card">
                  <div className="stat-card__label">Period {entry.periodNumber} &mdash; {entry.classSectionId?.name}</div>
                  <div style={{ fontSize: 14, marginBottom: 10 }}>{entry.subjectId?.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-ink-soft)', marginBottom: 12 }}>
                    {entry.startTime} &ndash; {entry.endTime}
                  </div>
                  {isOpen ? (
                    <span className="badge badge--success">OPEN &mdash; closes in {mins}:{secs.toString().padStart(2, '0')}</span>
                  ) : (
                    <button className="btn btn--primary" style={{ fontSize: 13, padding: '8px 14px' }} onClick={() => openAttendance(entry)}>
                      Open Attendance
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;