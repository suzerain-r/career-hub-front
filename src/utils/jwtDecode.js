import {jwtDecode} from 'jwt-decode';

const token = localStorage.getItem("authToken");

export const decodeToken = () => {
    try {
        return jwtDecode(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const getRoleFromToken = () => {
    const decoded = decodeToken(token);
    return decoded['user-role'];
};

export const getIdFromToken = () => {
    const decoded = decodeToken(token);
    return decoded['user-id'];
};