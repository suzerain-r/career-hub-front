import React, { useState } from 'react';
import '../style/auth_style.css';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();


        const baseUrl = "http://localhost:8080";
        const url = `${baseUrl}/auth/login`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Login successful', data);
                localStorage.setItem('authToken', data.token);
                const decodedToken = jwtDecode(data.token);
                switch (decodedToken['user-role']){
                    case "ADMIN" :
                        navigate('/admin');
                        break;
                    default:
                        navigate('/');
                }
                if(decodedToken['user-role'] === "ADMIN"){
                    navigate('/admin');
                }
                else{
                    navigate('/')
                }
            } else {
                console.log('Login failed', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div className="auth_container">
            <form onSubmit={handleLogin} className="auth_form">
                <h2 className="auth_title">Login</h2>
                <div className="auth_inputGroup">
                    <input
                        type="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Username"
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

                <div className="auth_rememberMeAndForgotPassword">
                    <label className="auth_checkboxLabel">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className="auth_checkbox"
                        />
                        Remember me
                    </label>
                    <button type="button" className="auth_linkButton">
                        Forgot password?
                    </button>
                </div>
                <button type="submit" className="auth_button">Sign In</button>

            </form>
        </div>
    );
};

export default SignIn;
