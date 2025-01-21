import React from 'react';
import '../styles/card_list.css';


const CompanyCardList = ({ items, onViewProfile, icon }) => {
    return (
        <div className="card-list">
            {items.map((item) => (
                <div key={item.id} className="card">
                    <div>
                        <img src={icon} className="card-logo" alt=""/>
                    </div>
                    <div className="card-right-section">
                        <div className="card-info">
                            <h3>{item.name}</h3>
                            <p>
                                <i className="location_icon"></i>
                                <span>{item.location}</span>
                            </p>
                        </div>
                        <button
                            className="view-profile-button"
                            onClick={() => onViewProfile(item)}
                        >
                            View Profile →
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default CompanyCardList;

