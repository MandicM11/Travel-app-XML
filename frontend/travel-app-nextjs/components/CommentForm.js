import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ blogId }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/comments/${blogId}`, { content }, {
        withCredentials: true,
      });
      alert('Comment added successfully');
    } catch (err) {
      alert('Error adding comment');
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
