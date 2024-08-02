import { useEffect, useState } from 'react';
import { getBlogs } from '../services/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { userApi, getFollowStatus } from '../services/api'; // Dodaj import userApi i getFollowStatus


const BlogsPage = () => {
    const { data: session, status } = useSession();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                if (status === 'loading') return;
                const data = await getBlogs(); // Koristi `getBlogs` iz `blogApi`
                setBlogs(data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [status]);

    const handleComment = async (blog) => {
        if (!session) {
            alert('You need to be logged in to comment.');
            return;
        }

        try {
            const token = session?.accessToken;
            if (token) {
                userApi.defaults.headers.Authorization = `Bearer ${token}`; // Postavi token za `userApi` zahteve
            }

            // Proveri da li pratiš autora bloga
            const response = await userApi.get(`/follow-status/${blog.author}`);
            if (response.data.isFollowing) {
                router.push(`/blogs/${blog._id}/comments`);
            } else {
                alert('You must follow the author to comment.');
            }
        } catch (error) {
            console.error('Error checking follow status:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

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
