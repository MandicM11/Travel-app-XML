import axios from 'axios';

const userApi = axios.create({
    baseURL: 'http://localhost:8000/user-service',
});

const blogApi = axios.create({
    baseURL: 'http://localhost:8000/blog-service',
});

export const registerUser = async (userData) => {
    try {
        const response = await userApi.post('/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await userApi.post('/login', userData);
       
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createBlog = async (blogData, token) => {
    try {
        const response = await blogApi.post('/create', blogData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
