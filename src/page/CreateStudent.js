import React, { useState } from 'react';
import '../style/auth_style.css';
import logo from "../resources/logo.svg";
import fonImage from "../resources/auth-fon-image.png";

const CreateStudent = () => {



    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        const baseUrl = "http://localhost:8080/auth";
        const url = `${baseUrl}/student/registration`;

        const token = localStorage.getItem("authToken");

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role: "STUDENT",
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
                    <h2 className="auth_title">Create Student</h2>

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

                    <button type="submit" className="auth_button">Create Student ➜</button>
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

export default CreateStudent;
