// pages/tour/[tourId]/index.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getTourById } from '../../../services/api';

const TourDetail = () => {
  const router = useRouter();
  const { tourId } = router.query;
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTourById = async () => {
      if (!tourId) return;

      try {
        const data = await getTourById(tourId);
        setTour(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTourById();
  }, [tourId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!tour) return <p>No tour found</p>;

  return (
    <div>
      <h1>{tour.name}</h1>
      <p>{tour.description}</p>
      <p>Difficulty: {tour.difficulty}</p>
      <p>Length: {tour.length}</p>
      <p>Key Points: {tour.keyPoints.map(point => <span key={point._id}>{point.name}</span>)}</p>
      <p>Price: {tour.price}</p>
    </div>
  );
};

export default TourDetail;
