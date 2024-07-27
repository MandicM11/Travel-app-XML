import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { followUser, unfollowUser, getFollowStatus } from '../services/api';

const FollowButton = ({ userId }) => {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!session) return;

    const checkFollowStatus = async () => {
      try {
        const response = await getFollowStatus(userId);
        setIsFollowing(response.isFollowing);
      } catch (error) {
        console.error('Error fetching follow status:', error);
      }
    };

    checkFollowStatus();
  }, [userId, session]);

  const handleFollow = async () => {
    try {
      await followUser(userId);
      setIsFollowing(true);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(userId);
      setIsFollowing(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  return (
    <button onClick={isFollowing ? handleUnfollow : handleFollow}>
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
