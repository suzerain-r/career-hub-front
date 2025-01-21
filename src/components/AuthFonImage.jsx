import React from "react";
import "../styles/auth_style.css";
import fonImage from "../assets/auth-fon-image.png";

const AuthFonImage = () => {

    return (
        <div className="fon_image_container">
            <img
                src={fonImage}
                className="fonImage"
                alt={""}/>
        </div>
    );
};

export default AuthFonImage;
