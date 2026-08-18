import {
    useContext
} from 'react';
import {
    Navigate
} from 'react-router-dom';
import {
    AuthContext
} from '../context/AuthContext';
const PrivateRoute = ({
    children,
    adminOnly
}) => {
    const {
        token,
        role
    } = useContext(AuthContext);
    if (!token) return <Navigate to="/login" />;
    if (adminOnly && role !== 'admin') return <Navigate to="/login" />;
    return children;
};
export default PrivateRoute;