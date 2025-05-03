import React, {useEffect, useState} from 'react';
import '../../styles/companies_style.css';
import Header from "../../components/Header";
import companyIcon from "../../assets/company-icon.svg";
import CompanyCardList from "../../components/CompanyCardList";
import CompanySearchBar from "../../components/CompanySearchBar";
import Pagination from "../../components/Pagination";
import CompanyModal from "../../components/CompanyModal";
import CompanySideBar from "../../components/CompanySideBar";
import {addReview, fetchCompanies, fetchReviews, fetchSenders} from "../../services/apiService";
import {getIdFromToken, getRoleFromToken} from "../../utils/jwtDecode";

const Companies = () => {

    const userId = getIdFromToken();
    const userRole = getRoleFromToken();

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
        senderId: userId,
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

    const query = new URLSearchParams(queryParams).toString();



    useEffect(() => {
        fetchCompanies(query).then((data) => {
            setCompanies(data['content']);
            setTotalPages(data['totalPages']);
        })
            .catch((error) => {
                console.error("Error fetching companies:", error);
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
        fetchCompanies(query).then((data) => {
            setCompanies(data['content']);
            setTotalPages(data['totalPages']);
        })
            .catch((error) => {
                console.error("Error fetching companies:", error);
            });
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
            </div>

            <div className="company-main-section">

                <CompanySideBar
                    title={"University Type"}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />

                <CompanyCardList
                    items={companies}
                    onViewProfile={(company) => {
                        fetchReviews(company.ownerId).then(data => {
                            fetchSenders(data['content']).then(data => {setReviews(data)})
                        });
                        setReview(prevState => ({
                            ...prevState,
                            recipientId: company.ownerId,
                        }));
                        openModal(company)
                    }}
                    icon={companyIcon}
                />
            </div>


            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {selectedCompany && (

                <CompanyModal
                    company={selectedCompany}
                    closeModal={closeModal}
                    reviews={reviews}
                    onReviewSubmit={async () => {
                        const response = await addReview(review);
                        if (response?.ok) {
                            console.log(response);
                            const updatedReviews = await fetchReviews(selectedCompany.ownerId);
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

export default Companies;
