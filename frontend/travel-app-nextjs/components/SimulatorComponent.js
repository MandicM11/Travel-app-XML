import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet za custom Icon
import { saveLocation, getCurrentLocation } from '../services/api';
import { userApi } from '../services/api';

const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position ? (
    <Marker position={position} icon={markerIcon}>
      <Popup>
        You are here.
      </Popup>
    </Marker>
  ) : null;
};

const SimulatorComponent = () => {
  const { data: session, status } = useSession();
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        if (status === 'authenticated' && session?.user?.accessToken) {
          // Postavite token u zaglavlje za `userApi`
          userApi.defaults.headers.Authorization = `Bearer ${session.user.accessToken}`;
          
          const data = await getCurrentLocation();
          setPosition(data);
        }
      } catch (error) {
        console.error('Error fetching current location:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentLocation();
  }, [status, session]);

  const handleSaveLocation = async () => {
    try {
      if (status === 'authenticated' && session?.user?.accessToken) {
        console.log('Token1234:', session.user.accessToken);
  
        const lat = parseFloat(position.lat);
        const lng = parseFloat(position.lng);
  
        if (isNaN(lat) || isNaN(lng)) {
          throw new Error('Invalid position data');
        }
        console.log(lat, lng);
        await saveLocation({ lat, lng });
      }
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Simulator</h1>
      <button onClick={handleSaveLocation}>Save Location</button>
      <MapContainer center={position || [51.505, -0.09]} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
    </div>
  );
};

export default SimulatorComponent;
