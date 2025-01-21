import React from 'react';
import '../styles/home_style.css';
import universityIcon from "../assets/university-icon.svg";


const HomeUniversityCardList = ({ universities, openModal }) => {
    return (

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
                            <div className="average-rating-container">
                                <p>{university.averageRating.toFixed(2)}</p>
                            </div>
                        </div>
                        <button className="profile_button" onClick={() => openModal(university)}>
                            <span className="profile_button_text">Open Profile</span>
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
};

export default HomeUniversityCardList;
