import React, { useState, useEffect } from "react";
import "../../styles/university_profile_style.css";
import "../../styles/card_list.css";
import "../../styles/modal.css";
import Header from "../../components/Header";
import candidateIcon from "../../assets/candidate-icon.svg";
import universityIcon from "../../assets/university-icon.svg";
import phoneIcon from "../../assets/phone-icon.svg";
import emailIcon from "../../assets/email-icon.svg";
import ProfileInput from "../../components/ProfileInput";
import AboutUsTextArea from "../../components/AboutUsTextArea";
import {getIdFromToken, getRoleFromToken} from "../../utils/jwtDecode";
import {
    fetchReviews, fetchSenders,
    fetchStudentsOfUniversity,
    fetchUniversity,
    updateUniversityProfile
} from "../../services/apiService";

const UniversityProfile = () => {

    const userId = getIdFromToken();
    const userRole = getRoleFromToken();

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
        aboutUs: "",
    });



    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {

        fetchUniversity(userId).then((data) => {
            setProfile({
                ownerId: data.ownerId || "",
                name: data.name || "",
                type: data.type || "",
                email: data.email || "",
                contactPhone: data.contactPhone || "",
                location: data.location || "",
                establishedYear: data.establishedYear || "",
                website: data.website || "",
                aboutUs: data.aboutUs || "",
            });
        })
            .catch((error) => console.error("Error fetching profile data:", error));



        fetchStudentsOfUniversity(userId).then((data) => {
            console.log(data['content']);
            setStudents(data['content']);
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

        const result = updateUniversityProfile(profile);

        if (result) {
            alert("Profile saved successfully!");
            setIsEditing(false);
        } else {
            alert("Error saving profile.");
        }

    };




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
                        <ProfileInput
                            title="University Name"
                            type="text"
                            name="name"
                            placeholder="University Name"
                            value={profile.name}
                            handleChange={handleChange}
                            isEditing={isEditing}
                        />


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
                        <ProfileInput
                            title="Email Address"
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={profile.email}
                            handleChange={handleChange}
                            isEditing={isEditing}
                        />

                        <ProfileInput
                            title="Location"
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={profile.location}
                            handleChange={handleChange}
                            isEditing={isEditing}
                        />

                    </div>

                    <div className="row3">
                        <ProfileInput
                            title="Contact Phone"
                            type="text"
                            name="contactPhone"
                            placeholder="Contact Phone"
                            value={profile.contactPhone}
                            handleChange={handleChange}
                            isEditing={isEditing}
                        />

                        <ProfileInput
                            title="Website"
                            type="text"
                            name="website"
                            placeholder="Website"
                            value={profile.website}
                            handleChange={handleChange}
                            isEditing={isEditing}
                        />

                    </div>

                    <div className="row-single">
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

                    <AboutUsTextArea
                        value={profile.aboutUs}
                        handleChange={handleChange}
                        isEditing={isEditing}
                    />

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
                    <div className="card-list">
                        {students
                            .map((student) => (
                                <div key={student.id} className="card">
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

                                        <div className="card-actions">
                                            <button className="view-profile-button" onClick={() => {
                                                fetchReviews(student.ownerId).then((data) => {
                                                    fetchSenders(data['content']).then((data) => {setReviews(data)})
                                                });
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
                        <div className="modal-overlay" onClick={closeModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <button className="modal-close" onClick={closeModal}>×</button>
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
