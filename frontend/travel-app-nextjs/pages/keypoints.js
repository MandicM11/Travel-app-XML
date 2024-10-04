import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getKeyPoints, getTours, addKeyPointToTour } from '../services/api'; // Prilagodi putanju ako je potrebno
import { useSession } from 'next-auth/react';
//TODO fix keypoints on front
//fixed keypoints
// add some css
//keypoints improvement TODO
const KeyPointsPage = () => {
  const { data: session, status } = useSession();
  const [keyPoints, setKeyPoints] = useState([]);
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === 'loading') return;

        const keyPointsData = await getKeyPoints();
        setKeyPoints(keyPointsData);

        const toursData = await getTours();
        setTours(toursData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status]);

  const handleViewDetails = (keypointId) => {
    router.push(`/keypoint/${keypointId}`);
  };

  const handleAddToTour = async (keypointId) => {
    if (!selectedTour) {
      alert('Please select a tour');
      return;
    }

    try {
      await addKeyPointToTour(selectedTour, keypointId); // Koristi kraći URL
      alert('Key point added to tour successfully');
    } catch (err) {
      alert(`Error adding key point to tour: ${err.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (keyPoints.length === 0) return <p>No key points found</p>;

  return (
    <div>
      <h1>All Key Points</h1>
      <div>
        <label>Select Tour to Add Key Point:</label>
        <select value={selectedTour} onChange={(e) => setSelectedTour(e.target.value)}>
          <option value="">--Select Tour--</option>
          {tours.map((tour) => (
            <option key={tour._id} value={tour._id}>
              {tour.name}
            </option>
          ))}
        </select>
      </div>
      <ul>
        {keyPoints.map((keyPoint) => (
          <li key={keyPoint._id}>
            <h2>{keyPoint.name}</h2>
            <p>{keyPoint.description}</p>
            <button onClick={() => handleViewDetails(keyPoint._id)}>View Details</button>
            <button onClick={() => handleAddToTour(keyPoint._id)}>Add to Tour</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeyPointsPage;
