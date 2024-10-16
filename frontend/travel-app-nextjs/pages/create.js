import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createBlog, userApi } from '../services/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Form, Button } from 'react-bootstrap';

const CreateBlog = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        creationDate: new Date(),
        images: [],
        status: 'draft'
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

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

    const handleDateChange = (date) => {
        setFormData({ ...formData, creationDate: date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = session?.user?.accessToken;
            console.log('Session token:', token);

            if (!token) {
                setError('You must be logged in to create a blog.');
                throw new Error('No session token found');
            }

            userApi.defaults.headers.Authorization = `Bearer ${token}`;

            const response = await createBlog(formData);
            console.log('Blog created:', response);
            router.push('/');
        } catch (error) {
            console.error('Error creating blog:', error);
            setError('Failed to create blog. Please try again.');
        }
    };

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    return (
        <Form onSubmit={handleSubmit}>
            <h1>Create Blog</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    required
                />
            </Form.Group>

            <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    required
                />
            </Form.Group>

            <Form.Group controlId="formCreationDate">
                <Form.Label>Creation Date</Form.Label>
                <DatePicker
                    selected={formData.creationDate}
                    onChange={handleDateChange}
                    className="form-control"
                    dateFormat="yyyy/MM/dd"
                />
            </Form.Group>

            <Form.Group controlId="formImages">
                <Form.Label>Images</Form.Label>
                <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                />
            </Form.Group>

            <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                    as="select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
};

export default CreateBlog;
