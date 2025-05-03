import React from 'react';
import '../styles/card_list.css';
import favourite_active from "../assets/favourite_active.svg";
import favourite_not_active from "../assets/favourite_not_active.svg";
import {getRoleFromToken} from "../utils/jwtDecode";


const CandidateCardList = ({ students, onViewProfile, candidateIcon, toggleFavorite, isFavorite }) => {
    return (

        <div className="card-list">
        {students
            .map((student) => (
                <div key={student.id} className="card">
                    <div>
                        <img
                            src={candidateIcon}
                            className="card-logo"
                         alt={""}/>
                    </div>

                    <div className="card-right-section">
                        <div className="card-info">
                            <h3>{student.firstName} {student.lastName}</h3>
                            <p>Degree: {student.degree}</p>
                        </div>

                        <div className="card-actions">
                            {getRoleFromToken() === "COMPANY" && (
                                <button
                                    className="card-favorite"
                                    onClick={() => toggleFavorite(student.ownerId)}
                                    aria-label={isFavorite(student.ownerId) ? "Remove from Favorites" : "Add to Favorites"}
                                >
                                    {isFavorite(student.ownerId) ?
                                        <img src={favourite_active} alt={""}></img> :
                                        <img src={favourite_not_active} alt={""}></img>
                                    }
                                </button>
                            )}
                            <button className="view-profile-button"
                                    onClick={() => onViewProfile(student)
                            }>
                                View Profile →
                            </button>

                        </div>
                    </div>

                </div>
            ))}
    </div>
    )
};

export default CandidateCardList;


