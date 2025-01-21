import React from 'react';
import '../styles/search_bar.css';

const CompanySearchBar = ({filters, onFilterChange, locations, onSearch }) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Company name"
                value={filters.name}
                onChange={(e) => onFilterChange('name', e.target.value)}
            />
            <select
                value={filters.location}
                onChange={(e) => onFilterChange('location', e.target.value)}
            >
                <option value="All">All</option>
                {locations.map((location) => (
                    <option key={location} value={location}>
                        {location}
                    </option>
                ))}
            </select>
            <button onClick={onSearch}>Find</button>
        </div>
    );
};

export default CompanySearchBar;
