import React, { useState, useEffect } from "react";
import "../style/company_profile_style.css";
import '../style/candidates_style.css';
import {jwtDecode} from "jwt-decode";
import favourite_active from "../resources/favourite_active.svg";
import favourite_not_active from "../resources/favourite_not_active.svg";
import Header from "./Header";
import candidateIcon from "../resources/candidate-icon.svg";
import StarRating from "./StarRating";
import universityIcon from "../resources/university-icon.svg";
import phoneIcon from "../resources/phone-icon.svg";
import emailIcon from "../resources/email-icon.svg";

const CompanyProfile = () => {

    const baseUrl = "http://localhost:8080";
    const token = localStorage.getItem("authToken");
    const decodedToken = jwtDecode(token);

    const [profile, setProfile] = useState({
        aboutUs: "",
        ownerId: "",
        name: "",
        type: "",
        email: "",
        location: "",
        contactPhone: "",
        industry: "",
        website: "",
        establishedYear: "",
    });
    const [favourites, setFavourites] = useState([]);

    const [reviews, setReviews] = useState([]);
    const [university, setUniversity] = useState([])
    const [isEditing, setIsEditing] = useState(false);
    const [currentTab, setCurrentTab] = useState("profile");
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [review, setReview] = useState({
        recipientId: "",
        senderId: decodedToken['user-id'],
        reviewText: "",
        rating: "",
        recipientRole: "STUDENT",
    });


    useEffect(() => {
        fetch(`${baseUrl}/company/${decodedToken['user-id']}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((data) => setProfile(data))
            .catch((error) => console.error("Error fetching profile data:", error));
    }, []);


    useEffect(() => {
        fetch(`${baseUrl}/company/favouriteStudent/${decodedToken['user-id']}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setFavourites(data);
            })
            .catch((error) => console.error("Error fetching students:", error))
    }, []);



    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const studentRequests = favourites.map((id) =>
                    fetch(`${baseUrl}/student/${id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }).then((response) => {
                        if (!response.ok) {
                            throw new Error(`Failed to fetch student with id ${id}`);
                        }
                        return response.json();
                    })
                );

                const studentData = await Promise.all(studentRequests);

                setStudents(studentData);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchStudentData().then();
    }, [favourites]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };


    const deleteFavorite = (id) => {
        {decodedToken['user-role'] === "COMPANY" && (
            fetch(`${baseUrl}/company/favouriteStudent/${decodedToken['user-id']}?studentOwnerId=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
                .then(() => {
                    setFavourites(prevFavourites => prevFavourites.filter(favId => favId !== id));
                })
                .catch((error) => console.error("Error removing from favorites:", error))
        )}
    };

    const isFavorite = (id) => Array.isArray(favourites) && favourites.includes(id);

    const toggleFavorite = (id) => {
        if (isFavorite(id)) {
            deleteFavorite(id);
        }
    };

    const fetchReviews = (id) => {
        fetch(`${baseUrl}/review/getAll/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((data) => {
                //setReviews(data['content']);
                fetchSenders(data['content']).then();
            })
            .catch((error) => {console.error("Error removing from reviews:", error)})
    }

    const fetchSenders = async (reviewList) => {
        try{
            const promises = reviewList.map((review) =>
                fetch(`${baseUrl}/${review.senderRole.toLowerCase()}/${review.senderId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                    .then(response => response.json())
                    .then(data => ({
                        ...review,
                        senderName: data.name,
                    }))
            );
            const updatedReviews = await Promise.all(promises);
            setReviews(updatedReviews);
        }
        catch (error) {
            console.error("Error fetching sender information:", error);
        }
    }

    const fetchUniversity = (id) => {
        fetch(`${baseUrl}/student/${decodedToken['user-id']}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then(() => {
                return fetch(`${baseUrl}/university/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            })
            .then((response) => response.json())
            .then((data) => setUniversity(data))
            .catch((error) => console.error("Error fetching university:", error));
    }

    const openModal = (student) => {
        setSelectedStudent(student);
    };

    const closeModal = () => {
        setSelectedStudent(null);
    };

    const handleSave = () => {
        fetch(`${baseUrl}/company/update/${decodedToken['user-id']}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            }, //token
            body: JSON.stringify(profile),
        })
            .then((response) => {
                if (response.ok) {
                    alert("Profile saved successfully!");
                    setIsEditing(false);
                } else {
                    alert("Error saving profile.");
                }
            })
            .catch((error) => console.error("Error saving profile:", error));
    };

    const addReview = () => {
        fetch(`${baseUrl}/review/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(review),
        })
            .then((response) => {
                if (response.ok) {
                    fetchReviews(selectedStudent.ownerId)
                } else {
                    alert("Error saving review!");
                }
            })
    }

    const handleReview = (e) => {
        const { name, value } = e.target;
        setReview((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    }

    return (
        <div className="company-profile-page">
            <Header/>

            <div className="tabs-container">
                <div className="tabs">
                    <h2>Company Profile</h2>
                    <div>
                        <button
                            onClick={() => setCurrentTab("profile")}
                            className={currentTab === "profile" ? "active" : ""}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setCurrentTab("favourites")}
                            className={currentTab === "favourites" ? "active" : ""}
                        >
                            Favourites
                        </button>
                    </div>
                </div>
            </div>
            {currentTab === "profile" && (
                <div className="profile-tab">
                    <div className="row1">
                        <div className="input-container">
                            <label>Company Name</label>
                            <input
                                type="text"
                                id="companyName"
                                name="name"
                                placeholder="Company Name"
                                value={profile.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="input-container">
                            <label>Type</label>
                            <select
                                name="type"
                                value={profile.type}
                                onChange={handleChange}
                                disabled={!isEditing}
                            >
                                <option value="" disabled>
                                    Select the type
                                </option>
                                <option value="PRIVATE">Private</option>
                                <option value="STATE">State</option>
                            </select>
                        </div>
                    </div>

                    <div className='row2'>
                        <div className="input-container">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={profile.email}
                                onChange={handleChange}
                                disabled
                            />
                        </div>
                        <div className="input-container">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="Location"
                                value={profile.location}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <div className="row3">
                        <div className="input-container">
                            <label>Contact Phone</label>
                            <input
                                type="text"
                                name="contactPhone"
                                placeholder="Contact Phone"
                                value={profile.contactPhone}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="input-container">
                            <label>Industry</label>
                            <input
                                type="text"
                                name="industry"
                                placeholder="Industry"
                                value={profile.industry}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <div className="row4">
                        <div className="input-container">
                            <label>Website</label>
                            <input
                                type="text"
                                name="website"
                                placeholder="Website"
                                value={profile.website}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="input-container">
                            <label>Year of Establishment</label>
                            <input
                                type="number"
                                name="establishedYear"
                                placeholder="Year of Establishment"
                                value={profile.establishedYear}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <div className="input-container row5">
                        <label>Information about company</label>
                        <textarea name="aboutUs"
                                  placeholder=""
                                  value={profile.aboutUs}
                                  onChange={handleChange}
                                  disabled={!isEditing}>
                        </textarea>
                    </div>
                    <div className="button-container">
                        {isEditing ? (
                            <button className="save-button" onClick={handleSave}>Save Changes</button>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="edit-button">
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            )}

            {currentTab === "favourites" && (
                <div className="favourites-tab" >
                    <h2>Favourites</h2>
                    <div className="candidate-list">
                        {students
                            .map((student) => (
                                <div key={student.id} className="candidate-card">
                                    <div>
                                        <img
                                            src={candidateIcon}
                                            className="company_logo"
                                            alt={""}/>
                                    </div>

                                    <div className="card-right-section">
                                        <div className="candidate-info">
                                            <h3>{student.firstName} {student.lastName}</h3>
                                            <p>Degree: {student.degree}</p>
                                        </div>

                                        <div className="candidate-actions">
                                            {decodedToken['user-role'] === "COMPANY" && (
                                                <button
                                                    className="candidate-favorite"
                                                    onClick={() => toggleFavorite(student.ownerId)}
                                                    aria-label={isFavorite(student.ownerId) ? "Remove from Favorites" : "Add to Favorites"}
                                                >
                                                    {isFavorite(student.ownerId) ?
                                                        <img src={favourite_active} alt={""}></img> :
                                                        <img src={favourite_not_active} alt={""}></img>
                                                    }
                                                </button>
                                            )}
                                            <button className="candidate-view-profile" onClick={() => {
                                                fetchReviews(student.ownerId);
                                                setReview(prevState => ({
                                                    ...prevState,
                                                    recipientId: student.ownerId,
                                                }));
                                                fetchUniversity(student.universityId);
                                                openModal(student)
                                            }
                                            }
                                            >
                                                View Profile →
                                            </button>

                                        </div>
                                    </div>

                                </div>
                            ))}
                    </div>
                    {selectedStudent && (
                        <div className="candidate-modal-overlay" onClick={closeModal}>
                            <div className="candidate-modal-content" onClick={(e) => e.stopPropagation()}>
                                <button className="candidate-modal-close" onClick={closeModal}>×</button>
                                <div className="modal-header">
                                    <img
                                        src={candidateIcon}
                                        className="candidate-logo"
                                        alt={""}/>
                                    <div className="header-info">
                                        <h2>{selectedStudent.name}</h2>
                                    </div>
                                </div>


                                <div className="main-section">
                                    <div className="left-side">
                                        <div className="about-us-container">
                                            <h2>Information about candidate</h2>
                                            <p>{selectedStudent.aboutUs}</p>
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

                                            {decodedToken['user-role'] === "COMPANY" && (
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
                                                            addReview();
                                                            fetchReviews(selectedStudent.ownerId);
                                                            setReview({ reviewText: '', rating: 0 });
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
                                                <p>{selectedStudent.phoneNumber}</p>
                                            </div>
                                        </div>
                                        <div className="contact-item">
                                            <img
                                                src={emailIcon}
                                                className="icon"
                                                alt={""}/>
                                            <div className="contact-item-info">
                                                <p className="label">EMAIL ADDRESS</p>
                                                <p><a href={selectedStudent.email}>{selectedStudent.email}</a></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CompanyProfile;
