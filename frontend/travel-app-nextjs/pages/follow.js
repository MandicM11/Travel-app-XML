import { useState, useEffect } from 'react';
import axios from 'axios';
import FollowButton from '../components/FollowButton';
import { useSession } from 'next-auth/react';

const FollowPage = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/user-service/users', {
          headers: { Authorization: `Bearer ${session?.user?.token}` }
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading users:', error);
        setLoading(false);
      }
    };

    if (session) {
      fetchUsers();
    }
  }, [session]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Follow Users</h1>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.firstName} {user.lastName}
            <FollowButton userId={user._id} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowPage;
