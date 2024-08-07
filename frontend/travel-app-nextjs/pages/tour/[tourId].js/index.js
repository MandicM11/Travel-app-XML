import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getTourById } from '../../../services/api';

const TourDetails = () => {
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

    if (!tour) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{tour.name}</h1>
            <p>{tour.description}</p>
            <h2>Key Points</h2>
            <ul>
                {tour.keyPoints.map((keyPoint) => (
                    <li key={keyPoint.id}>{keyPoint.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default TourDetails;
