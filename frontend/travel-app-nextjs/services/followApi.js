import axios from 'axios';

const followApi = axios.create({
  baseURL: 'http://localhost:8000/user-service/follow',
  withCredentials: true,
});

export const followUser = (followingId) => followApi.post('/follow', { followingId });

export const unfollowUser = (followingId) => followApi.delete(`/unfollow/${followingId}`);

export default followApi;
