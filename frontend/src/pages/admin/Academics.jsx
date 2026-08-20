import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import axiosInstance from '../../api/axiosInstance';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const PERIOD_TIMES = {
  1: ['09:00', '10:00'],
  2: ['10:00', '11:00'],
  3: ['11:00', '12:00'],
  4: ['13:15', '14:15'],
  5: ['14:15', '15:15'],

};

const formatTime = (t) => {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
};

const AdminAcademics = () => {
  const { name, logout } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [classSections, setClassSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [timetable, setTimetable] = useState([]);

  const [classForm, setClassForm] = useState({ name: '' });
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '' });
  const [ttForm, setTtForm] = useState({
    classSectionId: '', dayOfWeek: 'Monday', periodNumber: '1', subjectId: '', teacherId: ''
  });

  const loadData = () => {
    axiosInstance.get('/class-sections').then((res) => setClassSections(res.data)).catch(() => {});
    axiosInstance.get('/subjects').then((res) => setSubjects(res.data)).catch(() => {});
    axiosInstance.get('/auth/teachers').then((res) => setTeachers(res.data)).catch(() => {});
    axiosInstance.get('/timetable').then((res) => setTimetable(res.data)).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitClass = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/class-sections', classForm);
      setClassForm({ name: '' });
      showToast('Class section added');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add class section', 'error');
    }
  };

  const submitSubject = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/subjects', subjectForm);
      setSubjectForm({ name: '', code: '' });
      showToast('Subject added');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add subject', 'error');
    }
  };

  const submitTimetable = async (e) => {
    e.preventDefault();
    try {
      const [startTime, endTime] = PERIOD_TIMES[Number(ttForm.periodNumber)];
      await axiosInstance.post('/timetable', { ...ttForm, periodNumber: Number(ttForm.periodNumber), startTime, endTime });
      setTtForm({ classSectionId: '', dayOfWeek: 'Monday', periodNumber: '1', subjectId: '', teacherId: '' });
      showToast('Timetable entry added');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add timetable entry', 'error');
    }
  };

  const previewRange = PERIOD_TIMES[Number(ttForm.periodNumber)];

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
        <h1 className="page__title">Academics &amp; Timetable</h1>

        <div className="grid" style={{ marginBottom: 24, gridTemplateColumns: '1fr 1fr' }}>
          <form onSubmit={submitClass} className="stat-card">
            <div className="stat-card__label">Add a class section</div>
            <div className="field">
              <label>Class Name</label>
              <input value={classForm.name} onChange={(e) => setClassForm({ name: e.target.value })} placeholder="e.g. CSE-A" required />
            </div>
            <button type="submit" className="btn btn--primary">Add Class</button>
          </form>

          <form onSubmit={submitSubject} className="stat-card">
            <div className="stat-card__label">Add a subject</div>
            <div className="field">
              <label>Subject Name</label>
              <input value={subjectForm.name} onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })} required />
            </div>
            <div className="field">
              <label>Code (optional)</label>
              <input value={subjectForm.code} onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })} />
            </div>
            <button type="submit" className="btn btn--primary">Add Subject</button>
          </form>
        </div>

        <form onSubmit={submitTimetable} className="stat-card" style={{ marginBottom: 24 }}>
          <div className="stat-card__label">Add a timetable entry</div>
          <div className="grid" style={{ gap: 12, marginBottom: 12 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Class</label>
              <select value={ttForm.classSectionId} onChange={(e) => setTtForm({ ...ttForm, classSectionId: e.target.value })} required style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid var(--color-line)' }}>
                <option value="">Select class</option>
                {classSections.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Day</label>
              <select value={ttForm.dayOfWeek} onChange={(e) => setTtForm({ ...ttForm, dayOfWeek: e.target.value })} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid var(--color-line)' }}>
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>{previewRange ? `Period (${formatTime(previewRange[0])} - ${formatTime(previewRange[1])})` : 'Period'}</label>
              <select value={ttForm.periodNumber} onChange={(e) => setTtForm({ ...ttForm, periodNumber: e.target.value })} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid var(--color-line)' }}>
                <option value="1">Period 1 ({formatTime(PERIOD_TIMES[1][0])} - {formatTime(PERIOD_TIMES[1][1])})</option>
                <option value="2">Period 2 ({formatTime(PERIOD_TIMES[2][0])} - {formatTime(PERIOD_TIMES[2][1])})</option>
                <option value="3">Period 3 ({formatTime(PERIOD_TIMES[3][0])} - {formatTime(PERIOD_TIMES[3][1])})</option>
                <option disabled>&#8212; Lunch Break (12:00 PM - 1:15 PM) &#8212;</option>
                <option value="4">Period 4 ({formatTime(PERIOD_TIMES[4][0])} - {formatTime(PERIOD_TIMES[4][1])})</option>
                <option value="5">Period 5 ({formatTime(PERIOD_TIMES[5][0])} - {formatTime(PERIOD_TIMES[5][1])})</option>
               
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Subject</label>
              <select value={ttForm.subjectId} onChange={(e) => setTtForm({ ...ttForm, subjectId: e.target.value })} required style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid var(--color-line)' }}>
                <option value="">Select subject</option>
                {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Teacher</label>
              <select value={ttForm.teacherId} onChange={(e) => setTtForm({ ...ttForm, teacherId: e.target.value })} required style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid var(--color-line)' }}>
                <option value="">Select teacher</option>
                {teachers.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn--primary">Add Timetable Entry</button>
        </form>

        <div className="grid">
          {timetable.map((entry) => (
            <div key={entry._id} className="stat-card">
              <div className="stat-card__label">{entry.classSectionId?.name} &mdash; {entry.dayOfWeek}, Period {entry.periodNumber}</div>
              <div style={{ fontSize: 13, color: 'var(--color-ink-soft)' }}>
                {entry.subjectId?.name} &middot; {entry.teacherId?.name}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, marginTop: 6 }}>
                {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAcademics;