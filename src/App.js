import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Candidates from "./pages/Candidates";
import Universities from "./pages/Universities";
import Companies from "./pages/Companies";
import StudentProfile from "./pages/StudentProfile";
import UniversityProfile from "./pages/UniversityProfile";
import CompanyProfile from "./pages/CompanyProfile";
import Admin from "./pages/Admin";
import CreateStudent from "./pages/CreateStudent";


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