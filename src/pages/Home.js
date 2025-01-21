import '../styles/home_style.css';
import howWorkInfo from '../assets/how-work-info.svg';
import mainInfo from '../assets/main-info.svg';
import universityIcon from '../assets/university-icon.svg';
import Header from "../components/Header";
import Footer from "../components/Footer";
import React, {useEffect, useState} from "react";
import websiteIcon from "../assets/website-icon.svg";
import locationIcon from "../assets/modal-location-icon.svg";
import phoneIcon from "../assets/phone-icon.svg";
import emailIcon from "../assets/email-icon.svg";
import HomeCount from "../components/HomeCount";
import HomeUniversityCardList from "../components/HomeUniversityCardList";

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
        fetch(`${baseUrl}/university/search`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',

            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data['content']);
                fetchAverageRatings(data['content']).then();
                setCountUniversities(data['totalElements']);
            })
            .catch((error) => {
                console.error("Error fetching universities:", error);
            });
    }


    const fetchAverageRatings = async (universityList) => {
        try {
            const promises = universityList.map((university) =>
                fetch(`${baseUrl}/review/getAverageRating/${university.ownerId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }).then((response) => response.json().then((data) => ({ id: university.ownerId, averageRating: data?.averageRating || 0 })))
            );

            const ratings = await Promise.all(promises);
            console.log(ratings);

            const ratingsMap = ratings.reduce((map, rating) => {
                map[rating.id] = rating.averageRating;
                return map;
            }, {});

            const universitiesWithRatings = universityList.map((university) => ({
                ...university,
                averageRating: ratingsMap[university.ownerId] || 0,
            }));
            console.log(universitiesWithRatings);

            const topUniversities = universitiesWithRatings
                .sort((a, b) => b.averageRating - a.averageRating)
                .slice(0, 6);

            console.log("Top universities:", topUniversities);

            setUniversities(topUniversities);
        } catch (error) {
            console.error("Error fetching ratings:", error);
        }
    };

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
                            count={countCompanies}
                        />
                        <HomeCount
                            count={countUniversities}
                        />
                        <HomeCount
                            count={countStudents}
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


                <div className="university-modal-overlay" onClick={closeModal}>
                    <div className="university-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="university-modal-close" onClick={closeModal}>×</button>
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
