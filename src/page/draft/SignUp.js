import React, { useState } from 'react';
import '../style/auth_style.css';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

const SignUp = () => {
    const [role, setRole] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();



    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const baseUrl = "http://localhost:8080";
        const url = `${baseUrl}/auth/registration`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role: role.toUpperCase(),
                    username,
                    email,
                    password,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Registration successful', data);
                navigate('/signin');
            } else {
                console.log('Registration failed', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };



    return (
        <div className="auth_container">
            <form onSubmit={handleSignUp} className="auth_form">
                <h2 className="auth_title">Sign Up</h2>
                <div className="auth_inputGroup">
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="auth_select"
                    >
                        <option value="" disabled>Select Type</option>
                        <option value="Company">Company</option>
                        <option value="University">University</option>
                        <option value="Student">Student</option>
                    </select>
                </div>
                <div className="auth_inputGroup">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Username"
                        className="auth_input"
                    />
                </div>
                <div className="auth_inputGroup">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Email"
                        className="auth_input"
                    />
                </div>
                <div className="auth_inputGroup">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                        className="auth_input"
                    />
                </div>
                <div className="auth_inputGroup">
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm Password"
                        className="auth_input"
                    />
                </div>
                <button type="submit" className="auth_button">Sign Up</button>
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="auth_linkButton"
                >
                    Already have an account? Login
                </button>
            </form>
        </div>
    );
};

export default SignUp;
