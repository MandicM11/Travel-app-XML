import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card } from 'react-bootstrap';
import { useSession } from 'next-auth/react';

const Profile = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (session) {
          const response = await axios.get(`http://localhost:8000/user-service/${session.user.id}`);
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You need to be logged in to view this page.</div>;
  }

  return (
    <Container>
      <h1>Profile</h1>
      {user ? (
        <Card>
          <Card.Body>
            <Card.Title>{user.firstName} {user.lastName}</Card.Title>
            <Card.Text>
              <strong>Email:</strong> {user.email}<br />
              <strong>Bio:</strong> {user.bio}<br />
              <strong>Motto:</strong> {user.motto}
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <div>No user data found</div>
      )}
    </Container>
  );
};

export default Profile;
