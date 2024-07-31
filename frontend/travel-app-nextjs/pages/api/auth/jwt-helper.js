import jwt from 'next-auth/jwt';

const secret = process.env.NEXT_PUBLIC_JWT_SECRET;

export default async (req, res) => {
  try {
    const token = await jwt.getToken({ req, secret });
    console.log("JSON Web Token", token);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error getting token:', error);
    res.status(500).json({ error: 'Failed to get token' });
  }
};
