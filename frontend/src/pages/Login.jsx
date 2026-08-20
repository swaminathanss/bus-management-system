import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [registerNumber, setRegisterNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axiosInstance.post('/auth/login', { registerNumber, password });
      login(res.data);
      if (res.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (res.data.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth">
      <div className="auth__hero">
        <div>
          <div className="page__eyebrow" style={{ color: 'rgba(255,255,255,0.5)' }}>College Transit</div>
          <h1 className="auth__hero-title">Every seat, accounted for.</h1>
          <p className="auth__hero-sub">Sign in to mark attendance, check your bus assignment, or manage today's routes.</p>
        </div>
        <div className="auth__hero-route" />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>ROUTE A &mdash; ROUTE F</div>
      </div>
      <div className="auth__panel">
        <form className="auth__card" onSubmit={handleSubmit}>
          <h2 style={{ fontSize: 24, marginBottom: 4 }}>Sign in</h2>
          <p style={{ color: 'var(--color-ink-soft)', fontSize: 14, marginBottom: 28 }}>
            New here? <Link to="/register" style={{ color: 'var(--color-ink)' }}>Create an account</Link>
          </p>
          <div className="field">
            <label>Register Number</label>
            <input type="text" value={registerNumber} onChange={(e) => setRegisterNumber(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn--primary btn--block">Sign in</button>
        </form>
      </div>
    </div>
  );
};

export default Login;