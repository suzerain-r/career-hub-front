import React, { useState } from 'react';
import '../../styles/auth_style.css';
import { useNavigate } from "react-router-dom";
import AuthFonImage from "../../components/AuthFonImage";
import AuthInput from "../../components/AuthInput";
import AuthHeader from "../../components/AuthHeader";

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();

    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();

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
