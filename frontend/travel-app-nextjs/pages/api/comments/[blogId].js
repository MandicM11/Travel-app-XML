// pages/api/comments/[blogId].js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { blogId } = req.query;
      const { content } = req.body;
      const response = await axios.post(`http://localhost:8000/blog-service/${blogId}/comments`, { content }, {
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
