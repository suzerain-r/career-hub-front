import React from "react";
import "../styles/auth_style.css";

const AuthInput = ({type, value, onChange, placeholder}) => {

    return (
        <div className="auth_inputGroup">
            <input
                type={type}
                value={value}
                onChange={onChange}
                required
                placeholder={placeholder}
                className="auth_input"
            />
        </div>
    );
};

export default AuthInput;
