// src/hooks/useAuth.js
import { useState } from 'react';
import { login } from '../services/authService';
import {useNavigate} from "react-router-dom";

export const useAuth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const [decodedToken, setDecodedToken] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();

        const { success, decodedToken, message } = await login(username, password);
        if (success) {
            // setIsAuthenticated(true);
            // setDecodedToken(decodedToken);
            // return { success: true };
            if (decodedToken['user-role'] === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            // setIsAuthenticated(false);
            setError(message);
            return { success: false, message };
        }
    };

    const logOut = () => {
        localStorage.removeItem('authToken');
        // setIsAuthenticated(false);
        // setDecodedToken(null);
    };

    return { username, setUsername, password, setPassword, rememberMe, setRememberMe, handleLogin, logOut, error };

    // return { isAuthenticated, decodedToken, handleLogin, logOut, error };
};
