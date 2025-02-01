import jwtDecode from 'jwt-decode';

export const decodeToken = (token) => {
    try {
        return jwtDecode(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const getRoleFromToken = (token) => {
    const decoded = decodeToken(token);
    return decoded ? decoded['user-role'] : null;
};