import React from "react";
import "../styles/auth_style.css";
import logo from "../assets/logo.svg";

const AuthHeader = () => {

    return (
        <header className="header">
            <div className="logo_container">
                <img src={logo} className="header_logo" alt={""}></img>
                <div className="header_logo_text">CareerHub</div>
            </div>
        </header>
    );
};

export default AuthHeader;
