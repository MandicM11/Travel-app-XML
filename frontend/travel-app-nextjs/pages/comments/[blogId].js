import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CommentForm from '../../components/CommentForm';
import { Container, ListGroup, Spinner } from 'react-bootstrap';

const CommentsPage = () => {
  const router = useRouter();
  const { blogId } = router.query;
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments/${blogId}`);
      setComments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container>
      <h1>Comments for Blog {blogId}</h1>
      <ListGroup>
        {comments.map(comment => (
          <ListGroup.Item key={comment._id}>{comment.content}</ListGroup.Item>
        ))}
      </ListGroup>
      <CommentForm blogId={blogId} onCommentAdded={fetchComments} />
    </Container>
  );
};

export default CommentsPage;
