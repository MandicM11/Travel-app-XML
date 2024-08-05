import { useState } from 'react';
import { useRouter } from 'next/router';
import { createKeyPoint, userApi } from '../services/api';
import { useSession } from 'next-auth/react';

const CreateKeyPoint = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [image, setImage] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = session?.user?.accessToken;
      if (token) {
        userApi.defaults.headers.Authorization = `Bearer ${token}`;
      }
      await createKeyPoint({ name, description, latitude, longitude, image });
      router.push('/keypoints');
    } catch (error) {
      console.error('Error creating key point:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>Latitude:</label>
        <input type="number" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
      </div>
      <div>
        <label>Longitude:</label>
        <input type="number" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
      </div>
      <div>
        <label>Image URL:</label>
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
      </div>
      <button type="submit">Create Key Point</button>
    </form>
  );
};

export default CreateKeyPoint;
