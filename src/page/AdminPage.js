import React, { useState } from 'react';
import '../style/admin_style.css';

const AdminPage = () => {
    const [role, setRole] = useState('university');

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

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

            } else {
                console.log('Registration failed', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="admin-page">
            <h1>Admin Page</h1>

            <form onSubmit={handleSubmit} className="admin-form">
                <h2>Create {role.charAt(0).toUpperCase() + role.slice(1)}</h2>

                    <div className="auth_inputGroup">
                        <select value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="admin_select">
                            <option value="university">University</option>
                            <option value="company">Company</option>
                        </select>
                    </div>


                    <div className="admin_inputGroup">
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Username"
                            className="admin_input"
                        />
                    </div>
                    <div className="admin_inputGroup">
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email"
                            className="admin_input"
                        />
                    </div>
                    <div className="admin_inputGroup">
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Password"
                            className="admin_input"
                        />
                    </div>


                    <button type="submit">Create {role.charAt(0).toUpperCase() + role.slice(1)}</button>
            </form>
        </div>

    );
};

export default AdminPage;
