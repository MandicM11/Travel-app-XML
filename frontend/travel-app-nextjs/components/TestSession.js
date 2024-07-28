import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import jwt from 'jsonwebtoken';

const SECRET_KEY = '12345'; // Koristi isti tajni ključ kao na backendu

const TestSession = () => {
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      console.log('TestSession - session:', session); // Dodaj log ovde

      if (session) {
        try {
          const decodedToken = jwt.verify(session.user.token, SECRET_KEY);
          console.log('TestSession - Decoded Token:', decodedToken); // Dodaj log ovde
        } catch (error) {
          console.error('TestSession - Invalid Token:', error); // Dodaj log ovde
        }
      }
    };

    checkSession();
  }, []);

  return null;
};

export default TestSession;
