import '../style/home_style.css';
import howWorkInfo from '../resources/how-work-info.svg';
import mainInfo from '../resources/main-info.svg';
import universityIcon from '../resources/university-icon.svg';
import companyIcon from '../resources/company-icon.svg';
import candidateIcon from '../resources/candidate-icon.svg';
import Header from "./Header";
import React, {useEffect, useState} from "react";

const Home = () => {

    const baseUrl = "http://localhost:8080";

    const token = localStorage.getItem("authToken");

    const [countStudents, setCountStudents] = useState('');
    const [countUniversities, setCountUniversities] = useState('');
    const [countCompanies, setCountCompanies] = useState('');

    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState(null);


    const handleCount =  () => {

        fetch(`${baseUrl}/student/search`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setCountStudents(data['totalElements'])
            })
            .catch((error) => console.error("Error fetching students:", error));


        fetch(`${baseUrl}/company/search`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setCountCompanies(data['totalElements'])
            })
            .catch((error) => console.error("Error fetching companies:", error));
    }

    const handleUniversities = () => {
        fetch(`${baseUrl}/university/search?size=6`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                //console.log(data['content']);
                // const filteredUniversities = data['content'].filter(university =>
                //     university.name !== null &&
                //     university.aboutUs !== null &&
                //     university.location !== null &&
                //     university.website !== null
                // );
                setUniversities(data['content']);
                setCountUniversities(data['totalElements'])
            })
            .catch((error) => {
                console.error("Error fetching universities:", error);
            });
    }

    useEffect(() => {
        handleCount();
        handleUniversities();
    }, []);



    const openModal = (university) => {
        setSelectedUniversity(university);
    };

    const closeModal = () => {
        setSelectedUniversity(null);
    };



    return (
        <div className="home_container">
            <Header/>
            <main className="home_content">
                <section className="home_search">
                    <div className="steps-container">
                        <img src={mainInfo} className="mainInfo"></img>
                    </div>
                    <div className="count_container">
                        <div className="count_item">
                            <img
                                src={companyIcon}
                                className="company_logo"
                            />
                            <div className="count_info">
                                <h2>{countStudents}</h2>
                                <p>Companies</p>
                            </div>
                        </div>

                        <div className="count_item">
                            <img
                                src={universityIcon}
                                className="university_logo"
                            />
                            <div className="count_info">
                                <h2>{countUniversities}</h2>
                                <p>Universities</p>
                            </div>
                        </div>

                        <div className="count_item">
                            <img
                                src={candidateIcon}
                                className="candidate_logo"
                            />
                            <div className="count_info">
                                <h2>{countCompanies}</h2>
                                <p>Candidates</p>
                            </div>
                        </div>
                    </div>

                </section>

                <section className="how-work-section">
                    <div className="steps-container">
                        <img src={howWorkInfo} className="howWorkInfo"></img>
                    </div>
                </section>

                <section className="home_universities">
                    <h2>Top Universities</h2>
                    <div className="home_university_grid">
                        {universities.map((university, index) => (
                            <div key={index} className="home_university_item">
                                <div className="item_container">
                                    <img
                                        src={universityIcon}
                                        alt={`${university.name} Logo`}
                                        className="university_logo"
                                    />
                                    <div className="location_container">
                                        <h3>{university.name}</h3>
                                        <p className="university_location">
                                            <i className="location_icon"></i>
                                            <span className="location_name">{university.location}</span>
                                        </p>
                                    </div>
                                </div>
                                <button className="profile_button" onClick={() => openModal(university)}>
                                    <span className="profile_button_text">Open Profile</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="home_footer">
                    <div className="footer_content">
                        <div className="footer_section">
                            <div className="footer_logo">
                                <i className="footer_logo_icon"></i> CareerHub
                            </div>
                            <p>Call now: <strong>8777-777-77-77</strong></p>
                            <p className="footer_location_name">Almaty, Kaskelen, SDU University</p>
                        </div>
                        <div className="footer_section">
                            <h3>Quick Link</h3>
                            <ul>
                                <li><a href="#">About</a></li>
                                <li><a href="#">Contact</a></li>
                                <li><a href="#">Blog</a></li>
                            </ul>
                        </div>
                        <div className="footer_section">
                            <h3>Support</h3>
                            <ul>
                                <li><a href="#">FAQs</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms & Conditions</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer_bottom">
                        <p>© 2024 CareerHub - Job Portal. All rights reserved</p>
                        <div className="social_icons">
                            <a href="#"><i className="icon-facebook"></i></a>
                            <a href="#"><i className="icon-youtube"></i></a>
                            <a href="#"><i className="icon-instagram"></i></a>
                            <a href="#"><i className="icon-twitter"></i></a>
                        </div>
                    </div>
                </footer>

            </main>

            {selectedUniversity && (
                <div className="university-modal-overlay" onClick={closeModal}>
                    <div className="university-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="university-modal-close" onClick={closeModal}>×</button>
                        <h2>{selectedUniversity.name}</h2>
                        <p><strong>Location:</strong> {selectedUniversity.location}</p>
                        {/*<p><strong>About us:</strong> {selectedUniversity.aboutUs}</p>*/}
                        <p><strong>Website:</strong> <a href={selectedUniversity.website} target="_blank"
                                                        rel="noopener noreferrer">{selectedUniversity.website}</a></p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
