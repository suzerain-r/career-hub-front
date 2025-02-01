// src/services/authService.js
import {jwtDecode} from "jwt-decode";

const baseUrl = "http://localhost:8080";
const url = `${baseUrl}/auth/login`;

export const login = async (username, password) => {
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
            // Сохраняем токен в localStorage
            localStorage.setItem('authToken', data.token);

            // Декодируем токен и возвращаем его
            const decodedToken = jwtDecode(data.token);
            return { success: true, decodedToken };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error during login:', error);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
};
