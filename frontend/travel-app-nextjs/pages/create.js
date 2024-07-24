import { useState } from 'react';
import { createBlog } from '../services/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const CreateBlog = () => {
    const { data: session, status } = useSession();
    const router = useRouter(); // Dodajte useRouter za redirekciju
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        creationDate: '',
        images: [],
        status: 'draft'
    });

    // Prikažite poruku dok se učitava sesija
    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    // Ako korisnik nije prijavljen, preusmerite na login stranicu
    if (!session) {
        router.push('/login');
        return null;
    }
    console.log('Session:', session);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.replace(/^data:.+;base64,/, '');
                setFormData({ ...formData, images: [base64String] });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createBlog(formData, session.user.token);
            console.log('Blog created:', response);
            // Redirektujte korisnika na stranicu nakon uspešnog kreiranja bloga
            router.push('/'); // Promenite putanju ako želite da preusmerite na drugu stranicu
        } catch (error) {
            console.error('Error creating blog:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Create Blog</h1>
            <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                required
            />
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
            />
            <input
                type="date"
                name="creationDate"
                value={formData.creationDate}
                onChange={handleChange}
                required
            />
            <input
                type="file"
                name="images"
                onChange={handleFileChange}
            />
            <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
            >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="closed">Closed</option>
            </select>
            <button type="submit">Create Blog</button>
        </form>
    );
};

export default CreateBlog;
