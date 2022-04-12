import { Navigate } from 'react-router-dom'
import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext';


export function PrivateRoute({ children }) {
    // const auth = useAuth();
    let {user} = useContext(AuthContext)
    return user ? children : <Navigate to="/login" />;
}
