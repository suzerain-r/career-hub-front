import React, {useEffect, useState} from 'react';
import '../style/companies_style.css';
import Header from "./Header";

const Companies = () => {


    const baseUrl = "http://localhost:8080";

    const token = localStorage.getItem("authToken");

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
    const [pageSize] = useState(3);

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
                const filteredCompanies = data['content'].filter(company =>
                    company.name !== null &&
                    company.location !== null &&
                    company.type !== null &&
                    company.industry !== null &&
                    company.aboutUs !== null &&
                    company.website !== null
                );
                setCompanies(filteredCompanies);
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



    return (
        <div className="company-page">
            <Header/>

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

            <div className="company-main-content">
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

                <div className="company-list">
                    {companies
                        .map((company) => (
                            <div key={company.id} className="company-card">
                                <div className="company-info">
                                    <h3>{company.name}</h3>
                                    <p>{company.location}</p>
                                </div>
                                <button className="company-view-profile" onClick={() => openModal(company)}>
                                    View Profile →
                                </button>
                            </div>
                        ))}
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default Companies;
