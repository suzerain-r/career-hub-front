import React, { useState } from 'react';
import '../../styles/auth_style.css';
import AuthFonImage from "../../components/AuthFonImage";
import AuthInput from "../../components/AuthInput";
import AuthHeader from "../../components/AuthHeader";
import { register } from '../../services/authService';

const CreateStudent = () => {

    const role = 'Student';
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
                    <h2 className="auth_title">Create Student</h2>


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

                    <button type="submit" className="auth_button">Create Student ➜</button>
                </form>

                <AuthFonImage/>
            </main>
        </div>

    );
};

export default CreateStudent;
