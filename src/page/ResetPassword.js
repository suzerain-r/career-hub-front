import React, { useState } from 'react';
import '../style/auth_style.css';

const ResetPassword = () => {

    const baseUrl = "http://localhost:8080";
    const [pass, setPass] = useState('');
    const [rePass, setRePass] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${baseUrl}/?`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({  }),
            });

            const data = await response.json();
            if (response.ok) {

            } else {

            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="auth_container">
            <form onSubmit={handleResetPassword} className="auth_form">
                <h2 className="auth_title">Reset Password</h2>
                <div className="auth_inputGroup">
                    <input
                        type="password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        required
                        placeholder="New password"
                        className="auth_input"
                    />
                </div>

                <div className="auth_inputGroup">
                    <input
                        type="password"
                        value={rePass}
                        onChange={(e) => setRePass(e.target.value)}
                        required
                        placeholder="Verify password"
                        className="auth_input"
                    />
                </div>

                <button type="submit" className="auth_button">Reset Password</button>

            </form>

        </div>
    );
};

export default ResetPassword;
