import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const Login = () => {
  const { data: session, status } = useSession();

  // No need for useState and form state management

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === 'loading') {
      return; // Prevent form submission while loading
    }

    try {
      const result = await signIn('credentials', {
        redirect: false, // Prevent automatic redirection
        email: e.target.email.value,
        password: e.target.password.value,
      });

      if (result.error) {
        console.error('Login error:', result.error);
        // You can display the error message to the user here
      } else {
        console.log('Login successful:', result);
        // Handle successful login (e.g., redirect to create page)
        router.push('/create');
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle errors appropriately
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

        </form>
      )}
      {status === 'authenticated' && <p>Logged in as {session?.user?.email}</p>}
    </div>
  );
};

export default Login;