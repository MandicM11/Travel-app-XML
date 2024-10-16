import axios from 'axios';
import { getSession } from 'next-auth/react';

// Kreiraj axios instance za blog, user, i tour API
const blogApi = axios.create({
    baseURL: 'http://localhost:8000/blog-service',
    withCredentials: true, // Ako koristiš kolačiće za autentifikaciju
});

const userApi = axios.create({
    baseURL: 'http://localhost:8000/user-service',
    withCredentials: true, // Ako koristiš kolačiće za autentifikaciju
    headers: {
        'Content-Type': 'application/json',
    },
});

const tourApi = axios.create({
    baseURL: 'http://localhost:8000/tour-service',
    withCredentials: true, // Ako koristiš kolačiće za autentifikaciju
});

// Interceptor za blogApi
blogApi.interceptors.request.use(async (config) => {
    try {
        const session = await getSession();
        if (session && session.user.accessToken) {
            config.headers.Authorization = `Bearer ${session.user.accessToken}`;
            console.log('Token iz blogApi interceptora: ', config.headers.Authorization);
        }
    } catch (error) {
        console.error('Error fetching session:', error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor za userApi
userApi.interceptors.request.use(async (config) => {
    try {
        const session = await getSession();
        if (session && session.user.accessToken) {
            config.headers.Authorization = `Bearer ${session.user.accessToken}`;
            console.log('Token iz userApi interceptora: ', config.headers.Authorization);
        }
    } catch (error) {
        console.error('Error fetching session:', error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor za tourApi
tourApi.interceptors.request.use(async (config) => {
    try {
        const session = await getSession();
        if (session && session.user.accessToken) {
            config.headers.Authorization = `Bearer ${session.user.accessToken}`;
            console.log('Token iz tourApi interceptora: ', config.headers.Authorization);
        }
    } catch (error) {
        console.error('Error fetching session:', error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});



// API pozivi za blog
export const getBlogs = async () => {
    try {
        const response = await blogApi.get('/blogs');
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

// API pozivi za key points i ture
export const createKeyPoint = async (keyPointData) => {
    try {
        const response = await tourApi.post('/create-keypoint', keyPointData);
        return response.data;
    } catch (error) {
        console.error('Error creating key point:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getKeyPoints = async () => {
    try {
        const response = await tourApi.get('/keypoints');
        return response.data;
    } catch (error) {
        console.error('Error fetching key points:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getKeyPointById = async (id) => {
    try {
        const response = await tourApi.get(`/keypoint/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching key point by ID:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const createTour = async (tourData) => {
    try {
        const response = await tourApi.post('/tour/create-tour', tourData);
        return response.data;
    } catch (error) {
        console.error('Error creating tour:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getTourById = async (id) => {
    try {
        const response = await tourApi.get(`/tour/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tour:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const addKeyPointToTour = async (tourId, keyPointId) => {
    try {
        const response = await tourApi.post(`/tour/${tourId}/keypoint`, { keyPointId });
        return response.data;
    } catch (error) {
        console.error('Error adding key point to tour:', error.response ? error.response.data : error.message);
        throw error;
    }
};


export const getTours = async () => {
    try {
        const response = await tourApi.get('/tour');
        return response.data;
    } catch (error) {
        console.error('Error fetching key points:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const publishTour = async (tourId) => {
    try {
        const response = await tourApi.post(`/tour/${tourId}/publish`);
        return response.data;
    } catch (error) {
        console.error('Error publishing tour:', error.response ? error.response.data : error.message);
        throw error;
    }
};



export const archiveTour = async (tourId) => {
    try {
        const response = await tourApi.post(`/tour/${tourId}/archive`);
        return response.data;
    } catch (error) {
        console.error('Error archiving key points:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const activateTour = async (tourId) => {
    try {
        const response = await tourApi.post(`/tour/${tourId}/activate`);
        return response.data;
    } catch (error) {
        console.error('Error activate tour:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getPublishedTours = async () => {
    try {
      const response = await tourApi.get('/published');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch published tours');
    }
  };

  export const updateTourStatus  = async (tourId, status) => {
    try {
        const response = await tourApi.post(`/tour/${tourId}/${status}`);
        return response.data;
    } catch (error) {
        console.error('Error updating status of tour:', error.response ? error.response.data : error.message);
        throw error;
    }

    
};
// Funkcija za slanje lokacije na backend
export const saveLocation = async ({ lat, lng }) => {
    console.log('Sending data:', { lat, lng });
    try {
      const response = await userApi.post('/simulator', { lat, lng});
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  // Funkcija za dohvat trenutne lokacije
  export const getCurrentLocation = async () => {
    try {
      const response = await userApi.get('/simulator/current');
      return response.data;
    } catch (error) {
      throw error;
    }
  };






export { blogApi, userApi, tourApi };