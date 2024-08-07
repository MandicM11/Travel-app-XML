import { useRouter } from 'next/router';
import { useState } from 'react';
import { addKeyPointToTour } from '../../../services/api';

const AddKeyPoint = () => {
    const router = useRouter();
    const { tourId } = router.query;
    const [keyPointId, setKeyPointId] = useState('');

    const handleAddKeyPoint = async () => {
        try {
            await addKeyPointToTour(tourId, keyPointId);
            setKeyPointId('');
            router.push(`/tour/${tourId}`);
        } catch (error) {
            console.error('Error adding key point to tour:', error);
        }
    };

    return (
        <div>
            <h1>Add Key Point to Tour</h1>
            <input
                type="text"
                value={keyPointId}
                onChange={(e) => setKeyPointId(e.target.value)}
            />
            <button onClick={handleAddKeyPoint}>Add Key Point</button>
        </div>
    );
};

export default AddKeyPoint;
