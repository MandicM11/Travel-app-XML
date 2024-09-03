import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { saveLocation, getCurrentLocation } from '../services/api'; // Proveri putanju do fajla

// Kreirajte ikonu za marker
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
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={markerIcon}>
    </Marker>
  );
};

const Simulator = () => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setPosition({ lat: location.lat, lng: location.long });
      } catch (error) {
        console.error('Error fetching current location:', error);
      }
    };

    fetchLocation();
  }, []);

  const handleSaveLocation = async () => {
    try {
      if (position) {
        await saveLocation({ lat: position.lat, lng: position.lng });
        alert('Location saved successfully!');
      }
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Failed to save location');
    }
  };

  return (
    <div>
      <h1>Position Simulator</h1>
      <MapContainer center={position || [51.505, -0.09]} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      {position && (
        <div>
          <p>Current position:</p>
          <p>Latitude: {position.lat}</p>
          <p>Longitude: {position.lng}</p>
          <button onClick={handleSaveLocation}>Save Location</button>
        </div>
      )}
    </div>
  );
};

export default Simulator;
