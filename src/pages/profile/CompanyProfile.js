import React, { useState, useEffect } from "react";
import "../../styles/company_profile_style.css";
import '../../styles/card_list.css';
import '../../styles/modal.css';
import favourite_active from "../../assets/favourite_active.svg";
import favourite_not_active from "../../assets/favourite_not_active.svg";
import Header from "../../components/Header";
import candidateIcon from "../../assets/candidate-icon.svg";
import universityIcon from "../../assets/university-icon.svg";
import phoneIcon from "../../assets/phone-icon.svg";
import emailIcon from "../../assets/email-icon.svg";
import AboutUsTextArea from "../../components/AboutUsTextArea";
import ProfileInput from "../../components/ProfileInput";
import {
    fetchCompany,
    fetchFavorites,
    fetchReviews,
    fetchSenders,
    fetchStudent, fetchUniversity,
    togFavorite, updateCompanyProfile
} from "../../services/apiService";
import {getIdFromToken, getRoleFromToken} from "../../utils/jwtDecode";

const CompanyProfile = () => {

    const userId = getIdFromToken();
    const userRole = getRoleFromToken();

    const [profile, setProfile] = useState({
        ownerId: "",
        name: "",
        type: "",
        email: "",
        location: "",
        contactPhone: "",
        industry: "",
        website: "",
        establishedYear: "",
        aboutUs: "",
    });
    const [favourites, setFavourites] = useState([]);

    const [reviews, setReviews] = useState([]);
    const [university, setUniversity] = useState([])
    const [isEditing, setIsEditing] = useState(false);
    const [currentTab, setCurrentTab] = useState("profile");
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);



    useEffect(() => {

        fetchCompany(userId).then((data) => {
            setProfile({
                ownerId: data.ownerId || "",
                name: data.name || "",
                type: data.type || "",
                email: data.email || "",
                contactPhone: data.contactPhone || "",
                location: data.location || "",
                industry: data.industry || "",
                establishedYear: data.establishedYear || "",
                website: data.website || "",
                aboutUs: data.aboutUs || "",
            });
        })
            .catch((error) => console.error("Error fetching profile data:", error));


    }, []);




    useEffect(() => {

        fetchFavorites(userId).then((data) => {
            setFavourites(data);
        })
            .catch((error) => console.error("Error fetching students:", error));


    }, []);



    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const studentRequests = favourites.map((id) =>
                    fetchStudent(id)

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



    const isFavorite = (id) => Array.isArray(favourites) && favourites.includes(id);

    const toggleFavorite = (id) => {
        togFavorite(userId, id, isFavorite()).then();

    };



    const openModal = (student) => {
        setSelectedStudent(student);
    };

    const closeModal = () => {
        setSelectedStudent(null);
    };

    const handleSave = () => {

        const result = updateCompanyProfile(profile);

        if (result) {
            alert("Profile saved successfully!");
            setIsEditing(false);
        } else {
            alert("Error saving profile.");
        }

    };



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
                        <ProfileInput
                            title="Company Name"
                            type="text"
                            name="name"
                            placeholder="Company Name"
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
                            title="Industry"
                            type="text"
                            name="industry"
                            placeholder="Industry"
                            value={profile.industry}
                            handleChange={handleChange}
                            isEditing={isEditing}
                        />

                    </div>

                    <div className="row4">

                        <ProfileInput
                            title="Website"
                            type="text"
                            name="website"
                            placeholder="Website"
                            value={profile.website}
                            handleChange={handleChange}
                            isEditing={isEditing}
                        />


                        <ProfileInput
                            title="Year of Establishment"
                            type="number"
                            name="establishedYear"
                            placeholder="Year of Establishment"
                            value={profile.establishedYear}
                            handleChange={handleChange}
                            isEditing={isEditing}
                        />

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

            {currentTab === "favourites" && (
                <div className="favourites-tab" >
                    <h2>Favourites</h2>
                    <div className="card-list">
                        {students
                            .map((student) => (
                                <div key={student.id} className="card">
                                    <div>
                                        <img
                                            src={candidateIcon}
                                            className="company_logo"
                                            alt={""}/>
                                    </div>

                                    <div className="card-right-section">
                                        <div className="card-info">
                                            <h3>{student.firstName} {student.lastName}</h3>
                                            <p>Degree: {student.degree}</p>
                                        </div>

                                        <div className="card-actions">
                                            {userRole === "COMPANY" && (
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
                                            <button className="view-profile-button" onClick={() => {
                                                fetchReviews(student.ownerId).then((data) => {
                                                    fetchSenders(data['content']).then((data) => {
                                                        console.log(data);
                                                        setReviews(data);
                                                    });
                                                });
                                                fetchUniversity(student.universityId).then((data) => {setUniversity(data)});
                                                openModal(student);
                                            }}
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

                                            {/*{decodedToken['user-role'] === "COMPANY" && (*/}
                                            {/*    <div className="review-form">*/}
                                            {/*        <input*/}
                                            {/*            type="text"*/}
                                            {/*            name="reviewText"*/}
                                            {/*            placeholder="Write your review..."*/}
                                            {/*            value={review.reviewText}*/}
                                            {/*            onChange={handleReview}*/}
                                            {/*        />*/}
                                            {/*        <StarRating*/}
                                            {/*            rating={review.rating}*/}
                                            {/*            onRatingChange={(value) =>*/}
                                            {/*                setReview((prevReview) => ({*/}
                                            {/*                    ...prevReview,*/}
                                            {/*                    rating: value,*/}
                                            {/*                }))*/}
                                            {/*            }*/}
                                            {/*        />*/}

                                            {/*        <button*/}
                                            {/*            className="submit-button"*/}
                                            {/*            onClick={() => {*/}
                                            {/*                addReview();*/}
                                            {/*                fetchReviews(selectedStudent.ownerId);*/}
                                            {/*                setReview({ reviewText: '', rating: 0 });*/}
                                            {/*            }}*/}
                                            {/*        >*/}
                                            {/*            Send*/}
                                            {/*        </button>*/}
                                            {/*    </div>*/}
                                            {/*)}*/}
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
