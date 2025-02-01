// src/hooks/useRegistration.js
import { useState } from 'react';
import { register } from '../services/registrationService';

export const useRegistration = () => {
    const [role, setRole] = useState('University');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("authToken");

        const { success, data, message } = await register(role, username, email, password, token);

        if (success) {
            console.log('Registration successful', data);
            alert('Registration successful');
        } else {
            setError(message);
        }
    };

    return {
        role,
        setRole,
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        handleSubmit,
        error
    };
};
