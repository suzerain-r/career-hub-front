import React, { useState, useEffect } from "react";
import "../style/university_profile_style.css";
import {jwtDecode} from "jwt-decode";
import Header from "./Header";
import candidateIcon from "../resources/candidate-icon.svg";
import universityIcon from "../resources/university-icon.svg";
import phoneIcon from "../resources/phone-icon.svg";
import emailIcon from "../resources/email-icon.svg";

const UniversityProfile = () => {


    const baseUrl = "http://localhost:8080";

    const token = localStorage.getItem("authToken");
    const decodedToken = jwtDecode(token);
    const [reviews, setReviews] = useState([]);
    const [currentTab, setCurrentTab] = useState("profile");
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [profile, setProfile] = useState({
        ownerId: "",
        name: "",
        type: "",
        email: "",
        contactPhone: "",
        location: "",
        establishedYear: "",
        website: "",
    });



    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
        fetch(`${baseUrl}/university/${decodedToken['user-id']}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => setProfile(data))
            .catch((error) => console.error("Error fetching profile data:", error));


        fetch(`${baseUrl}/student/search?universityId=${decodedToken['user-id']}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })

            .then((response) => response.json())
            .then((data) => {
                console.log(data['content']);
                setStudents(data['content'])
            })
            .catch((error) => console.error("Error fetching students:", error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSave = () => {
        fetch(`${baseUrl}/university/update/${decodedToken['user-id']}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },//token нужно в header
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


    const closeModal = () => {
        setSelectedStudent(null);
    };

    const openModal = (student) => {
        setSelectedStudent(student);
    };

    return (
        <div className="university-profile-page">
            <Header/>

            <div className="tabs-container">
                <div className="tabs">
                    <h2>University Profile</h2>
                    <div>
                        <button
                            onClick={() => setCurrentTab("profile")}
                            className={currentTab === "profile" ? "active" : ""}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setCurrentTab("students")}
                            className={currentTab === "students" ? "active" : ""}
                        >
                            Students
                        </button>
                    </div>
                </div>
            </div>


            {currentTab === "profile" && (
                <div className="profile-tab">

                    <div className="row1">
                        <div className="input-container">
                            <label>University Name</label>
                            <input
                                type="text"
                                id="universityName"
                                name="name"
                                placeholder="University Name"
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
                    </div>

                    <div className="row4-single">
                        <div className="input-container-single">
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
                        <label>Information about university</label>
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

            {currentTab === "students" && (
                <div className="favourites-tab">
                    <h2>Students</h2>
                    <div className="candidate-list">
                        {students
                            .map((student) => (
                                <div key={student.id} className="candidate-card">
                                    <div>
                                        <img
                                            src={candidateIcon}
                                            className="candidate_logo"
                                            alt={""}/>
                                    </div>

                                    <div className="card-right-section">
                                        <div className="candidate-info">
                                            <h3>{student.firstName} {student.lastName}</h3>
                                            <p>Degree: {student.degree}</p>
                                        </div>

                                        <div className="candidate-actions">
                                            <button className="candidate-view-profile" onClick={() => {
                                                fetchReviews(student.ownerId);
                                                // setReview(prevState => ({
                                                //     ...prevState,
                                                //     recipientId: student.ownerId,
                                                // }));
                                                //fetchUniversity(student.universityId);
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
                                                <p>{profile.name}</p>
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
                                        <div className="contact-item">
                                            <strong>G</strong>
                                            <div className="contact-item-info">
                                                <p className="label">GPA</p>
                                                <p><a>{selectedStudent.gpa}</a></p>
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

export default UniversityProfile;
