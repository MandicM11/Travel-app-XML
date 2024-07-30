import axios from 'axios';
import { getSession } from 'next-auth/react';

// Kreiraj axios instance za blog i user API
const blogApi = axios.create({
    baseURL: 'http://localhost:8000/blog-service',
    withCredentials: true, // Ako koristiš kolačiće za autentifikaciju
});

const userApi = axios.create({
    baseURL: 'http://localhost:8000/user-service',
    withCredentials: true, // Ako koristiš kolačiće za autentifikaciju
});

// Interceptor za dodavanje Authorization header-a
userApi.interceptors.request.use(async (config) => {
    const session = await getSession();
    if (session && session.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// API pozivi za blog
export const getBlogs = async () => {
    try {
        const response = await blogApi.get('/');
        return response.data;
    } catch (error) {
        console.error('Error fetching blogs:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const createBlog = async (blogData) => {
    try {
        const response = await blogApi.post('/create', blogData);
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
        console.error('Error fetching comments:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const addComment = async (blogId, content) => {
    try {
        const response = await blogApi.post(`/${blogId}/comments`, { content });
        return response.data;
    } catch (error) {
        console.error('Error adding comment:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// API pozivi za korisnike
export const registerUser = async (userData) => {
    try {
        const response = await userApi.post('/register', userData);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await userApi.post('/login', userData);
        return response.data;
    } catch (error) {
        console.error('Error logging in user:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getUsers = async () => {
    try {
        const response = await userApi.get('/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getFollowStatus = async (followingId) => {
    try {
        const response = await userApi.get(`/follow-status/${followingId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching follow status:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const followUser = async (followingId) => {
    try {
        const response = await userApi.post('/follow', { followingId });
        return response.data;
    } catch (error) {
        console.error('Error following user:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const unfollowUser = async (followingId) => {
    try {
        const response = await userApi.delete(`/unfollow/${followingId}`);
        return response.data;
    } catch (error) {
        console.error('Error unfollowing user:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export { blogApi, userApi };
