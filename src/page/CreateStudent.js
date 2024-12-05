import React, { useState } from 'react';
import '../style/create_student_style.css';

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
        <div className="create-student-page">
            <form onSubmit={handleSubmit} className="create-student-form">
                <h2>Create Student</h2>

                <div className="create-student_inputGroup">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Username"
                        className="create-student_input"
                    />
                </div>
                <div className="create-student_inputGroup">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Email"
                        className="create-student_input"
                    />
                </div>
                <div className="create-student_inputGroup">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                        className="create-student_input"
                    />
                </div>

                <button type="submit">Create Student</button>
            </form>
        </div>

    );
};

export default CreateStudent;
