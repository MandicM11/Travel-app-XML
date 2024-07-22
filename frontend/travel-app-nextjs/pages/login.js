import { useState } from 'react';
import { loginUser } from '../services/api';

const Login = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(form);
            alert('Login successful!');
        } catch (error) {
            console.error(error);
            alert('Failed to login.');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
