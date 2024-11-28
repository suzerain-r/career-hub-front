import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/auth_style.css';

const EmailVerification = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleVerify = async () => {
        try {
            const response = await fetch('http://localhost:8080/?', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: verificationCode }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Verification successful');
                navigate('/login');
            } else {
                setErrorMessage(data.message || 'Invalid verification code');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    };



    return (
        <div className="auth_container">
            <form onSubmit={handleVerify} className="auth_form">
                <h2 className="auth_title">Email verification</h2>
                <p className="verification-instruction">
                    We've sent a verification code to your email address.
                </p>
                <div className="auth_inputGroup">
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Verification code"
                        className="auth_input"
                    />
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button type="submit" className="auth_button">Verify My Account</button>

                <p className="resend-text">
                    Didn’t receive any code?{''}
                    <button type="submit" className="auth_linkButton">Resend</button>
                </p>
            </form>
        </div>
    );
};

export default EmailVerification;
