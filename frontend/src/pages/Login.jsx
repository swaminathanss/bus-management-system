import {
    useState,
    useContext
} from 'react';
import {
    useNavigate
} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
    AuthContext
} from '../context/AuthContext';
const Login = () => {
    const [registerNumber, setRegisterNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {
        login
    } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axiosInstance.post('/auth/login', {
                registerNumber,
                password
            });
            login(res.data);
            if (res.data.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };
    return (<div style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'sans-serif' }}> <h2>College Bus Login</h2> <form onSubmit={handleSubmit}> <div style={{ marginBottom: 12 }}> <label>Register Number</label> <br /> <input type="text" value={registerNumber} onChange={(e) => setRegisterNumber(e.target.value)} style={{ width: '100%', padding: 8 }} required /> </div> <div style={{ marginBottom: 12 }}> <label>Password</label> <br /> <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 8 }} required /> </div> {error && <p style={{ color: 'red' }}>{error}</p>} <button type="submit" style={{ width: '100%', padding: 10 }}>Login</button> </form> </div>);
};
export default Login;