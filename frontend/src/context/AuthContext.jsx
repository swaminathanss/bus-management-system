 import {
     createContext,
     useState
 } from 'react';
 export const AuthContext = createContext();
 export const AuthProvider = ({
     children
 }) => {
     const [token, setToken] = useState(localStorage.getItem('token'));
     const [role, setRole] = useState(localStorage.getItem('role'));
     const [name, setName] = useState(localStorage.getItem('name'));
     const login = (data) => {
         localStorage.setItem('token', data.token);
         localStorage.setItem('role', data.role);
         localStorage.setItem('name', data.name);
         setToken(data.token);
         setRole(data.role);
         setName(data.name);
     };
     const logout = () => {
         localStorage.removeItem('token');
         localStorage.removeItem('role');
         localStorage.removeItem('name');
         setToken(null);
         setRole(null);
         setName(null);
     };
     return (<AuthContext.Provider value={{ token, role, name, login, logout }}> {children} </AuthContext.Provider>);
 };