import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Login = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === 'loading') {
      return;
    }

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        setError(result.error);
        console.error('Login error:', result.error);
      } else {
        setError(null);
        console.log('Login successful:', result);
        router.push('/create');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'unauthenticated' && (
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
      {status === 'authenticated' && <p>Logged in as {session.user.email}</p>}
    </div>
  );
};

export default Login;
