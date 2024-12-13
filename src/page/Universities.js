import React, { useEffect, useState } from 'react';
import '../style/universities_style.css';
import Header from "./Header";
import StarRating from "./StarRating";
import universityIcon from "../resources/university-icon.svg";
import websiteIcon from "../resources/website-icon.svg";
import phoneIcon from "../resources/phone-icon.svg";
import locationIcon from "../resources/modal-location-icon.svg";
import emailIcon from "../resources/email-icon.svg";
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
    const [pageSize] = useState(5);
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState({
        recipientId: "",
        senderId: decodedToken['user-id'],
        reviewText: "",
        rating: "",
        recipientRole: "UNIVERSITY",
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
                console.log(data['content'])
                //setReviews(data['content']);
                fetchSenders(data['content']).then();
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
                    fetchReviews(selectedUniversity.ownerId);
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

    const fetchSenders = async (reviewList) => {
        try{
            const promises = reviewList.map((review) =>
                fetch(`${baseUrl}/${review.senderRole.toLowerCase()}/${review.senderId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                    .then(response => response.json())
                    .then(data => ({
                        ...review,
                        senderName: data.name,
                    }))
            );
            const updatedReviews = await Promise.all(promises);
            setReviews(updatedReviews);
        }
        catch (error) {
            console.error("Error fetching sender information:", error);
        }
    }

    return (
        <div className="university-page">
            <Header/>

            <div className="university_search_container">
                <h1>Universities</h1>
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
            </div>


            <div className="university-main-section">
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

                <div className="university-list">
                    {universities.map((university) => (
                        <div key={university.id} className="university-card">
                            <div>
                                <img
                                    src={universityIcon}
                                    className="company_logo"
                                    alt={""}
                                />
                            </div>
                            <div className="card-right-section">
                                <div className="company-info">
                                    <h3>{university.name}</h3>
                                    <p>
                                        <i className="location_icon"></i>
                                        <span className="location_name">{university.location}</span>
                                    </p>
                                </div>
                                <button className="university-view-profile" onClick={() => {
                                    fetchReviews(university.ownerId);
                                    console.log(university.ownerId);
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
                        </div>
                    ))}
                </div>

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

            {selectedUniversity && (
                <div className="university-modal-overlay" onClick={closeModal}>
                    <div className="university-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="university-modal-close" onClick={closeModal}>×</button>
                        <div className="modal-header">
                            <img
                                src={universityIcon}
                                className="university_logo"
                                alt={""}
                            />
                            <div className="header-info">
                                <h2>{selectedUniversity.name}</h2>
                                <p><strong>Type:</strong> {selectedUniversity.type}</p>
                            </div>
                        </div>

                        <div className="main-section">
                            <div className="left-side">
                                <div className="about-us-container">
                                    <h2>Information about university</h2>
                                    <p>{selectedUniversity.aboutUs}</p>
                                </div>

                                <div className="review-container">
                                    <div className="reviews-list">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="review-item">
                                                <div className="candidate-info">
                                                    <p><strong>Sender:</strong> {review.senderName}</p>
                                                    <p className="review-text">{review.reviewText}</p>
                                                    <p><strong>Rating: </strong> {review.rating} / 5</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {decodedToken['user-role'] === "COMPANY" && (
                                        <div className="review-form">
                                            <input
                                                type="text"
                                                name="reviewText"
                                                placeholder="Write your review..."
                                                value={review.reviewText}
                                                onChange={handleReview}
                                            />
                                            <StarRating
                                                rating={review.rating}
                                                onRatingChange={(value) =>
                                                    setReview((prevReview) => ({
                                                        ...prevReview,
                                                        rating: value,
                                                    }))
                                                }
                                            />

                                            <button
                                                className="submit-button"
                                                onClick={() => {
                                                    addReview();
                                                    fetchReviews(selectedUniversity.ownerId);
                                                    setReview(prevState => ({
                                                        ...prevState,
                                                        reviewText: '', rating: 0
                                                    }));
                                                }}
                                            >
                                                Send
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="right-side">
                                <h3>Contact Information</h3>
                                <div className="contact-item">
                                    <img
                                        src={websiteIcon}
                                        className="icon"
                                        alt={""}
                                    />
                                    <div className="contact-item-info">
                                        <p className="label">WEBSITE</p>
                                        <p><a href={selectedUniversity.website} target="_blank"
                                              rel="noopener noreferrer">{selectedUniversity.website}</a></p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <img
                                        src={locationIcon}
                                        className="icon"
                                        alt={""}
                                    />
                                    <div className="contact-item-info">
                                        <p className="label">LOCATION</p>
                                        <p>{selectedUniversity.location}</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <img
                                        src={phoneIcon}
                                        className="icon"
                                        alt={""}
                                    />
                                    <div className="contact-item-info">
                                        <p className="label">PHONE</p>
                                        <p>{selectedUniversity.contactPhone}</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <img
                                        src={emailIcon}
                                        className="icon"
                                        alt={""}
                                    />
                                    <div className="contact-item-info">
                                        <p className="label">EMAIL ADDRESS</p>
                                        <p><a href={selectedUniversity.email}>{selectedUniversity.email}</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Universities;
