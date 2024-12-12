import React, { useState, useEffect } from "react";
import "../style/university_profile_style.css";
import {jwtDecode} from "jwt-decode";
import Header from "./Header";

const UniversityProfile = () => {


    const baseUrl = "http://localhost:8080";

    const token = localStorage.getItem("authToken");
    const decodedToken = jwtDecode(token);
    const [profile, setProfile] = useState({
        ownerId: "",
        name: "",
        type: "PRIVATE",
        email: "",
        contactPhone: "",
        location: "",
        establishedYear: "",
        website: "",
    });

    const [isEditing, setIsEditing] = useState(false);

    //??
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

    return (
        <div className="university-profile-page">
            <Header/>

            <h2>University Profile</h2>

            <div className="profile-tab">

                <div className="row1">
                    <div className="input-container">
                        <label>University Name</label>
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

            {/*<h2>University Profile</h2>*/}
            {/*<div>*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        name="name"*/}
            {/*        placeholder="University Name"*/}
            {/*        value={profile.name}*/}
            {/*        onChange={handleChange}*/}
            {/*        disabled={!isEditing}*/}
            {/*    />*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    <select*/}
            {/*        name="type"*/}
            {/*        value={profile.type}*/}
            {/*        onChange={handleChange}*/}
            {/*        disabled={!isEditing}*/}
            {/*    >*/}
            {/*        <option value="PRIVATE">Private</option>*/}
            {/*        <option value="STATE">State</option>*/}
            {/*    </select>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    <input*/}
            {/*        type="email"*/}
            {/*        name="email"*/}
            {/*        placeholder="Email Address"*/}
            {/*        value={profile.email}*/}
            {/*        onChange={handleChange}*/}
            {/*        disabled*/}
            {/*    />*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        name="contactPhone"*/}
            {/*        placeholder="Contact Phone"*/}
            {/*        value={profile.contactPhone}*/}
            {/*        onChange={handleChange}*/}
            {/*        disabled={!isEditing}*/}
            {/*    />*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        name="location"*/}
            {/*        placeholder="Location"*/}
            {/*        value={profile.location}*/}
            {/*        onChange={handleChange}*/}
            {/*        disabled={!isEditing}*/}
            {/*    />*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    <input*/}
            {/*        type="number"*/}
            {/*        name="establishedYear"*/}
            {/*        placeholder="Year of Establishment"*/}
            {/*        value={profile.establishedYear}*/}
            {/*        onChange={handleChange}*/}
            {/*        disabled={!isEditing}*/}
            {/*    />*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        name="website"*/}
            {/*        placeholder="Website"*/}
            {/*        value={profile.website}*/}
            {/*        onChange={handleChange}*/}
            {/*        disabled={!isEditing}*/}
            {/*    />*/}
            {/*</div>*/}
            {/*{isEditing ? (*/}
            {/*    <button onClick={handleSave}>Save Changes</button>*/}
            {/*) : (*/}
            {/*    <button onClick={() => setIsEditing(true)} className="edit">*/}
            {/*        Edit Profile*/}
            {/*    </button>*/}
            {/*)}*/}
        </div>
    );
};

export default UniversityProfile;
