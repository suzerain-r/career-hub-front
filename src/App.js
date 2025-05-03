import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/main/Home';
import SignIn from './pages/auth/SignIn';
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Candidates from "./pages/main/Candidates";
import Universities from "./pages/main/Universities";
import Companies from "./pages/main/Companies";
import StudentProfile from "./pages/profile/StudentProfile";
import UniversityProfile from "./pages/profile/UniversityProfile";
import CompanyProfile from "./pages/profile/CompanyProfile";
import Admin from "./pages/auth/Admin";
import CreateStudent from "./pages/auth/CreateStudent";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/candidates" element={<Candidates />} />
                <Route path="/universities" element={<Universities />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/student-profile" element={<StudentProfile />} />
                <Route path="/university-profile" element={<UniversityProfile />} />
                <Route path="/company-profile" element={<CompanyProfile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/student-profile" element={<StudentProfile />} />
                <Route path="/university-profile" element={<UniversityProfile />} />
                <Route path="/company-profile" element={<CompanyProfile />} />
                <Route path="/create-student" element={<CreateStudent />} />
            </Routes>
        </Router>
    );
};

export default App;