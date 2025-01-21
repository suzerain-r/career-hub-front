import React from 'react';
import '../styles/modal.css';
import universityIcon from "../assets/university-icon.svg";
import phoneIcon from "../assets/phone-icon.svg";
import emailIcon from "../assets/email-icon.svg";
import StarRating from "./StarRating";
import candidateIcon from "../assets/candidate-icon.svg";


const CandidateModal = ({ student, university, closeModal, reviews, onReviewSubmit, role, review, setReview, handleReview, fetchReviews }) => {

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeModal}>×</button>
                <div className="modal-header">
                    <img
                        src={candidateIcon}
                        alt={""}/>
                    <div className="header-info">
                        <h2>{student.name}</h2>
                    </div>
                </div>


                <div className="main-section">
                    <div className="left-side">
                        <div className="about-us-container">
                            <h2>Information about candidate</h2>
                            <p>{student.aboutUs}</p>
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
                                            fetchReviews(student.ownerId);
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
                                src={universityIcon}
                                className="icon"
                                alt={""}/>
                            <div className="contact-item-info">
                                <p className="label">University</p>
                                <p>{university.name}</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <img
                                src={phoneIcon}
                                className="icon"
                                alt={""}/>
                            <div className="contact-item-info">
                                <p className="label">PHONE</p>
                                <p>{student.phoneNumber}</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <img
                                src={emailIcon}
                                className="icon"
                                alt={""}/>
                            <div className="contact-item-info">
                                <p className="label">EMAIL ADDRESS</p>
                                <p><a href={student.email}>{student.email}</a></p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <strong>G</strong>
                            <div className="contact-item-info">
                                <p className="label">GPA</p>
                                <p><a>{student.gpa}</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CandidateModal;
