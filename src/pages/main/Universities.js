import React, { useEffect, useState } from 'react';
import '../../styles/universities_style.css';
import Header from "../../components/Header";
import universityIcon from "../../assets/university-icon.svg";
import Pagination from "../../components/Pagination";
import UniversityModal from "../../components/UniversityModal";
import UniversityCardList from "../../components/UniversityCardList";
import UniversitySearchBar from "../../components/UniversitySearchBar";
import UniversitySideBar from "../../components/UniversitySideBar";
import {getIdFromToken, getRoleFromToken} from "../../utils/jwtDecode";
import {addReview, fetchReviews, fetchSenders, fetchUniversities} from "../../services/apiService";

const Universities = () => {

    const userId = getIdFromToken();
    const userRole = getRoleFromToken();

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
        senderId: userId,
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


    if (filters.type) queryParams.type = filters.type;
    if(searchFilters.location !== 'All'){
        queryParams.location = searchFilters.location;
    }
    if(searchFilters.name){
        queryParams.name = searchFilters.name;
    }

    const query = new URLSearchParams(queryParams).toString();


    useEffect(() => {
        fetchUniversities(query).then((data) => {
            setUniversities(data['content']);
            setTotalPages(data['totalPages']);
        })
            .catch((error) => {
                console.error("Error fetching universities:", error);
            });
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
        fetchUniversities(query).then((data) => {
            setUniversities(data['content']);
            setTotalPages(data['totalPages']);
        })
            .catch((error) => {
                console.error("Error fetching universities:", error);
            });
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




    const handleReview = (e) => {
        const { name, value } = e.target;
        setReview((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    }


    return (
        <div className="university-page">
            <Header/>

            <div className="university_search_container">
                <h1>Universities</h1>
                <UniversitySearchBar
                    filters={searchFilters}
                    onFilterChange={handleSearchFilterChange}
                    locations={locations}
                    onSearch={handleSearch}
                />

            </div>


            <div className="university-main-section">

                <UniversitySideBar
                    title={"University Type"}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />
                <UniversityCardList
                    items={universities}
                    onViewProfile={(university) => {
                        fetchReviews(university.ownerId).then(data => {
                            fetchSenders(data['content']).then(data => {setReviews(data)})
                        });
                        setReview(prevState => ({
                            ...prevState,
                            recipientId: university.ownerId,
                        }));
                        openModal(university)
                    }}
                    icon={universityIcon}
                />

            </div>


            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />


            {selectedUniversity && (
                <UniversityModal
                    university={selectedUniversity}
                    closeModal={closeModal}
                    reviews={reviews}
                    onReviewSubmit={async () => {
                        const response = await addReview(review);
                        if (response?.ok) {
                            const updatedReviews = await fetchReviews(selectedUniversity.ownerId);
                            const reviewSenders = await fetchSenders(updatedReviews['content']);
                            setReviews(reviewSenders);
                        } else {
                            alert("Error saving review!");
                        }
                    }}
                    role={userRole.toUpperCase()}
                    review={review}
                    setReview={setReview}
                    handleReview={handleReview}
                    fetchReviews={fetchReviews}
                />
            )}
        </div>
    );
};

export default Universities;
