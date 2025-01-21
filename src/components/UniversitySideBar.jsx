import React from 'react';
import '../styles/side_bar.css';

const UniversitySideBar = ({ title, filters, onFilterChange, onClearFilters }) => {
    return (
        <div className="side-bar">
            <h4>{title}</h4>
            <div>
                {['PRIVATE', 'STATE'].map((type) => (
                    <label key={type}>
                        <input
                            type="radio"
                            name="type"
                            value={type}
                            checked={filters.type === type}
                            onChange={(e) => onFilterChange('type', e.target.value)}
                        />
                        {type}
                    </label>
                ))}
            </div>
            <button onClick={onClearFilters}>Clear Filters</button>
        </div>
    );
};

export default UniversitySideBar;
