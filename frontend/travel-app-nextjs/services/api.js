import axios from 'axios';

const userApi = axios.create({
    baseURL: 'http://localhost:8001',
    withCredentials: true, // Osiguraj da kolačići budu uključeni u zahteve
});

const blogApi = axios.create({
    baseURL: 'http://localhost:8002',
    withCredentials: true, // Osiguraj da kolačići budu uključeni u zahteve
});

// Helper za postavljanje autorizacionog tokena nije potreban više

export const getBlogs = async () => {
    try {
        const response = await blogApi.get('/');
        return response.data;
    } catch (error) {
        console.error('Error fetching blogs:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await userApi.post('/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Prijava korisnika na osnovu rute na backendu
export const loginUser = async (userData) => {
    try {
        const response = await userApi.post('/login', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createBlog = async (blogData) => {
    try {
        console.log('Sending request with data:', blogData);
        const response = await blogApi.post('/create', blogData);
        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating blog:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getComments = async (blogId) => {
    try {
        const response = await blogApi.get(`/${blogId}/comments`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addComment = async (blogId, content) => {
    try {
        const response = await blogApi.post(`/${blogId}/comments`, { content });
        return response.data;
    } catch (error) {
        throw error;
    }
};
