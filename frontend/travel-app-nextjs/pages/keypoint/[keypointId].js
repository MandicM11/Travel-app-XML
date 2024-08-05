import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getKeyPointById } from '../../services/api'; // Proveri putanju do fajla
import { useSession } from 'next-auth/react';

const KeyPointDetails = () => {
  const { data: session } = useSession();
  const [keyPoint, setKeyPoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { keypointId } = router.query; // Treba da koristiš keypointId

  console.log('id kljucne tacke je: ',keypointId)
  useEffect(() => {
    if (keypointId) {
      const fetchKeyPoint = async () => {
        try {
          const data = await getKeyPointById(keypointId);
          setKeyPoint(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchKeyPoint();
    }
  }, [keypointId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!keyPoint) return <p>No key point found</p>;

  return (
    <div>
      <h1>{keyPoint.name}</h1>
      <p>{keyPoint.description}</p>
      <p>Latitude: {keyPoint.latitude}</p>
      <p>Longitude: {keyPoint.longitude}</p>
      {keyPoint.image && <img src={keyPoint.image} alt={keyPoint.name} />}
    </div>
  );
};

export default KeyPointDetails;
