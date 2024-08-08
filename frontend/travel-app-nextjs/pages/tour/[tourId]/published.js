// pages/tour/[tourId]/published.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getPublishedTours } from '../../../services/api';

const PublishedTours = () => {
  const router = useRouter();
  const { tourId } = router.query;
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublishedTours = async () => {
      if (!tourId) return;

      try {
        const data = await getPublishedTours(tourId);
        setTours(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedTours();
  }, [tourId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (tours.length === 0) return <p>No published tours found</p>;

  return (
    <div>
      <h1>Published Tours</h1>
      <ul>
        {tours.map((tour) => (
          <li key={tour._id}>{tour.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PublishedTours;
