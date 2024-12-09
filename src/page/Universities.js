import React, { useEffect, useState } from 'react';
import '../style/universities_style.css';
import Header from "./Header";
import {jwtDecode} from "jwt-decode";

const Universities = () => {
    const baseUrl = "http://localhost:8080";

    const token = localStorage.getItem("authToken");
    const decodedToken = jwtDecode(token);

    const [filters, setFilters] = useState({
        type: '',
    });

    const [searchFilters, setSearchFilters] = useState({
        name: '',
        location: 'All',
    });

    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(3);
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState({
        recipientId: "",
        senderId: decodedToken['user-id'],
        reviewText: "",
        rating: "",
    });

    const [locations] = useState([
        "Astana", "Almaty"
    ]);


    const queryParams = {
        page: currentPage - 1,
        size: pageSize,
    };



    const fetchUniversities = () => {

        if (filters.type) queryParams.type = filters.type;
        if(searchFilters.location !== 'All'){
            queryParams.location = searchFilters.location;
        }
        if(searchFilters.name){
            queryParams.name = searchFilters.name;
        }

        const query = new URLSearchParams(queryParams).toString();

        fetch(`${baseUrl}/university/search?${query}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                // const filteredUniversities = data['content'].filter(university =>
                //     university.name !== null &&
                //     university.location !== null &&
                //     university.type !== null &&
                //     university.aboutUs !== null &&
                //     university.website !== null
                // );
                setUniversities(data['content']);
                setTotalPages(data['totalPages']);
            })
            .catch((error) => {
                console.error("Error fetching universities:", error);
            });
    };

    useEffect(() => {
        fetchUniversities();
    }, [filters, currentPage]);


    const handleSearchFilterChange = (filterName, value) => {
        setSearchFilters((prevFilters) => ({
            ...prevFilters,
            [filterName]: value,
        }));
    };

    const handleSearch = () => {
        if (searchFilters.location && searchFilters.location !== "All") {
            queryParams.location = searchFilters.location;
        }
        setCurrentPage(1);
        fetchUniversities();
    };

    const handleFilterChange = (filterName, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterName]: value,
        }));
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    const handleClearFilters = () => {
        setFilters({ type: '' });
        setSearchFilters({ location: 'All'});
        setCurrentPage(1);
    };


    const openModal = (university) => {
        setSelectedUniversity(university);
    };

    const closeModal = () => {
        setSelectedUniversity(null);
    };


    const fetchReviews = (id) => {
        fetch(`${baseUrl}/review/getAll/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setReviews(data['content'])
            })
            .catch((error) => {console.error("Error removing from reviews:", error)})
    }

    const addReview = () => {
        fetch(`${baseUrl}/review/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(review),
        })
            .then((response) => {
                if (response.ok) {
                    fetchReviews(selectedUniversity.ownerId)
                    alert("Review saved successfully!");
                } else {
                    alert("Error saving review!");
                }
            })
    }

    const handleReview = (e) => {
        const { name, value } = e.target;
        setReview((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    }

    return (
        <div className="university-page">
            <Header />

            <div className="university-sidebar-filters">
                <h4>University Type</h4>
                <div>
                    {['PRIVATE', 'STATE'].map((type) => (
                        <label key={type}>
                            <input
                                type="radio"
                                name="type"
                                value={type}
                                checked={filters.type === type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                            />
                            {type}
                        </label>
                    ))}
                </div>
                <button onClick={handleClearFilters}>Clear Filters</button>
            </div>

            <div className="university-main-content">
            <div className="university_search">
                    <input
                        type="text"
                        placeholder="University name"
                        value={searchFilters.name}
                        onChange={(e) => handleSearchFilterChange('name', e.target.value)}
                    />
                    <select
                        value={searchFilters.location}
                        onChange={(e) => handleSearchFilterChange('location', e.target.value)}
                    >
                        <option value="All">
                            All
                        </option>
                        {locations.map((location) => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleSearch}>Find University</button>
                </div>

                <div className="university-list">
                    {universities.map((university) => (
                        <div key={university.id} className="university-card">
                            <div className="university-info">
                                <h3>{university.name}</h3>
                                <p>{university.location}</p>
                            </div>
                            <button className="university-view-profile" onClick={() => {
                                fetchReviews(university.ownerId);
                                setReview(prevState => ({
                                    ...prevState,
                                    recipientId: university.ownerId,
                                }));
                                openModal(university)
                            }
                            }>
                                View Profile →
                            </button>
                        </div>
                    ))}
                </div>

                <div className="university-pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        ←
                    </button>
                    {[...Array(totalPages).keys()].map((page) => (
                        <button
                            key={page + 1}
                            className={currentPage === page + 1 ? 'active' : ''}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            {page + 1}
                        </button>
                    ))}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        →
                    </button>
                </div>
            </div>

            {selectedUniversity && (
                <div className="university-modal-overlay" onClick={closeModal}>
                    <div className="university-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="university-modal-close" onClick={closeModal}>×</button>
                        <h2>{selectedUniversity.name}</h2>
                        <p><strong>Type:</strong> {selectedUniversity.type}</p>
                        <p><strong>About us:</strong> {selectedUniversity.aboutUs}</p>
                        <p><strong>Website:</strong> <a href={selectedUniversity.website} target="_blank"
                                                        rel="noopener noreferrer">{selectedUniversity.website}</a></p>
                        {reviews
                            .map((review) => (
                                <div key={review.id}>
                                    <div className="candidate-info">
                                        <p>Sender Id: {review.senderId}</p>
                                        <p>Review: {review.reviewText}</p>
                                        <p>Rating: {review.rating}</p>
                                    </div>
                                </div>
                            ))}

                        {decodedToken['user-role'] === "COMPANY" && (
                            <>
                                <input
                                    type="text"
                                    name="reviewText"
                                    placeholder="Review"
                                    value={review.reviewText}
                                    onChange={handleReview}
                                />
                                <input
                                    type="text"
                                    name="rating"
                                    placeholder="Rating"
                                    value={review.rating}
                                    onChange={handleReview}
                                />
                                <button onClick= {() => {
                                    addReview()
                                    fetchReviews(selectedUniversity.ownerId)
                                }}>
                                    Send
                                </button>
                            </>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default Universities;
