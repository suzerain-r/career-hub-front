import React from 'react';
import '../styles/home_style.css';


const HomeCount = ({ logo, count, type }) => {
    return (
        <div className="count_item">
            <img
                src={logo}
                className="university_logo"
                alt={""}/>
            <div className="count_info">
                <h2>{count}</h2>
                <p>{type}</p>
            </div>
        </div>
    )
};

export default HomeCount;
