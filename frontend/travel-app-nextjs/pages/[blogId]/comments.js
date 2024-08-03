import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const CommentsPage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const { blogId } = router.query; // Dobijanje ID-a bloga iz URL-a
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const handleCommentSubmit = async () => {
      if (!session) {
        alert('You need to be logged in to comment.');
        return;
      }
  
      if (!comment) {
        setError('Comment cannot be empty.');
        return;
      }
  
      try {
        const token = session.user.accessToken; // Preuzmite token iz sesije
        console.log('token iz dodavanja komentara: ', token);
        console.log('id bloga je: ', blogId)
        await axios.post(`http://localhost:8000/blog-service/${blogId}/comments`, 
          { content: comment }, // Promenjen ključ iz 'text' u 'content'
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setComment('');
        setError('');
        alert('Comment added successfully!');
        // Možete dodati logiku za preusmeravanje ili osvežavanje stranice ako želite
      } catch (err) {
        console.error('Error adding comment:', err);
        setError('Failed to add comment.');
      }
    };
  return (
    <div>
      <h1>Add Comment</h1>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment here..."
      />
      <button onClick={handleCommentSubmit}>Submit Comment</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CommentsPage;
