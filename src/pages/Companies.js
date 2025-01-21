import React, {useEffect, useState} from 'react';
import '../styles/companies_style.css';
import Header from "../components/Header";
import companyIcon from "../assets/company-icon.svg";
import {jwtDecode} from "jwt-decode";
import CompanyCardList from "../components/CompanyCardList";
import CompanySearchBar from "../components/CompanySearchBar";
import Pagination from "../components/Pagination";
import CompanyModal from "../components/CompanyModal";
import CompanySideBar from "../components/CompanySideBar";

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
        recipientRole: "COMPANY",
    });

    const [locations] = useState([
        "Astana", "Almaty", "California", "Washington", "Pennsylvania", "Moscow"
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
                //setReviews(data['content'])
                fetchSenders(data['content']).then();
            })
            .catch((error) => {console.error("Error removing from reviews:", error)})
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
                        senderName: review.senderRole === "UNIVERSITY"
                            ? data.name
                            : `${data.firstName} ${data.lastName}`,
                    }))
            );
            const updatedReviews = await Promise.all(promises);
            setReviews(updatedReviews);
        }
        catch (error) {
            console.error("Error fetching sender information:", error);
        }
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
                <CompanySearchBar
                    filters={searchFilters}
                    onFilterChange={handleSearchFilterChange}
                    locations={locations}
                    onSearch={handleSearch}
                />
                {/*<div className="company_search">*/}
                {/*    <input*/}
                {/*        type="text"*/}
                {/*        placeholder="Company name"*/}
                {/*        value={searchFilters.name}*/}
                {/*        onChange={(e) => handleSearchFilterChange('name', e.target.value)}*/}
                {/*    />*/}

                {/*    <select*/}
                {/*        value={searchFilters.location}*/}
                {/*        onChange={(e) => handleSearchFilterChange('location', e.target.value)}*/}
                {/*    >*/}
                {/*        <option value="All">*/}
                {/*            All*/}
                {/*        </option>*/}
                {/*        {locations.map((location) => (*/}
                {/*            <option key={location} value={location}>*/}
                {/*                {location}*/}
                {/*            </option>*/}
                {/*        ))}*/}
                {/*    </select>*/}
                {/*    <button onClick={handleSearch}>Find Company</button>*/}
                {/*</div>*/}
            </div>

            <div className="company-main-section">

                <CompanySideBar
                    title={"University Type"}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />
                {/*<div className="company-sidebar-filters">*/}
                {/*    <h4>Company Type</h4>*/}
                {/*    <div>*/}
                {/*        {['PRIVATE', 'STATE'].map((type) => (*/}
                {/*            <label key={type}>*/}
                {/*                <input*/}
                {/*                    type="radio"*/}
                {/*                    name="type"*/}
                {/*                    value={type}*/}
                {/*                    checked={filters.type === type}*/}
                {/*                    onChange={(e) => handleFilterChange('type', e.target.value)}*/}
                {/*                />*/}
                {/*                {type}*/}
                {/*            </label>*/}
                {/*        ))}*/}
                {/*    </div>*/}

                {/*    <button onClick={handleClearFilters}>Clear Filters</button>*/}

                {/*</div>*/}

                <CompanyCardList
                    items={companies}
                    onViewProfile={(company) => {
                        fetchReviews(company.ownerId);
                        setReview(prevState => ({
                            ...prevState,
                            recipientId: company.ownerId,
                        }));
                        openModal(company)
                    }}
                    icon={companyIcon}
                />
                {/*<div className="company-list">*/}
                {/*    {companies*/}
                {/*        .map((company) => (*/}
                {/*            <div key={company.id} className="company-card">*/}
                {/*                <div>*/}
                {/*                    <img*/}
                {/*                        src={companyIcon}*/}
                {/*                        className="company_logo"*/}
                {/*                     alt={""}/>*/}
                {/*                </div>*/}
                {/*                <div className="card-right-section">*/}
                {/*                    <div className="company-info">*/}
                {/*                        <h3>{company.name}</h3>*/}
                {/*                        <p>*/}
                {/*                            <i className="location_icon"></i>*/}
                {/*                            <span className="location_name">{company.location}</span>*/}
                {/*                        </p>*/}
                {/*                    </div>*/}
                {/*                    <button className="company-view-profile" onClick={() => {*/}
                {/*                        fetchReviews(company.ownerId);*/}
                {/*                        setReview(prevState => ({*/}
                {/*                            ...prevState,*/}
                {/*                            recipientId: company.ownerId,*/}
                {/*                        }));*/}
                {/*                        openModal(company)*/}
                {/*                    }}>*/}
                {/*                        View Profile →*/}
                {/*                    </button>*/}
                {/*                </div>*/}

                {/*            </div>*/}
                {/*        ))}*/}
                {/*</div>*/}
            </div>


            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            {/*<div className="company-pagination">*/}
            {/*    <button*/}
            {/*        disabled={currentPage === 1}*/}
            {/*        onClick={() => handlePageChange(currentPage - 1)}*/}
            {/*    >*/}
            {/*        ←*/}
            {/*    </button>*/}
            {/*    {[...Array(totalPages).keys()].map((page) => (*/}
            {/*        <button*/}
            {/*            key={page + 1}*/}
            {/*            className={currentPage === page + 1 ? 'active' : ''}*/}
            {/*            onClick={() => handlePageChange(page + 1)}*/}
            {/*        >*/}
            {/*            {page + 1}*/}
            {/*        </button>*/}
            {/*    ))}*/}
            {/*    <button*/}
            {/*        disabled={currentPage === totalPages}*/}
            {/*        onClick={() => handlePageChange(currentPage + 1)}*/}
            {/*    >*/}
            {/*        →*/}
            {/*    </button>*/}
            {/*</div>*/}

            {selectedCompany && (

                <CompanyModal
                    company={selectedCompany}
                    closeModal={closeModal}
                    reviews={reviews}
                    onReviewSubmit={addReview}
                    role={decodedToken['user-role']}
                    review={review}
                    setReview={setReview}
                    handleReview={handleReview}
                    fetchReviews={fetchReviews}
                />
                // <div className="company-modal-overlay" onClick={closeModal}>
                //     <div className="company-modal-content" onClick={(e) => e.stopPropagation()}>
                //         <button className="company-modal-close" onClick={closeModal}>×</button>
                //
                //         <div className="modal-header">
                //             <img
                //                 src={companyIcon}
                //                 className="company_logo"
                //              alt={""}/>
                //             <div className="header-info">
                //                 <h2>{selectedCompany.name}</h2>
                //                 <p><strong>Type:</strong> {selectedCompany.type}</p>
                //             </div>
                //         </div>
                //
                //
                //         <div className="main-section">
                //             <div className="left-side">
                //                 <div className="about-us-container">
                //                     <h2>Information about company</h2>
                //                     <p>{selectedCompany.aboutUs}</p>
                //                 </div>
                //
                //                 <div className="review-container">
                //                     <div className="reviews-list">
                //                         {reviews.map((review) => (
                //                             <div key={review.id} className="review-item">
                //                                 <div className="candidate-info">
                //                                     <p><strong>Sender:</strong> {review.senderName}</p>
                //                                     <p className="review-text">{review.reviewText}</p>
                //                                     <p><strong>Rating: </strong> {review.rating} / 5</p>
                //                                 </div>
                //                             </div>
                //                         ))}
                //                     </div>
                //
                //                     {(decodedToken['user-role'] === "UNIVERSITY" || decodedToken['user-role'] === "STUDENT") && (
                //                         <div className="review-form">
                //                             <input
                //                                 type="text"
                //                                 name="reviewText"
                //                                 placeholder="Write your review..."
                //                                 value={review.reviewText}
                //                                 onChange={handleReview}
                //                             />
                //                             <StarRating
                //                                 rating={review.rating}
                //                                 onRatingChange={(value) =>
                //                                     setReview((prevReview) => ({
                //                                         ...prevReview,
                //                                         rating: value,
                //                                     }))
                //                                 }
                //                             />
                //
                //                             <button
                //                                 className="submit-button"
                //                                 onClick={() => {
                //                                     addReview();
                //                                     fetchReviews(selectedCompany.ownerId);
                //                                     setReview(prevState => ({
                //                                         ...prevState,
                //                                         reviewText: '', rating: 0
                //                                     }));
                //                                 }}
                //                             >
                //                                 Send
                //                             </button>
                //                         </div>
                //                     )}
                //                 </div>
                //             </div>
                //
                //             <div className="right-side">
                //                 <h3>Contact Information</h3>
                //                 <div className="contact-item">
                //                     <img
                //                         src={websiteIcon}
                //                         className="icon"
                //                      alt={""}/>
                //                     <div className="contact-item-info">
                //                         <p className="label">WEBSITE</p>
                //                         <p><a href={selectedCompany.website} target="_blank"
                //                               rel="noopener noreferrer">{selectedCompany.website}</a></p>
                //                     </div>
                //                 </div>
                //                 <div className="contact-item">
                //                     <img
                //                         src={locationIcon}
                //                         className="icon"
                //                      alt={""}/>
                //                     <div className="contact-item-info">
                //                         <p className="label">LOCATION</p>
                //                         <p>{selectedCompany.location}</p>
                //                     </div>
                //                 </div>
                //                 <div className="contact-item">
                //                     <img
                //                         src={phoneIcon}
                //                         className="icon"
                //                      alt={""}/>
                //                     <div className="contact-item-info">
                //                         <p className="label">PHONE</p>
                //                         <p>{selectedCompany.contactPhone}</p>
                //                     </div>
                //                 </div>
                //                 <div className="contact-item">
                //                     <img
                //                         src={emailIcon}
                //                         className="icon"
                //                      alt={""}/>
                //                     <div className="contact-item-info">
                //                         <p className="label">EMAIL ADDRESS</p>
                //                         <p><a href={selectedCompany.email}>{selectedCompany.email}</a></p>
                //                     </div>
                //                 </div>
                //             </div>
                //         </div>
                //
                //
                //     </div>
                // </div>
            )}
        </div>
    );
};

export default Companies;
