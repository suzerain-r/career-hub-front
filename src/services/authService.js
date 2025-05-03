// src/services/authService.js

const baseUrl = "http://localhost:8080/auth";

const token = localStorage.getItem("authToken");

export const login = async (username, password) => {
    let url = `${baseUrl}/login`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            console.log(data);
            localStorage.setItem('authToken', data.token);
            return { success: true};
        } else {
            return { success: false, message: data.message};
        }
    } catch (error) {
        console.error('Error during login:', error);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
};


export const register = async (role, username, email, password) => {
    let url = '';

    switch (role.toLowerCase()) {
        case 'university':
            url = `${baseUrl}/university/registration`;
            break;
        case 'company':
            url = `${baseUrl}/company/registration`;
            break;
        case 'student':
            url = `${baseUrl}/student/registration`;
            break;
        default:
            throw new Error('Unknown role');
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                role: role.toUpperCase(),
                username,
                email,
                password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error during registration:', error);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
};