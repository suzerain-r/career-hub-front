import React, {useEffect, useState} from 'react';
import '../style/companies_style.css';
import Header from "./Header";
import companyIcon from "../resources/company-icon.svg";
import {jwtDecode} from "jwt-decode";

const Companies = () => {


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

    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(5);
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
    }

    if (filters.type) queryParams.type = filters.type;

    if(searchFilters.location !== 'All') queryParams.location = searchFilters.location;
    if(searchFilters.name){
        queryParams.name = searchFilters.name;
    }

    const fetchCompanies = () => {

        const query = new URLSearchParams(queryParams).toString();

        fetch(`${baseUrl}/company/search?${query}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                // const filteredCompanies = data['content'].filter(company =>
                //     company.name !== null &&
                //     company.location !== null &&
                //     company.type !== null &&
                //     company.industry !== null &&
                //     company.aboutUs !== null &&
                //     company.website !== null
                // );
                setCompanies(data['content']);
                setTotalPages(data['totalPages']);
            })
            .catch((error) => {
                console.error("Error fetching companies:", error);
            });
    };

    useEffect(() => {
        fetchCompanies();
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
        fetchCompanies();
    };

    const handleFilterChange = (filterName, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterName]: value,
        }));
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

    const openModal = (company) => {
        setSelectedCompany(company);
    };

    const closeModal = () => {
        setSelectedCompany(null);
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
                    fetchReviews(selectedCompany.ownerId)
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

        <div className="company-page">
            <Header/>

            <div className="company_search_container">
                <h1>Companies</h1>
                <div className="company_search">
                    <input
                        type="text"
                        placeholder="Company name"
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
                    <button onClick={handleSearch}>Find Company</button>
                </div>
            </div>

            <div className="company-main-section">
                <div className="company-sidebar-filters">
                    <h4>Company Type</h4>
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

                <div className="company-list">
                    {companies
                        .map((company) => (
                            <div key={company.id} className="company-card">
                                <div>
                                    <img
                                        src={companyIcon}
                                        className="company_logo"
                                    />
                                </div>
                                <div className="card-right-section">
                                    <div className="company-info">
                                        <h3>{company.name}</h3>
                                        <p>
                                            <i className="location_icon"></i>
                                            <span className="location_name">{company.location}</span>
                                        </p>
                                    </div>
                                    <button className="company-view-profile" onClick={() => {
                                        fetchReviews(company.ownerId);
                                        setReview(prevState => ({
                                            ...prevState,
                                            recipientId: company.ownerId,
                                        }));
                                        openModal(company)
                                    }}>
                                        View Profile →
                                    </button>
                                </div>

                            </div>
                        ))}
                </div>
            </div>


            <div className="company-pagination">
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

            {selectedCompany && (
                <div className="company-modal-overlay" onClick={closeModal}>
                    <div className="company-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="company-modal-close" onClick={closeModal}>×</button>
                        <h2>{selectedCompany.name}</h2>
                        <p><strong>Type:</strong> {selectedCompany.type}</p>
                        <p><strong>Industry:</strong> {selectedCompany.industry}</p>
                        <p><strong>About us:</strong> {selectedCompany.aboutUs}</p>
                        <p><strong>Website:</strong> <a href={selectedCompany.website} target="_blank"
                                                        rel="noopener noreferrer">{selectedCompany.website}</a></p>

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
                        {(decodedToken['user-role'] === "UNIVERSITY" || decodedToken['user-role'] === "STUDENT")&& (
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

export default Companies;
