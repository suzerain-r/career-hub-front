import React from "react";
import "../styles/about_us_textarea.css";

const AboutUsTextArea = ({profile, handleChange, isEditing}) => {

    return (
        <div className="about_us_textarea">
            <label>Information about me</label>
            <textarea name="aboutUs"
                      placeholder=""
                      value={profile.aboutUs}
                      onChange={handleChange}
                      disabled={!isEditing}>
            </textarea>
        </div>
    );
};

export default AboutUsTextArea;
