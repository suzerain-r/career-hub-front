import React, {useEffect, useState} from 'react';
import '../styles/header.css';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as ProfileIcon } from '../assets/profile.svg';
import logo from '../assets/logo.svg';
import {jwtDecode} from "jwt-decode";
import {getRoleFromToken} from "../utils/jwtDecode";

const Header = () => {

    const location = useLocation();
    const token = localStorage.getItem("authToken");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (token) {
            try {
                setUserRole(getRoleFromToken().toUpperCase());
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, [token]);

    const handleProfileClick = () => {
        setShowModal((prev) => !prev);
    };

    const handleLogoutClick = () => {
        handleLogout();
        setShowModal(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setUserRole(null); // Reset the user role on logout
        navigate('/');
    };

    const handleProfileRedirect = () => {
        switch (userRole) {
            case "STUDENT":
                navigate('/student-profile');
                break;
            case "UNIVERSITY":
                navigate('/university-profile');
                break;
            case "COMPANY":
                navigate('/company-profile');
                break;
            default:
                console.error("Unknown user role:", userRole);
        }
    };

    const handleCreateStudentRedirect = () => {
        navigate('/create-student');
    };

    return (
        <header className="common_header">
            <div className="header_logo_container">
                <img src={logo} className="header_logo" alt={""}></img>
                <div className="header_logo_text">CareerHub</div>
            </div>
            {token && (
                <nav className="header_nav">
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                    <Link to="/candidates" className={location.pathname === '/candidates' ? 'active' : ''}>Candidates</Link>
                    <Link to="/universities" className={location.pathname === '/universities' ? 'active' : ''}>Universities</Link>
                    <Link to="/companies" className={location.pathname === '/companies' ? 'active' : ''}>Companies</Link>
                </nav>
            )}
            <div className="header_auth">
                {isAuthenticated ? (
                    <div className="header_profile_container">
                        <div className="header_profile_icon" onClick={handleProfileClick}>
                            <ProfileIcon className="profile_icon_svg" />
                        </div>
                        {showModal && (
                            <div className="header_profile_modal">
                                {["STUDENT", "COMPANY"].includes(userRole) && (
                                    <>
                                        <button onClick={handleProfileRedirect} className="header_profile_modal_button">Profile</button>
                                        <button onClick={handleLogoutClick} className="header_profile_modal_logout_button">Log Out</button>
                                    </>
                                )}
                                {userRole === "UNIVERSITY" && (
                                    <>
                                        <button onClick={handleProfileRedirect} className="header_profile_modal_button">Profile</button>
                                        <button onClick={handleCreateStudentRedirect} className="header_profile_modal_button">Create Student</button>
                                        <button onClick={handleLogoutClick} className="header_profile_modal_logout_button">Log Out</button>
                                    </>
                                )}
                                {userRole === "ADMIN" && (
                                    <>
                                        <button onClick={handleLogoutClick}
                                                className="header_profile_modal_logout_button">Log Out
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <button onClick={() => navigate('/signin')} className="header_sign_in">Sign In</button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
