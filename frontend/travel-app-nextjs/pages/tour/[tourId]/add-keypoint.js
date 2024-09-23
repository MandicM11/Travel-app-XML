import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getKeyPoints, addKeyPointToTour } from '../../../services/api';
//handle keypoint creation debug
const AddKeyPoint = () => {
  const router = useRouter();
  const { tourId } = router.query;
  const [keyPoints, setKeyPoints] = useState([]);
  const [selectedKeyPoint, setSelectedKeyPoint] = useState('');

  useEffect(() => {
    const fetchKeyPoints = async () => {
      if (!tourId) return;

      try {
        const data = await getKeyPoints();  // Pretpostavka da postoji funkcija getKeyPoints u API-ju
        setKeyPoints(data);
      } catch (err) {
        console.error('Error fetching key points:', err.message);
      }
    };

    fetchKeyPoints();
  }, [tourId]);

  const handleAddKeyPoint = async () => {
    if (!selectedKeyPoint) {
      alert('Please select a key point');
      return;
    }

    try {
      await addKeyPointToTour(tourId, selectedKeyPoint);
      alert('Key point added successfully');
    } catch (err) {
      alert(`Error adding key point: ${err.message}`);
    }
  };

  return (
    <div>
      <h1>Add Key Point to Tour</h1>
      <select onChange={(e) => setSelectedKeyPoint(e.target.value)}>
        <option value="">--Select Key Point--</option>
        {keyPoints.map((keyPoint) => (
          <option key={keyPoint._id} value={keyPoint._id}>
            {keyPoint.name}
          </option>
        ))}
      </select>
      <button onClick={handleAddKeyPoint}>Add Key Point</button>
    </div>
  );
};

export default AddKeyPoint;
