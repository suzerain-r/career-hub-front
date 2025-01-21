import React from 'react';
import '../styles/search_bar.css';

const CandidateSearchBar = ({filters, onFilterChange, onSearch }) => {
    return (

        <div className="search-bar">
            <input
                type="text"
                placeholder="Candidate name"
                value={filters.name}
                onChange={(e) => onFilterChange('firstName', e.target.value)}
            />

            <button onClick={onSearch}>Find Candidate</button>
        </div>
        // <div className="search-bar">
        //     <input
        //         type="text"
        //         placeholder={placeholder}
        //         value={filters.name}
        //         onChange={(e) => onFilterChange('name', e.target.value)}
        //     />
        //     <select
        //         value={filters.location}
        //         onChange={(e) => onFilterChange('location', e.target.value)}
        //     >
        //         <option value="All">All</option>
        //         {locations.map((location) => (
        //             <option key={location} value={location}>
        //                 {location}
        //             </option>
        //         ))}
        //     </select>
        //     <button onClick={onSearch}>Find</button>
        // </div>
    );
};

export default CandidateSearchBar;
