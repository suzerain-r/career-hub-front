import React, { useState } from 'react';
import '../../styles/auth_style.css';
import AuthInput from "../../components/AuthInput";
import AuthHeader from "../../components/AuthHeader";
import AuthFonImage from "../../components/AuthFonImage";

const ResetPassword = () => {

    const [pass, setPass] = useState('');
    const [rePass, setRePass] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();

    };

    return (
        <div className="auth_container">
            <AuthHeader/>
            <main className="main_container">
                <form onSubmit={handleResetPassword} className="auth_form">
                    <h2 className="auth_title">Reset Password</h2>


                    <AuthInput
                        type="password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        placeholder="New password"
                    />

                    <AuthInput
                        type="password"
                        value={pass}
                        onChange={(e) => setRePass(e.target.value)}
                        placeholder="Verify password"
                    />

                    <button type="submit" className="auth_button">Reset Password</button>

                </form>

                <AuthFonImage/>
            </main>

        </div>
    );
};

export default ResetPassword;
