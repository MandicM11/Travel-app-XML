import { useEffect, useState } from 'react';
import { getPublishedTours } from '../services/api';

const PublishedTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await getPublishedTours();
        console.log('Fetched tours:', data); // Dodaj ovo za ispis podataka
        setTours(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (tours.length === 0) return <p>No tours found</p>;

  return (
    <div>
      <h1>Published Tours</h1>
      <ul>
        {tours.map((tour) => (
          <li key={tour._id}>
            <h2>{tour.name}</h2>
            <p>{tour.description}</p>
            <p>{tour.tags}</p>
            {tour.firstKeyPoint && <p>First Key Point: {tour.firstKeyPoint.name}</p>}
            
            {/* Prikaži dodatne informacije ako je potrebno */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PublishedTours;
