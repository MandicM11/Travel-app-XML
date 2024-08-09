import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getTours, updateTourStatus } from '../services/api'; // Prilagodi putanju ako je potrebno

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await getTours(); // Funkcija za dobijanje svih tura
        console.log('Fetched tours:', data);
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

  const handleAddKeyPoint = (tourId) => {
    router.push(`/tour/${tourId}/add-keypoint`);
  };

  const handleUpdateStatus = async (tourId, newStatus) => {
    try {
      await updateTourStatus(tourId, newStatus); // Funkcija za ažuriranje statusa ture
      // Ažurirajte stanje tours da biste odražavali promene
      const updatedTours = tours.map(tour => 
        tour._id === tourId ? { ...tour, status: newStatus } : tour
      );
      setTours(updatedTours);
    } catch (err) {
      setError(err.message);
    }
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
            <button onClick={() => handleAddKeyPoint(tour._id)}>Add Key Point</button>
            {tour.status === 'draft' || tour.status === 'archived' ? (
              <button onClick={() => handleUpdateStatus(tour._id, 'published')}>
                Publish
              </button>
            ) : null}
            {tour.status === 'published' ? (
              <button onClick={() => handleUpdateStatus(tour._id, 'archived')}>
                Archive
              </button>
            ) : null}
            {tour.status === 'archived' ? (
              <button onClick={() => handleUpdateStatus(tour._id, 'published')}>
                Activate
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tours;
