import '../../styles/candidates_style.css';
import Header from "../../components/Header";
import candidateIcon from "../../assets/candidate-icon.svg";
import CandidateCardList from "../../components/CandidateCardList";
import CandidateSearchBar from "../../components/CandidateSearchBar";
import CandidateSideBar from "../../components/CandidateSideBar";
import CandidateModal from "../../components/CandidateModal";
import Pagination from "../../components/Pagination";
import {useEffect, useState} from "react";
import {getIdFromToken, getRoleFromToken} from "../../utils/jwtDecode";
import {
    addReview,
    fetchFavorites,
    fetchReviews,
    fetchSenders,
    fetchStudents,
    fetchUniversity,
    togFavorite,
} from "../../services/apiService";


const Candidates = () => {

    const userId = getIdFromToken();
    const userRole = getRoleFromToken();

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
    const [university, setUniversity] = useState([])
    const [review, setReview] = useState({
        recipientId: "",
        senderId: userId,
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





    useEffect(() => {
        fetchStudents(query).then(data => {
            setStudents(data['content']);
            setTotalPages(data['totalPages'])
        });
    }, [filters, currentPage]);

    useEffect(() => {
        {userRole === "COMPANY" && (
            fetchFavorites(userId).then((data) => setFavorites(data))
        )}
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
        fetchStudents(query).then(data => {
            setStudents(data['content']);
            setTotalPages(data['totalPages'])
        });
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



    const isFavorite = (id) => Array.isArray(favorites) && favorites.includes(id);

    const toggleFavorite = async (id) => {
        const currentlyFavorite = isFavorite(id);
        await togFavorite(userId, id, currentlyFavorite);
        if (!currentlyFavorite) {
            setFavorites((prevFavorites) => [...prevFavorites, id]);
        }
        else {
            setFavorites((prevFavorites) => prevFavorites.filter((favId) => favId !== id));
        }
    };


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
                <CandidateSearchBar
                    filters={searchFilters}
                    onFilterChange={handleSearchFilterChange}
                    onSearch={handleSearch}
                />
            </div>

            <div className="company-main-section">


                <CandidateSideBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />

                <CandidateCardList
                    students={students}
                    onViewProfile={(student) => {
                        fetchReviews(student.ownerId).then((data) => {
                            fetchSenders(data['content']).then((data) => {
                                console.log(data);
                                setReviews(data)});
                        });
                        setReview(prevState => ({
                            ...prevState,
                            recipientId: student.ownerId,
                        }));
                        fetchUniversity(student.universityId).then((data) => {setUniversity(data)});
                        openModal(student)
                    }}
                    candidateIcon={candidateIcon}
                    toggleFavorite={toggleFavorite}
                    isFavorite={isFavorite}
                />

            </div>


            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />


            {selectedStudent && (
                <CandidateModal
                    student={selectedStudent}
                    university={university}
                    closeModal={closeModal}
                    reviews={reviews}
                    onReviewSubmit={async () => {
                        const response = await addReview(review);
                        if (response?.ok) {
                            const updatedReviews = await fetchReviews(selectedStudent.ownerId);
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

export default Candidates;
