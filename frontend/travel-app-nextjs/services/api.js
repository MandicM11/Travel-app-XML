import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const userApi = axios.create({
    baseURL: 'http://localhost:8001',
    withCredentials: true,
});

const blogApi = axios.create({
    baseURL: 'http://localhost:8002',
    withCredentials: true,
});

userApi.interceptors.request.use(async (config) => {
    const session = await getSession();
    console.log('Interceptor - session:', session); // Dodaj log ovde
    if (session) {
        console.log('Interceptor - session token:', session.user.token); // Dodaj log ovde
        config.headers.Authorization = `Bearer ${session.user.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

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

export const getUsers = async () => {
    try {
        const response = await userApi.get('/users');
        console.log('Fetched users:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
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
