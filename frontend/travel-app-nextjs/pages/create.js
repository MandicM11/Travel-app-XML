import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createBlog } from '../services/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Form, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';

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

    useEffect(() => {
        const token = Cookies.get('session-token');
        console.log('Token from cookies on load:', token);

        if (!session && !token) {
            console.log('No session found, redirecting to /login');
            router.push('/login');
        }
    }, [session, router]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

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
        try {
            const token = Cookies.get('session-token');
            console.log('Token from cookies on submit:', token);

            if (!token) {
                throw new Error('No session token found');
            }

            const response = await createBlog(formData);
            console.log('Blog created:', response);
            router.push('/');
        } catch (error) {
            console.error('Error creating blog:', error);
        }
        
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h1>Create Blog</h1>
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
