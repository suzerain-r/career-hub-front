import React from 'react';
import '../styles/side_bar.css';

const CandidateSideBar = ({filters, onFilterChange, onClearFilters }) => {
    return (
        <div className="side-bar">
            <h4>Degree</h4>
            <div>
                {['BACHELOR', 'MASTER', 'DOCTORATE'].map((degree) => (
                    <label key={degree}>
                        <input
                            type="radio"
                            name="degree"
                            value={degree}
                            checked={filters.degree === degree}
                            onChange={(e) => onFilterChange('degree', e.target.value)}
                        />
                        {degree}
                    </label>
                ))}
            </div>

            <h4>GPA</h4>
            <div>
                {['0.0 - 2.0', '2.0 - 3.0', '3.0 - 4.0'].map((gpa) => (
                    <label key={gpa}>
                        <input
                            type="radio"
                            name="gpa"
                            value={gpa}
                            checked={filters.gpa === gpa}
                            onChange={(e) => onFilterChange('gpa', e.target.value)}
                        />
                        {gpa}
                    </label>
                ))}
            </div>

            <button onClick={onClearFilters}>Clear Filters</button>

        </div>
        // <div className="side-bar">
        //     <h4>{title}</h4>
        //     <div>
        //         {['PRIVATE', 'STATE'].map((type) => (
        //             <label key={type}>
        //                 <input
        //                     type="radio"
        //                     name="type"
        //                     value={type}
        //                     checked={filters.type === type}
        //                     onChange={(e) => onFilterChange('type', e.target.value)}
        //                 />
        //                 {type}
        //             </label>
        //         ))}
        //     </div>
        //     <button onClick={onClearFilters}>Clear Filters</button>
        // </div>
    );
};

export default CandidateSideBar;
