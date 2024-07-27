import { useEffect, useState } from 'react';
import { getBlogs, setAuthToken } from '../services/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const BlogsPage = () => {
    const { data: session, status } = useSession();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                if (status === 'loading') return;
                const token = session?.user?.token;
                if (token) {
                    setAuthToken(token); // Postavi token pre poziva
                }
                const data = await getBlogs();
                setBlogs(data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [session, status]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleComment = async (blog) => {
        const token = session?.user?.token;
        if (token) {
            setAuthToken(token); // Postavi token pre poziva
        }

        try {
            const response = await axios.get(`http://localhost:8000/user-service/following/${blog.author}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.isFollowing) {
                router.push(`/blogs/${blog._id}/comments`);
            } else {
                alert('You must follow the author to comment.');
            }
        } catch (error) {
            console.error('Error checking follow status:', error);
        }
    };

    return (
        <div>
            <h1>All Blogs</h1>
            <ul>
                {blogs.map((blog) => (
                    <li key={blog._id}>
                        <a href={`/blogs/${blog._id}`}>{blog.title}</a>
                        <button onClick={() => handleComment(blog)}>Comment</button>
                    </li>
                ))}
            </ul>
        </div>  
    );
};

export default BlogsPage;
