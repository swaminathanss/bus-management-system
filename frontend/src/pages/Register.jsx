import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Register = () => {
  const [locations, setLocations] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [form, setForm] = useState({
    registerNumber: '',
    password: '',
    confirmPassword: '',
    name: '',
    mobileNumber: '',
    email: '',
    defaultLocation: '',
    classSectionId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/locations').then((res) => setLocations(res.data)).catch(() => {});
    axiosInstance.get('/class-sections').then((res) => setClassSections(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { confirmPassword, ...payload } = form;
      await axiosInstance.post('/auth/register', { ...payload, role: 'student' });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth">
      <div className="auth__hero">
        <div>
          <div className="page__eyebrow" style={{ color: 'rgba(255,255,255,0.5)' }}>College Transit</div>
          <h1 className="auth__hero-title">Join the route.</h1>
          <p className="auth__hero-sub">Register once with your details and drop-off point &mdash; we'll take it from there every day.</p>
        </div>
        <div className="auth__hero-route" />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>NEW STUDENT SIGN-UP</div>
      </div>
      <div className="auth__panel">
        <form className="auth__card" onSubmit={handleSubmit}>
          <h2 style={{ fontSize: 24, marginBottom: 4 }}>Create your account</h2>
          <p style={{ color: 'var(--color-ink-soft)', fontSize: 14, marginBottom: 24 }}>
            Already registered? <Link to="/login" style={{ color: 'var(--color-ink)' }}>Sign in</Link>
          </p>

          <div className="field">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Register Number</label>
            <input name="registerNumber" value={form.registerNumber} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Mobile Number</label>
            <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Class</label>
            <select
              name="classSectionId"
              value={form.classSectionId}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid var(--color-line)', fontFamily: 'var(--font-body)', fontSize: 15 }}
            >
              <option value="">Select your class</option>
              {classSections.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Drop-off Location</label>
            <select
              name="defaultLocation"
              value={form.defaultLocation}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid var(--color-line)', fontFamily: 'var(--font-body)', fontSize: 15 }}
            >
              <option value="">Select a location</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id}>{loc.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
          </div>

          {error && <p className="form-error">{error}</p>}
          {success && <p style={{ color: 'var(--color-success)', fontSize: 13, marginBottom: 14 }}>Account created! Redirecting to login...</p>}

          <button type="submit" className="btn btn--primary btn--block">Create account</button>
        </form>
      </div>
    </div>
  );
};

export default Register;