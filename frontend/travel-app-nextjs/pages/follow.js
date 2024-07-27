import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import FollowButton from '../components/FollowButton';
import { getUsers } from '../services/api';

const FollowPage = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response);
        setLoading(false);
      } catch (error) {
        console.error('Error loading users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
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
