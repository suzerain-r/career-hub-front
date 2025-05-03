import {getIdFromToken} from "../utils/jwtDecode";

const baseUrl = "http://localhost:8080";

const token = localStorage.getItem("authToken");

const homeService = {
    getStudentsCount: async () => {
        const response = await fetch(`${baseUrl}/student/search`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    getCompaniesCount: async () => {
        const response = await fetch(`${baseUrl}/company/search`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    getAverageRatingsForUniversities: async (universityList) => {
        try {
            const promises = universityList.map((university) =>
                fetch(`${baseUrl}/review/getAverageRating/${university.ownerId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }).then((response) => response.json().then((data) => ({ id: university.ownerId, averageRating: data?.averageRating || 0 })))
            );

            const ratings = await Promise.all(promises);
            const ratingsMap = ratings.reduce((map, rating) => {
                map[rating.id] = rating.averageRating;
                return map;
            }, {});

            return universityList.map((university) => ({
                ...university,
                averageRating: ratingsMap[university.ownerId] || 0,
            }));
        } catch (error) {
            console.error("Error fetching ratings:", error);
        }
    }


};

export default homeService;



////
export const fetchStudents = async (query) => {
    const response = await fetch(`${baseUrl}/student/search?${query}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.json();
};

export const fetchCompanies = async (query) => {
    const response = await fetch(`${baseUrl}/company/search?${query}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.json();

};

export const fetchUniversities = async (query) => {
    const response = await fetch(`${baseUrl}/university/search?${query}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.json();

};


////
export const fetchFavorites = async (userId) => {
    const response = await fetch(`${baseUrl}/company/favouriteStudent/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.json();
};


export const togFavorite = async (userId, studentId, isFavorite) => {
    await fetch(`${baseUrl}/company/favouriteStudent/${userId}?studentOwnerId=${studentId}`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};


////
export const fetchReviews = async (id) => {
    const response = await fetch(`${baseUrl}/review/getAll/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    return response.json();
};

export const fetchSenders = async (reviewList) => {
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
        return await Promise.all(promises);
    }
    catch (error) {
        console.error("Error fetching sender information:", error);
    }
}

export const addReview = async (review) => {
    return await fetch(`${baseUrl}/review/add`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
    });
};


////
export const fetchUniversity = async (id) => {
    const response = await fetch(`${baseUrl}/university/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
    return response.json();
}

export const fetchStudent = async (id) => {
    const response = await fetch(`${baseUrl}/student/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
    return response.json();
}

export const fetchCompany = async (id) => {
    const response = await fetch(`${baseUrl}/company/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
    return response.json();
}


////
export const updateStudentProfile = async (profile) => {
    try {
        const response = await fetch(`${baseUrl}/student/${getIdFromToken()}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(profile),
        });


        if (response.ok) {
            return { success: true };
        } else {
            const errorData = await response.json();
            return { success: false, message: errorData };
        }
    } catch (error) {
        console.error("Error saving profile:", error);
        return { success: false, message: error.message };
    }
};


export const updateUniversityProfile = async (profile) => {
    try {
        const response = await fetch(`${baseUrl}/university/update/${getIdFromToken()}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(profile),
        });

        if (response.ok) {
            return { success: true };
        } else {
            const errorData = await response.json();
            return { success: false, message: errorData };
        }
    } catch (error) {
        console.error("Error saving university profile:", error);
        return { success: false, message: "Network error" };
    }
};


export const updateCompanyProfile = async (profile) => {
    try {
        const response = await fetch(`${baseUrl}/company/update/${getIdFromToken()}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(profile),
        });

        if (response.ok) {
            return { success: true };
        } else {
            const errorData = await response.json();
            return { success: false, message: errorData };
        }
    } catch (error) {
        console.error("Error saving company profile:", error);
        return { success: false, message: "Network error" };
    }
};



////
export const fetchStudentsOfUniversity = async () => {
    const response = await fetch(`${baseUrl}/student/search?universityId=${getIdFromToken()}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    return response.json();
}