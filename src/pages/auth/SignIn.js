import React, { useState } from 'react';
import '../../styles/auth_style.css';
import { useNavigate } from 'react-router-dom';
import AuthFonImage from "../../components/AuthFonImage";
import AuthInput from "../../components/AuthInput";
import AuthHeader from "../../components/AuthHeader";
import { login } from '../../services/authService';
import {getRoleFromToken} from "../../utils/jwtDecode";

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const result = await login(username, password);

        if (result.success) {
            const role = getRoleFromToken().toUpperCase();
            if (role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            console.log('Login failed:', result.message);
        }
    };


    return (
        <div className="auth_container">
            <AuthHeader/>

            <main className="main_container">
                <form onSubmit={handleLogin} className="auth_form">
                    <h2 className="auth_title">Sign In</h2>

                    <AuthInput
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />

                    <AuthInput
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />

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


                <AuthFonImage/>
            </main>
        </div>
    )
};

export default SignIn;
