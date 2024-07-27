// pages/comments/[blogId].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CommentForm from '../../components/CommentForm';

const CommentsPage = () => {
  const router = useRouter();
  const { blogId } = router.query;
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canComment, setCanComment] = useState(false);

  useEffect(() => {
    if (blogId) {
      fetchComments();
      checkIfUserCanComment();
    }
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/blog-service/${blogId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfUserCanComment = async () => {
    try {
      // Replace this with actual logic to check if the user follows the author.
      const response = await axios.get(`http://localhost:8000/user-service/following/${blogId}`);
      setCanComment(response.data.canComment); // This should be determined by your logic.
    } catch (error) {
      console.error('Error checking if user can comment:', error);
    }
  };

  const handleCommentAdded = () => {
    fetchComments();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Comments for Blog {blogId}</h1>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>{comment.content}</li>
        ))}
      </ul>
      {canComment && <CommentForm blogId={blogId} onCommentAdded={handleCommentAdded} />}
      {!canComment && <p>You need to follow the author to comment.</p>}
    </div>
  );
};

export default CommentsPage;
