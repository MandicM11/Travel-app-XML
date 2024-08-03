// components/CommentForm.js
import { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ blogId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await axios.post(`/api/comments/${blogId}`, { content });
      onCommentAdded();
      setContent('');
      setShowForm(false);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <>
      <button onClick={() => setShowForm(true)}>Comment</button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment"
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </>
  );
};

export default CommentForm;
