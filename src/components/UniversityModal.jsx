import React from 'react';
import '../styles/modal.css';
import websiteIcon from "../assets/website-icon.svg";
import locationIcon from "../assets/modal-location-icon.svg";
import universityIcon from "../assets/university-icon.svg";
import phoneIcon from "../assets/phone-icon.svg";
import emailIcon from "../assets/email-icon.svg";
import StarRating from "./StarRating";


const UniversityModal = ({ university, closeModal, reviews, onReviewSubmit, role, review, setReview, handleReview, fetchReviews }) => {

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeModal}>×</button>
                <div className="modal-header">
                    <img
                        src={universityIcon}
                        alt={""}
                    />
                    <div className="header-info">
                        <h2>{university.name}</h2>
                        <p><strong>Type:</strong> {university.type}</p>
                    </div>
                </div>

                <div className="main-section">
                    <div className="left-side">
                        <div className="about-us-container">
                            <h2>Information about university</h2>
                            <p>{university.aboutUs}</p>
                        </div>

                        <div className="review-container">
                            <div className="reviews-list">
                                {reviews.map((review) => (
                                    <div key={review.id} className="review-item">
                                        <div className="candidate-info">
                                            <p><strong>Sender:</strong> {review.senderName}</p>
                                            <p className="review-text">{review.reviewText}</p>
                                            <p><strong>Rating: </strong> {review.rating} / 5</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {role === "COMPANY" && (
                                <div className="review-form">
                                    <input
                                        type="text"
                                        name="reviewText"
                                        placeholder="Write your review..."
                                        value={review.reviewText}
                                        onChange={handleReview}
                                    />
                                    <StarRating
                                        rating={review.rating}
                                        onRatingChange={(value) =>
                                            setReview((prevReview) => ({
                                                ...prevReview,
                                                rating: value,
                                            }))
                                        }
                                    />

                                    <button
                                        className="submit-button"
                                        onClick={() => {
                                            onReviewSubmit();
                                            fetchReviews(university.ownerId);
                                            setReview(prevState => ({
                                                ...prevState,
                                                reviewText: '', rating: 0
                                            }));
                                        }}
                                    >
                                        Send
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="right-side">
                        <h3>Contact Information</h3>
                        <div className="contact-item">
                            <img
                                src={websiteIcon}
                                className="icon"
                                alt={""}
                            />
                            <div className="contact-item-info">
                                <p className="label">WEBSITE</p>
                                <p><a href={university.website} target="_blank"
                                      rel="noopener noreferrer">{university.website}</a></p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <img
                                src={locationIcon}
                                className="icon"
                                alt={""}
                            />
                            <div className="contact-item-info">
                                <p className="label">LOCATION</p>
                                <p>{university.location}</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <img
                                src={phoneIcon}
                                className="icon"
                                alt={""}
                            />
                            <div className="contact-item-info">
                                <p className="label">PHONE</p>
                                <p>{university.contactPhone}</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <img
                                src={emailIcon}
                                className="icon"
                                alt={""}
                            />
                            <div className="contact-item-info">
                                <p className="label">EMAIL ADDRESS</p>
                                <p><a href={university.email}>{university.email}</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default UniversityModal;
