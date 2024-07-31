import { useSession } from 'next-auth/react';

const TestSession = () => {
  const { data: session, status } = useSession();
  
  return (
    <div>
      <h2>Session Status</h2>
      <p>Status: {status}</p>
      {session ? (
        <pre>{JSON.stringify(session, null, 2)}</pre>
      ) : (
        <p>No session data</p>
      )}
    </div>
  );
};

export default TestSession;
