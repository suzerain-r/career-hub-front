import React from 'react';
import '../styles/modal.css';
import websiteIcon from "../assets/website-icon.svg";
import locationIcon from "../assets/modal-location-icon.svg";
import phoneIcon from "../assets/phone-icon.svg";
import emailIcon from "../assets/email-icon.svg";
import StarRating from "./StarRating";
import companyIcon from "../assets/company-icon.svg";


const CompanyModal = ({ company, closeModal, reviews, onReviewSubmit, role, review, setReview, handleReview, fetchReviews }) => {

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeModal}>×</button>

                <div className="modal-header">
                    <img
                        src={companyIcon}
                        alt={""}/>
                    <div className="header-info">
                        <h2>{company.name}</h2>
                        <p><strong>Type:</strong> {company.type}</p>
                    </div>
                </div>


                <div className="main-section">
                    <div className="left-side">
                        <div className="about-us-container">
                            <h2>Information about company</h2>
                            <p>{company.aboutUs}</p>
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

                            {(role === "UNIVERSITY" || role === "STUDENT") && (
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
                                            fetchReviews(company.ownerId);
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
                                alt={""}/>
                            <div className="contact-item-info">
                                <p className="label">WEBSITE</p>
                                <p><a href={company.website} target="_blank"
                                      rel="noopener noreferrer">{company.website}</a></p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <img
                                src={locationIcon}
                                className="icon"
                                alt={""}/>
                            <div className="contact-item-info">
                                <p className="label">LOCATION</p>
                                <p>{company.location}</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <img
                                src={phoneIcon}
                                className="icon"
                                alt={""}/>
                            <div className="contact-item-info">
                                <p className="label">PHONE</p>
                                <p>{company.contactPhone}</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <img
                                src={emailIcon}
                                className="icon"
                                alt={""}/>
                            <div className="contact-item-info">
                                <p className="label">EMAIL ADDRESS</p>
                                <p><a href={company.email}>{company.email}</a></p>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};


export default CompanyModal;
