import {
    Routes,
    Route,
    Navigate
} from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/student/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (<Routes> <Route path="/login" element={<Login />} /> <Route path="/student/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} /> <Route path="/admin/dashboard" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} /> <Route path="*" element={<Navigate to="/login" />} /> </Routes>);
}
export default App;