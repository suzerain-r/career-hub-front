import React, { useState, useEffect } from "react";
import "../style/company_profile_style.css";
import {jwtDecode} from "jwt-decode";

const CompanyProfile = () => {

    const baseUrl = "http://localhost:8080";
    const token = localStorage.getItem("authToken");
    const decodedToken = jwtDecode(token);

    const [profile, setProfile] = useState({
        ownerId: "",
        name: "",
        type: "PRIVATE",
        email: "",
        location: "",
        contactPhone: "",
        industry: "",
        website: "",
        establishedYear: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    //?
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
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

    return (
        <div className="company-profile-page">
            <h2>Company Profile</h2>
            <div>
                <input
                    type="text"
                    name="name"
                    placeholder="Company Name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div>
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
            <div>
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={profile.email}
                    onChange={handleChange}
                    disabled
                />
            </div>
            <div>
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={profile.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div>
                <input
                    type="text"
                    name="contactPhone"
                    placeholder="Contact Phone"
                    value={profile.contactPhone}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div>
                <input
                    type="text"
                    name="industry"
                    placeholder="Industry"
                    value={profile.industry}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div>
                <input
                    type="text"
                    name="website"
                    placeholder="Website"
                    value={profile.website}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div>
                <input
                    type="number"
                    name="establishedYear"
                    placeholder="Year of Establishment"
                    value={profile.establishedYear}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            {isEditing ? (
                <button onClick={handleSave}>Save Changes</button>
            ) : (
                <button onClick={() => setIsEditing(true)} className="edit">
                    Edit Profile
                </button>
            )}
        </div>
    );
};

export default CompanyProfile;
