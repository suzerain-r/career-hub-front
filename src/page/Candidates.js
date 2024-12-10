import React, {useEffect, useState} from 'react';
import '../style/candidates_style.css';
import Header from "./Header";
import {jwtDecode} from "jwt-decode";
import candidateIcon from "../resources/candidate-icon.svg";
import favourite_active from "../resources/favourite_active.svg";
import favourite_not_active from "../resources/favourite_not_active.svg";

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
    const [review, setReview] = useState({
        recipientId: "",
        senderId: decodedToken['user-id'],
        reviewText: "",
        rating: "",
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
                        onChange={(e) => handleSearchFilterChange('name', e.target.value)}
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
                        <h2>{selectedStudent.firstName} {selectedStudent.lastName}</h2>
                        <p><strong>Degree:</strong> {selectedStudent.degree}</p>
                        <p><strong>GPA:</strong> {selectedStudent.gpa}</p>
                        <p><strong>About me:</strong> {selectedStudent.aboutUs}</p>
                        <p><strong>Phone Number:</strong> {selectedStudent.phoneNumber}</p>
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
                                <button onClick={() => {
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

export default Candidates;
