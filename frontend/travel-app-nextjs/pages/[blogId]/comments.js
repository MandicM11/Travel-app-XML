import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const CommentsPage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const { blogId } = router.query; // Dobijanje ID-a bloga iz URL-a
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (blogId) {
            const fetchComments = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/blog-service/${blogId}/comments`, {
                        headers: { Authorization: `Bearer ${session?.user.accessToken}` }
                    });
                    setComments(response.data);
                } catch (err) {
                    console.error('Error fetching comments:', err);
                    setError('Failed to load comments.');
                }
            };
            fetchComments();
        }
    }, [blogId, session?.user.accessToken]);
//fixed
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
            await axios.post(`http://localhost:8000/blog-service/${blogId}/comments`, 
                { content: comment }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComment('');
            setError('');
            alert('Comment added successfully!');
            // Reload comments after adding a new one
            const response = await axios.get(`http://localhost:8000/blog-service/${blogId}/comments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(response.data);
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
            <h2>Comments</h2>
            {comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (
                <ul>
                    {comments.map((comment) => (
                        <li key={comment._id}>
                            <p>{comment.content}</p>
                            <small>By {comment.author.email}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CommentsPage;
