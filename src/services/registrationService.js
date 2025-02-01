// src/services/registrationService.js

const baseUrl = "http://localhost:8080/auth";

export const register = async (role, username, email, password, token) => {
    let url = '';

    switch (role.toLowerCase()) {
        case 'university':
            url = `${baseUrl}/university/registration`;
            break;
        case 'company':
            url = `${baseUrl}/company/registration`;
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
