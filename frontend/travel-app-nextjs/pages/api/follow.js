// pages/api/follow.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { followingId } = req.body;
      const response = await axios.post('http://localhost:8000/user-service/follow/follow', { followingId }, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${req.cookies.token}`
        }
      });
      res.status(200).json(response.data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
