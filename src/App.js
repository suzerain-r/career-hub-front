import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './page/Home';
import SignIn from './page/SignIn';
import ForgotPassword from "./page/ForgotPassword";
import ResetPassword from "./page/ResetPassword";
import Candidates from "./page/Candidates";
import Universities from "./page/Universities";
import Companies from "./page/Companies";
import StudentProfile from "./page/StudentProfile";
import UniversityProfile from "./page/UniversityProfile";
import CompanyProfile from "./page/CompanyProfile";
import AdminPage from "./page/AdminPage";
import CreateStudent from "./page/CreateStudent";


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
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/student-profile" element={<StudentProfile />} />
                <Route path="/university-profile" element={<UniversityProfile />} />
                <Route path="/company-profile" element={<CompanyProfile />} />
                <Route path="/create-student" element={<CreateStudent />} />
            </Routes>
        </Router>
    );
};

export default App;