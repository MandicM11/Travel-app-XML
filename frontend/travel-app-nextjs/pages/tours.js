import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getTours } from '../services/api'; // Prilagodi putanju ako je potrebno

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await getTours(); // Funkcija za dobijanje svih tura
        setTours(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handleViewDetails = (tourId) => {
    router.push(`/tour/${tourId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (tours.length === 0) return <p>No tours found</p>;

  return (
    <div>
      <h1>All Tours</h1>
      <ul>
        {tours.map((tour) => (
          <li key={tour._id}>
            <h2>{tour.name}</h2>
            <p>{tour.description}</p>
            <button onClick={() => handleViewDetails(tour._id)}>View Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tours;
