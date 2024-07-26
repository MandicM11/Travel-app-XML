import React from 'react';
import { followUser } from '../services/api/followApi';

const FollowButton = ({ followingId }) => {
  const handleFollow = async () => {
    try {
      await followUser(followingId);
      alert('Followed successfully');
    } catch (err) {
      alert('Error following user');
    }
  };

  return <button onClick={handleFollow}>Follow</button>;
};

export default FollowButton;
