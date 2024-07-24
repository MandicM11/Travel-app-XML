import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

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
        setError(''); // Reset error before trying to login

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: form.email,
                password: form.password,
            });

            if (result.error) {
                // Ako postoji greška, postavite je u stanje
                setError(result.error);
            } else {
                // Ako prijava uspe, preusmerite korisnika
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
