import { useState } from 'react';
import { useRouter } from 'next/router';
import { createTour } from '../services/api'; // Prilagodi putanju ako je potrebno
import { useSession } from 'next-auth/react';

const CreateTourPage = () => {
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateTour = async () => {
    setLoading(true);
    setError(null);

    try {
      const tagsArray = tags.split(',').map(tag => tag.trim());
      const tourData = {
        name,
        description,
        difficulty,
        tags: tagsArray,
      };

      await createTour(tourData); // Napravi API poziv za kreiranje ture
      router.push('/tours'); // Preusmeri korisnika na stranicu sa listom tura
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create New Tour</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateTour();
        }}
      >
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Difficulty:</label>
          <input type="text" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required />
        </div>
        <div>
          <label>Tags:</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Comma separated" />
        </div>
        {error && <p>Error: {error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Tour'}
        </button>
      </form>
    </div>
  );
};

export default CreateTourPage;
