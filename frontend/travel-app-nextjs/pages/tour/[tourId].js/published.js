import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getTourById, publishTour } from '../../../services/api';

const PublishTour = () => {
    const router = useRouter();
    const { tourId } = router.query;
    const [tour, setTour] = useState(null);

    useEffect(() => {
        if (tourId) {
            fetchTour();
        }
    }, [tourId]);

    const fetchTour = async () => {
        try {
            const data = await getTourById(tourId);
            setTour(data);
        } catch (error) {
            console.error('Error fetching tour:', error);
        }
    };

    const handlePublishTour = async () => {
        try {
            await publishTour(tourId);
            router.push(`/tour/${tourId}`);
        } catch (error) {
            console.error('Error publishing tour:', error);
        }
    };

    if (!tour) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{tour.name}</h1>
            <p>{tour.description}</p>
            <button onClick={handlePublishTour}>Publish Tour</button>
        </div>
    );
};

export default PublishTour;
