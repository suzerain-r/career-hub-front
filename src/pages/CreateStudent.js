import React, { useState } from 'react';
import '../styles/auth_style.css';
import AuthFonImage from "../components/AuthFonImage";
import AuthInput from "../components/AuthInput";
import AuthHeader from "../components/AuthHeader";
import {useRegistration} from "../hooks/useRegistration";

const CreateStudent = () => {

    const {
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
    } = useRegistration();

    setRole("Student");

    // const [username, setUsername] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    //
    //
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //
    //     const baseUrl = "http://localhost:8080/auth";
    //     const url = `${baseUrl}/student/registration`;
    //
    //     const token = localStorage.getItem("authToken");
    //
    //     try {
    //         const response = await fetch(url, {
    //             method: 'POST',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 role: "STUDENT",
    //                 username,
    //                 email,
    //                 password,
    //             }),
    //         });
    //
    //         const data = await response.json();
    //         if (response.ok) {
    //             console.log('Registration successful', data);
    //             alert('Registration successful');
    //         } else {
    //             console.log('Registration failed', data.message);
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };

    return (
        <div className="auth_container">
            <AuthHeader/>
            <main className="main_container">
                <form onSubmit={handleSubmit} className="auth_form">
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
