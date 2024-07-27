import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const FollowButton = ({ userId }) => {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user-service/follow-status/${userId}`, {
          headers: { Authorization: `Bearer ${session?.user?.token}` }
        });
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error('Error fetching follow status:', error);
      }
    };

    if (session) {
      checkFollowStatus();
    }
  }, [userId, session]);

  const handleFollow = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/user-service/follow`, { followingId: userId }, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      if (response.status === 201) {
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/user-service/unfollow/${userId}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      if (response.status === 200) {
        setIsFollowing(false);
      }
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
