import { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import { registerUser } from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        profilePicture: '',
        bio: '',
        motto: '',
        email: '',
        password: '',
        role: 'tourist'
    });

    const router = useRouter(); // Initialize useRouter

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(formData);
            // Redirect to login page after successful registration
            router.push('/login');
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
            <input type="text" name="profilePicture" value={formData.profilePicture} onChange={handleChange} placeholder="Profile Picture" />
            <input type="text" name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" />
            <input type="text" name="motto" value={formData.motto} onChange={handleChange} placeholder="Motto" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
