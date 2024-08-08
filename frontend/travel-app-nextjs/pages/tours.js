import { useEffect, useState } from 'react';
import { getTours } from '../services/api'; // Prilagodi putanju ako je potrebno
import Link from 'next/link';

const Tours = () => {
    const [tours, setTours] = useState([]);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            const data = await getTours(); // Dodaj funkciju za dobijanje svih tura
            setTours(data);
        } catch (error) {
            console.error('Error fetching tours:', error);
        }
    };

    return (
        <div>
            <h1>All Tours</h1>
            <ul>
                {tours.map((tour) => (
                    <li key={tour.id}>
                        <Link href={`/tours/${tour.id}`}>
                            {tour.name}
                        </Link>
                        <p>{tour.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tours;
