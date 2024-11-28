import React, {useEffect, useState} from 'react';
import '../style/candidates_style.css';
import Header from "./Header";

const Candidates = () => {

    const baseUrl = "http://localhost:8080";

    const token = localStorage.getItem("authToken");

    const [filters, setFilters] = useState({
        degree: '',
        gpa: '',
    });



    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(3);


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


    const query = new URLSearchParams(queryParams).toString();


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
                setStudents(data['content']);
                setTotalPages(data['totalPages']);
            })
            .catch((error) => console.error("Error fetching students:", error));
    };

    useEffect(() => {
        fetchStudents();
    }, [filters, currentPage]);


    const handleFilterChange = (name, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
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

    return (
        <div className="candidate-page">
            <Header/>

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

            <div className="candidate-main-content">
            <div className="candidate_search">
                    <input type="text" placeholder="Student name"/>
                    <button>Find Student</button>
                </div>

                <div className="candidate-list">
                    {students
                        .map((student) => (
                        <div key={student.id} className="candidate-card">
                            <div className="candidate-info">
                                <h3>{student.firstName} {student.lastName}</h3>
                                <p>Degree: {student.degree}</p>
                                <p>GPA: {student.gpa}</p>
                            </div>
                            <button className="candidate-view-profile" onClick={() => openModal(student)}>
                                View Profile →
                            </button>
                        </div>
                    ))}
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
            </div>

            {selectedStudent && (
                <div className="candidate-modal-overlay" onClick={closeModal}>
                    <div className="candidate-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="candidate-modal-close" onClick={closeModal}>×</button>
                        <h2>{selectedStudent.firstName} {selectedStudent.lastName}</h2>
                        <p><strong>Degree:</strong> {selectedStudent.degree}</p>
                        <p><strong>GPA:</strong> {selectedStudent.gpa}</p>
                        <p><strong>Year of Enrollment:</strong> {selectedStudent.yearOfEnrollment}</p>
                        <p><strong>Phone Number:</strong> {selectedStudent.phoneNumber}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Candidates;
