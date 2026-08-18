 import {
     useContext
 } from 'react';
 import {
     AuthContext
 } from '../../context/AuthContext';
 const AdminDashboard = () => {
     const {
         name,
         logout
     } = useContext(AuthContext);
     return (<div style={{ padding: 40, fontFamily: 'sans-serif' }}> <h2>Welcome, {name} (Admin)</h2> <p>Admin dashboard — bus management, tickets coming soon</p> <button onClick={logout}>Logout</button> </div>);
 };
 export default AdminDashboard;