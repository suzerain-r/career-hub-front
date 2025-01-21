import React from 'react';
import '../styles/home_style.css';
import universityIcon from "../assets/university-icon.svg";


const HomeCount = ({ count }) => {
    return (
        <div className="count_item">
            <img
                src={universityIcon}
                className="university_logo"
                alt={""}/>
            <div className="count_info">
                <h2>{count}</h2>
                <p>Universities</p>
            </div>
        </div>
    )
};

export default HomeCount;
