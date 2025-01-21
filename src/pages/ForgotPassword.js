import React, { useState } from 'react';
import '../styles/auth_style.css';
import { useNavigate } from "react-router-dom";
import AuthFonImage from "../components/AuthFonImage";
import AuthInput from "../components/AuthInput";
import AuthHeader from "../components/AuthHeader";

const ForgotPassword = () => {

    const baseUrl = "http://localhost:8080";
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('${baseUrl}/?', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('You have sent to your email confirmation code!!!');
            } else {
                setMessage(data.message || 'Failed to send reset email');
            }
        } catch (error) {
            setMessage('Error sending email. Please try again later.');
            console.error('Error:', error);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseUrl}/?`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/reset-password');
            } else {
                setMessage(data.message || 'Invalid code. Please try again.');
            }
        } catch (error) {
            setMessage('Error verifying code. Please try again later.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="auth_container">
            <AuthHeader/>

            <main className="main_container">

                <form className="auth_form">
                    <h2 className="auth_title">Forgot Password</h2>


                    <AuthInput
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <button onClick={handleForgotPassword} className="auth_button">
                        Reset Password
                    </button>


                    <AuthInput
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Confirmation Code"
                    />
                    <button onClick={handleVerifyCode} className="auth_button">
                        Verify Code
                    </button>

                    <p className="auth_resend-text">
                        Didn’t receive any code?{''}
                        <button
                            onClick={handleForgotPassword}
                            type="button"
                            className="auth_linkButton"
                        >
                            Resend
                        </button>
                    </p>


                </form>

                <AuthFonImage/>
            </main>

        </div>
    );
};

export default ForgotPassword;
