import '../../styles/home_style.css';
import '../../styles/modal.css';
import howWorkInfo from '../../assets/how-work-info.svg';
import mainInfo from '../../assets/main-info.svg';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import React, {useEffect, useState} from "react";
import candidateIcon from '../../assets/candidate-icon.svg';
import universityIcon from '../../assets/university-icon.svg';
import companyIcon from '../../assets/company-icon.svg';
import websiteIcon from "../../assets/website-icon.svg";
import locationIcon from "../../assets/modal-location-icon.svg";
import phoneIcon from "../../assets/phone-icon.svg";
import emailIcon from "../../assets/email-icon.svg";
import HomeCount from "../../components/HomeCount";
import HomeUniversityCardList from "../../components/HomeUniversityCardList";
import homeService, {fetchUniversities} from "../../services/apiService";
import {getIdFromToken, getRoleFromToken} from "../../utils/jwtDecode";

const Home = () => {

    const userId = getIdFromToken();
    const userRole = getRoleFromToken();

    const [countStudents, setCountStudents] = useState('');
    const [countUniversities, setCountUniversities] = useState('');
    const [countCompanies, setCountCompanies] = useState('');

    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState(null);


    const handleCount =  () => {

        homeService.getStudentsCount().then((data) => {setCountStudents(data['totalElements']);});

        homeService.getCompaniesCount().then((data) => {setCountCompanies(data['totalElements']);});

    }

    const handleUniversities = () => {
        fetchUniversities().then((data) => {
            homeService.getAverageRatingsForUniversities(data['content']).then((universitiesWithRatings) => {
                setUniversities(universitiesWithRatings.slice(0, 6));
            });
            setCountUniversities(data['totalElements']);
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
                        <img src={mainInfo} className="mainInfo" alt={""}></img>
                    </div>
                    <div className="count_container">
                        <HomeCount
                            logo={candidateIcon}
                            count={countStudents}
                            type={'Candidates'}
                        />
                        <HomeCount
                            logo={universityIcon}
                            count={countUniversities}
                            type={'Universities'}
                        />
                        <HomeCount
                            logo={companyIcon}
                            count={countCompanies}
                            type={'Companies'}
                        />
                    </div>

                </section>

                <section className="how-work-section">
                    <div className="steps-container">
                        <img src={howWorkInfo} className="howWorkInfo" alt={""}></img>
                    </div>
                </section>

                <HomeUniversityCardList
                    universities={universities}
                    openModal={openModal}
                />

                <Footer/>

            </main>


            {selectedUniversity && (


                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>×</button>
                        <div className="modal-header">
                            <img
                                src={universityIcon}
                                className="university_logo"
                             alt={""}/>
                            <div className="header-info">
                                <h2>{selectedUniversity.name}</h2>
                                <p><strong>Type:</strong> {selectedUniversity.type}</p>
                            </div>
                        </div>

                        <div className="main-section">
                            <div className="left-side">
                                <div className="about-us-container">
                                    <h2>Information about university</h2>
                                    <p>{selectedUniversity.aboutUs}</p>
                                </div>
                            </div>

                            <div className="right-side">
                                <h3>Contact Information</h3>
                                <div className="contact-item">
                                    <img
                                        src={websiteIcon}
                                        className="icon"
                                     alt={""}/>
                                    <div className="contact-item-info">
                                        <p className="label">WEBSITE</p>
                                        <p><a href={selectedUniversity.website} target="_blank"
                                              rel="noopener noreferrer">{selectedUniversity.website}</a></p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <img
                                        src={locationIcon}
                                        className="icon"
                                     alt={""}/>
                                    <div className="contact-item-info">
                                        <p className="label">LOCATION</p>
                                        <p>{selectedUniversity.location}</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <img
                                        src={phoneIcon}
                                        className="icon"
                                        alt={""}/>
                                    <div className="contact-item-info">
                                        <p className="label">PHONE</p>
                                        <p>{selectedUniversity.contactPhone}</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <img
                                        src={emailIcon}
                                        className="icon"
                                        alt={""}/>
                                    <div className="contact-item-info">
                                        <p className="label">EMAIL ADDRESS</p>
                                        <p><a href={selectedUniversity.email}>{selectedUniversity.email}</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Home;
