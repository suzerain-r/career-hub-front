import React from "react";
import "../styles/profile_input.css";

const ProfileInput = ({title, type, placeholder, name, value, handleChange, isEditing}) => {

    return (
        <div className="input-container">
            <label>{title}</label>
            <input
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={handleChange}
                disabled={!isEditing}
            />
        </div>
    );
};

export default ProfileInput;
