import React from 'react';
import '../styles/pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {

    return (

        <div className="pagination">
        <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
        >
            ←
        </button>
        {[...Array(totalPages).keys()].map((page) => (
            <button
                key={page + 1}
                className={currentPage === page + 1 ? 'active' : ''}
                onClick={() => onPageChange(page + 1)}
            >
                {page + 1}
            </button>
        ))}
        <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
        >
            →
        </button>
    </div>
    );
};

export default Pagination;
