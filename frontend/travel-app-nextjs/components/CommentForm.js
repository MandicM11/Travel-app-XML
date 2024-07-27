// components/CommentForm.js
import { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ blogId, onCommentAdded }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await axios.post(`http://localhost:8000/blog-service/${blogId}/comments`, { content });
      onCommentAdded();
      setContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment"
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;
