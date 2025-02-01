// src/pages/Admin.js
import React from 'react';
import '../styles/auth_style.css';
import AuthFonImage from "../components/AuthFonImage";
import AuthInput from "../components/AuthInput";
import AuthHeader from "../components/AuthHeader";
import { useRegistration } from '../hooks/useRegistration';

const Admin = () => {
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

    return (
        <div className="auth_container">
            <AuthHeader/>

            <main className="main_container">
                <form onSubmit={handleSubmit} className="auth_form">
                    <div className="select_container">
                        <h2 className="auth_title">Create account.</h2>
                        <div className="auth_inputGroup">
                            <select value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="auth_select">
                                <option value="University">University</option>
                                <option value="Company">Company</option>
                            </select>
                        </div>
                    </div>

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

                    <button type="submit" className="auth_button">Create {role.charAt(0).toUpperCase() + role.slice(1)}  ➜</button>
                </form>

                {error && <p className="auth_error">{error}</p>}

                <AuthFonImage/>
            </main>
        </div>
    );
};

export default Admin;

// import React, { useState } from 'react';
// import '../styles/auth_style.css';
// import AuthFonImage from "../components/AuthFonImage";
// import AuthInput from "../components/AuthInput";
// import AuthHeader from "../components/AuthHeader";
//
// const Admin = () => {
//     const [role, setRole] = useState('University');
//
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//
//         const token = localStorage.getItem("authToken");
//
//         const baseUrl = "http://localhost:8080/auth";
//         let url = '';
//
//         switch (role.toLowerCase()) {
//             case 'university':
//                 url = `${baseUrl}/university/registration`;
//                 break;
//             case 'company':
//                 url = `${baseUrl}/company/registration`;
//                 break;
//         }
//
//         console.log(url);
//
//         try {
//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     role: role.toUpperCase(),
//                     username,
//                     email,
//                     password,
//                 }),
//             });
//
//             const data = await response.json();
//             if (response.ok) {
//                 console.log('Registration successful', data);
//                 alert('Registration successful');
//             } else {
//                 console.log('Registration failed', data.message);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };
//
//     return (
//         <div className="auth_container">
//             <AuthHeader/>
//
//             <main className="main_container">
//                 <form onSubmit={handleSubmit} className="auth_form">
//                     <div className="select_container">
//                         <h2 className="auth_title">Create account.</h2>
//                         <div className="auth_inputGroup">
//                             <select value={role}
//                                     onChange={(e) => setRole(e.target.value)}
//                                     className="auth_select">
//                                 <option value="University">University</option>
//                                 <option value="Company">Company</option>
//                             </select>
//                         </div>
//                     </div>
//
//
//                     <AuthInput
//                         type="text"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         placeholder="Username"
//                     />
//
//                     <AuthInput
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder="Email"
//                     />
//
//                     <AuthInput
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="Password"
//                     />
//
//                     <button type="submit" className="auth_button">Create {role.charAt(0).toUpperCase() + role.slice(1)}  ➜</button>
//                 </form>
//
//
//                 <AuthFonImage/>
//             </main>
//         </div>
//     );
// };
//
// export default Admin;
