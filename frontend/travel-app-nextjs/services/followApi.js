import axios from 'axios';

const followApi = axios.create({
  baseURL: 'http://localhost:8001', // Podesi osnovni URL za user-service
  withCredentials: true,
});

export const followUser = async (followingId, token) => {
  return await followApi.post('/follow', { followingId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const unfollowUser = async (followingId, token) => {
  return await followApi.delete(`/unfollow/${followingId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getFollowStatus = async (userId, token) => {
  return await followApi.get(`/follow-status/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getUsers = async (token) => {
  return await followApi.get('/users', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export default followApi;
