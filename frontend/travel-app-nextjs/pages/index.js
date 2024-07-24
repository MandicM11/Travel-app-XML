import { useState, useEffect } from 'react';
import Link from 'next/link';

const Index = () => {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  if (!domLoaded) {
    // Ovo možeš da vratiš kao loading state ili nešto drugo dok DOM nije učitan
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to the App</h1>
      <nav>
        <ul>
          <li>
            <Link href="/register">Register</Link>
          </li>
          <li>
            <Link href="/login">Login</Link>
          </li>
          <li>
            <Link href="/create">Create a new Blog</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Index;
