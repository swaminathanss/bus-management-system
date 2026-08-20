import {
    Routes,
    Route,
    Navigate
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import TeacherDashboard from './pages/teacher/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBuses from './pages/admin/Buses';
import AdminFleet from './pages/admin/Fleet';
import AdminDrivers from './pages/admin/Drivers';
import AdminLocations from './pages/admin/Locations';
import AdminAcademics from './pages/admin/Academics';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (<Routes> <Route path="/login" element={<Login />} /> <Route path="/register" element={<Register />} /> <Route path="/student/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} /> <Route path="/teacher/dashboard" element={<PrivateRoute teacherOnly><TeacherDashboard /></PrivateRoute>} /> <Route path="/admin/dashboard" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} /> <Route path="/admin/buses" element={<PrivateRoute adminOnly><AdminBuses /></PrivateRoute>} /> <Route path="/admin/fleet" element={<PrivateRoute adminOnly><AdminFleet /></PrivateRoute>} /> <Route path="/admin/drivers" element={<PrivateRoute adminOnly><AdminDrivers /></PrivateRoute>} /> <Route path="/admin/locations" element={<PrivateRoute adminOnly><AdminLocations /></PrivateRoute>} /> <Route path="/admin/academics" element={<PrivateRoute adminOnly><AdminAcademics /></PrivateRoute>} /> <Route path="*" element={<Navigate to="/login" />} /> </Routes>);
}
export default App;