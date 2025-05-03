// src/pages/Admin.js
import React, { useState } from 'react';
import '../../styles/auth_style.css';
import AuthFonImage from "../../components/AuthFonImage";
import AuthInput from "../../components/AuthInput";
import AuthHeader from "../../components/AuthHeader";
import { register } from '../../services/authService';

const Admin = () => {

    const [role, setRole] = useState('University');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        const result = await register(role, username, email, password);

        if (result.success) {
            console.log('Registration successful', result.data);
            alert('Registration successful');
        } else {
            console.log('Registration failed:', result.message);
            alert(`Registration failed: ${result.message}`);
        }
    };


    return (
        <div className="auth_container">
            <AuthHeader/>

            <main className="main_container">
                <form onSubmit={handleRegister} className="auth_form">
                    <div className="select_container">
                        <h2 className="auth_title">Create account.</h2>
                        <div className="auth_inputGroup">
                            <select value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="auth_select">
                                <option value="University">University</option>
                                <option value="Company">Company</option>
                            </select>
                        </div>
                    </div>

                    <AuthInput
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />

                    <AuthInput
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />

                    <AuthInput
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />

                    <button type="submit" className="auth_button">Create {role.charAt(0).toUpperCase() + role.slice(1)}  ➜</button>
                </form>

                {/*{error && <p className="auth_error">{error}</p>}*/}

                <AuthFonImage/>
            </main>
        </div>
    );
};

export default Admin;

