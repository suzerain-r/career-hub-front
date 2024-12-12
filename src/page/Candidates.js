import React, {useEffect, useState} from 'react';
import '../style/candidates_style.css';
import Header from "./Header";
import {jwtDecode} from "jwt-decode";
import candidateIcon from "../resources/candidate-icon.svg";
import favourite_active from "../resources/favourite_active.svg";
import favourite_not_active from "../resources/favourite_not_active.svg";
import StarRating from "./StarRating";
import universityIcon from "../resources/university-icon.svg";
import phoneIcon from "../resources/phone-icon.svg";
import emailIcon from "../resources/email-icon.svg";


const Candidates = () => {

    const baseUrl = "http://localhost:8080";

    const token = localStorage.getItem("authToken");
    const decodedToken = jwtDecode(token);

    const [filters, setFilters] = useState({
        degree: '',
        gpa: '',
    });

    const [searchFilters, setSearchFilters] = useState({
        firstName: '',
    });



    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(5);
    const [favorites, setFavorites] = useState([]);
    const [reviews, setReviews] = useState([]);
    //const [company, setCompany] = useState([]);
    const [university, setUniversity] = useState([])
    const [review, setReview] = useState({
        recipientId: "",
        senderId: decodedToken['user-id'],
        reviewText: "",
        rating: "",
        recipientRole: "STUDENT",
    });



    const queryParams = {
        page: currentPage - 1,
        size: pageSize,
    }


    if (filters.degree) queryParams.degree = filters.degree;

    if (filters.gpa){
        const [minGpa, maxGpa] = filters.gpa.split(' - ').map((value) => parseFloat(value));
        queryParams.minGpa = minGpa;
        queryParams.maxGpa = maxGpa;
    }

    if(searchFilters.firstName){
        queryParams.firstName = searchFilters.firstName;
    }


    const query = new URLSearchParams(queryParams).toString();


    const fetchFavorites = () => {
        {decodedToken['user-role'] === "COMPANY" && (
            fetch(`${baseUrl}/company/favouriteStudent/${decodedToken['user-id']}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setFavorites(data);
                })
                .catch((error) => console.error("Error fetching students:", error))
        )}
    }

    const fetchStudents = () => {

        fetch(`${baseUrl}/student/search?${query}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // const filteredStudents = data['content'].filter(student =>
                //     student.firstName !== null &&
                //     student.lastName !== null &&
                //     student.degree !== null &&
                //     student.gpa !== null &&
                //     student.aboutUs !== null &&
                //     student.phoneNumber !== null
                // );
                setStudents(data['content']);
                setTotalPages(data['totalPages'])
            })
            .catch((error) => console.error("Error fetching students:", error));


    };

    useEffect(() => {
        fetchStudents();
    }, [filters, currentPage]);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const handleFilterChange = (name, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleSearchFilterChange = (filterName, value) => {
        setSearchFilters((prevFilters) => ({
            ...prevFilters,
            [filterName]: value,
        }));
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchStudents();
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const openModal = (student) => {
        setSelectedStudent(student);
    };

    const closeModal = () => {
        setSelectedStudent(null);
    };

    const handleClearFilters = () => {
        setFilters({ type: '' });
        setCurrentPage(1);
    };


    const fetchUniversity = (id) => {
        fetch(`${baseUrl}/student/${decodedToken['user-id']}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then(() => {
                return fetch(`${baseUrl}/university/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            })
            .then((response) => response.json())
            .then((data) => setUniversity(data))
            .catch((error) => console.error("Error fetching university:", error));
    }

    // const fetchCompany = (id) => {
    //     fetch(`${baseUrl}/student/${decodedToken['user-id']}`, {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${token}`,
    //             'Content-Type': 'application/json',
    //         }
    //     })
    //         .then((response) => response.json())
    //         .then(() => {
    //             return fetch(`${baseUrl}/company/${id}`, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`,
    //                     'Content-Type': 'application/json',
    //                 }
    //             });
    //         })
    //         .then((response) => response.json())
    //         .then((data) => setCompany(data))
    //         .catch((error) => console.error("Error fetching company:", error));
    // }


    const addFavorite = (id) => {
        {decodedToken['user-role'] === "COMPANY" && (
            fetch(`${baseUrl}/company/favouriteStudent/${decodedToken['user-id']}?studentOwnerId=${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
                .then(() => {
                    setFavorites((prevFavorites) => [...prevFavorites, id]);
                })
                .catch((error) => console.error("Error adding to favorites:", error))
        )}
    };

    const deleteFavorite = (id) => {
        {decodedToken['user-role'] === "COMPANY" && (
            fetch(`${baseUrl}/company/favouriteStudent/${decodedToken['user-id']}?studentOwnerId=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
                .then(() => {
                    setFavorites((prevFavorites) => prevFavorites.filter((favId) => favId !== id));
                })
                .catch((error) => console.error("Error removing from favorites:", error))
        )}
    };

    const isFavorite = (id) => Array.isArray(favorites) && favorites.includes(id);

    const toggleFavorite = (id) => {
        if (isFavorite(id)) {
            deleteFavorite(id);
        } else {
            addFavorite(id);
        }
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
                //setReviews(data['content']);
                fetchSenders(data['content']);
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
                    fetchReviews(selectedStudent.ownerId)
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
        <div className="candidate-page">
            <Header/>

            <div className="candidate_search_container">
                <h1>Candidates</h1>
                <div className="candidate_search">
                    <input
                        type="text"
                        placeholder="Candidate name"
                        value={searchFilters.name}
                        onChange={(e) => handleSearchFilterChange('firstName', e.target.value)}
                    />

                    <button onClick={handleSearch}>Find Candidate</button>
                </div>
            </div>

            <div className="company-main-section">

                <div className="candidate-sidebar-filters">
                    <h4>Degree</h4>
                    <div>
                        {['BACHELOR', 'MASTER', 'DOCTORATE'].map((degree) => (
                            <label key={degree}>
                                <input
                                    type="radio"
                                    name="degree"
                                    value={degree}
                                    checked={filters.degree === degree}
                                    onChange={(e) => handleFilterChange('degree', e.target.value)}
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
                                    onChange={(e) => handleFilterChange('gpa', e.target.value)}
                                />
                                {gpa}
                            </label>
                        ))}
                    </div>

                    <button onClick={handleClearFilters}>Clear Filters</button>

                </div>

                <div className="candidate-list">
                    {students
                        .map((student) => (
                            <div key={student.id} className="candidate-card">
                                <div>
                                    <img
                                        src={candidateIcon}
                                        className="company_logo"
                                    />
                                </div>

                                <div className="card-right-section">
                                    <div className="candidate-info">
                                        <h3>{student.firstName} {student.lastName}</h3>
                                        <p>Degree: {student.degree}</p>
                                    </div>

                                    <div className="candidate-actions">
                                        {decodedToken['user-role'] === "COMPANY" && (
                                            <button
                                                className="candidate-favorite"
                                                onClick={() => toggleFavorite(student.ownerId)}
                                                aria-label={isFavorite(student.ownerId) ? "Remove from Favorites" : "Add to Favorites"}
                                            >
                                                {isFavorite(student.ownerId) ?
                                                    <img src={favourite_active}></img> :
                                                    <img src={favourite_not_active}></img>
                                                }
                                            </button>
                                        )}
                                        <button className="candidate-view-profile" onClick={() => {
                                            fetchReviews(student.ownerId);
                                            setReview(prevState => ({
                                                ...prevState,
                                                recipientId: student.ownerId,
                                            }));
                                            fetchUniversity(student.universityId);
                                            openModal(student)
                                        }
                                        }>
                                            View Profile →
                                        </button>

                                    </div>
                                </div>

                            </div>
                        ))}
                </div>
            </div>
            <div className="candidate-pagination">
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

            {selectedStudent && (
                <div className="candidate-modal-overlay" onClick={closeModal}>
                    <div className="candidate-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="candidate-modal-close" onClick={closeModal}>×</button>
                        <div className="modal-header">
                            <img
                                src={candidateIcon}
                                className="candidate-logo"
                            />
                            <div className="header-info">
                                <h2>{selectedStudent.name}</h2>
                            </div>
                        </div>


                        <div className="main-section">
                            <div className="left-side">
                                <div className="about-us-container">
                                    <h2>Information about candidate</h2>
                                    <p>{selectedStudent.aboutUs}</p>
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
                                            {/*<input*/}
                                            {/*    type="number"*/}
                                            {/*    name="rating"*/}
                                            {/*    placeholder="Rating (1-5)"*/}
                                            {/*    min="1"*/}
                                            {/*    max="5"*/}
                                            {/*    value={review.rating}*/}
                                            {/*    onChange={handleReview}*/}
                                            {/*/>*/}
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
                                                    fetchReviews(selectedStudent.ownerId);
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
                                        src={universityIcon}
                                        className="icon"
                                    />
                                    <div className="contact-item-info">
                                        <p className="label">University</p>
                                        <p>{university.name}</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <img
                                        src={phoneIcon}
                                        className="icon"
                                    />
                                    <div className="contact-item-info">
                                        <p className="label">PHONE</p>
                                        <p>{selectedStudent.phoneNumber}</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <img
                                        src={emailIcon}
                                        className="icon"
                                    />
                                    <div className="contact-item-info">
                                        <p className="label">EMAIL ADDRESS</p>
                                        <p><a href={selectedStudent.email}>{selectedStudent.email}</a></p>
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

export default Candidates;
