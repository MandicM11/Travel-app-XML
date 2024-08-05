import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getKeyPoints } from '../services/api'; // Prilagodi putanju ako je potrebno
import { useSession } from 'next-auth/react';

const KeyPointsPage = () => {
  const { data: session, status } = useSession();
  const [keyPoints, setKeyPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchKeyPoints = async () => {
      try {
        if (status === 'loading') return;
        const data = await getKeyPoints();
        setKeyPoints(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKeyPoints();
  }, [status]);

  const handleViewDetails = (keypointId) => {
    router.push(`/keypoint/${keypointId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (keyPoints.length === 0) return <p>No key points found</p>;

  return (
    <div>
      <h1>All Key Points</h1>
      <ul>
        {keyPoints.map((keyPoint) => (
          <li key={keyPoint._id}>
            <h2>{keyPoint.name}</h2>
            <p>{keyPoint.description}</p>
            <button onClick={() => handleViewDetails(keyPoint._id)}>View Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeyPointsPage;
