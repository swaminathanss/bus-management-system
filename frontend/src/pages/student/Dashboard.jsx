import {
    useContext
} from 'react';
import {
    AuthContext
} from '../../context/AuthContext';
const StudentDashboard = () => {
    const {
        name,
        logout
    } = useContext(AuthContext);
    return (<div style={{ padding: 40, fontFamily: 'sans-serif' }}> <h2>Welcome, {name}</h2> <p>Student dashboard — attendance, my bus, location change coming soon</p> <button onClick={logout}>Logout</button> </div>);
};
export default StudentDashboard;