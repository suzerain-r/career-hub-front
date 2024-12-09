import React, { useState } from 'react';
import '../style/auth_style.css';
import logo from '../resources/logo.svg';
import fonImage from '../resources/auth-fon-image.png';

const Admin = () => {
    const [role, setRole] = useState('University');

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("authToken");

        const baseUrl = "http://localhost:8080/auth";
        let url = '';

        switch (role.toLowerCase()) {
            case 'university':
                url = `${baseUrl}/university/registration`;
                break;
            case 'company':
                url = `${baseUrl}/company/registration`;
                break;
        }

        console.log(url);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
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

            } else {
                console.log('Registration failed', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="auth_container">
            <header className="header">
                <div className="logo_container">
                    <img src={logo} className="header_logo"></img>
                    <div className="header_logo_text">CareerHub</div>
                </div>
            </header>

            <main className="main_container">
                <form onSubmit={handleSubmit} className="auth_form">
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

                    <div className="auth_inputGroup">
                        <input
                            type="text"
                            name="username"
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
                            name="email"
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
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Password"
                            className="auth_input"
                        />
                    </div>
                    <button type="submit" className="auth_button">Create {role.charAt(0).toUpperCase() + role.slice(1)}  ➜</button>
                </form>

                <div className="fon_image_container">
                    <img
                        src={fonImage}
                        className="fonImage"
                    />
                </div>
            </main>
        </div>
    );
};

export default Admin;
