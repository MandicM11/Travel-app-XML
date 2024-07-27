import { useState } from 'react';
import { useRouter } from 'next/router';
import { loginUser } from '../services/api';

const Login = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const result = await loginUser(form);
            console.log('Login result:', result); // Dodaj ovu liniju

            if (result.error) {
                setError(result.error);
            } else {
                console.log('Redirecting to /create'); // Dodaj ovu liniju
                router.push('/create');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('Failed to login.');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default Login;
