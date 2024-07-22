import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/user-service', // Osnovna URL adresa za API
});

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await api.post('/login', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
