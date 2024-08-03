import axios from 'axios';

export default async function handler(req, res) {
  const { method } = req;
  const { blogId } = req.query;

  const apiUrl = `http://localhost:8000/blog-service/${blogId}/comments`; // URL ka vašem blog mikroservisu

  switch (method) {
    case 'GET':
      try {
        const response = await axios.get(apiUrl);
        res.status(200).json(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments' });
      }
      break;
      case 'POST':
        try {
            const { content } = req.body;
            if (!content) {
                return res.status(400).json({ message: 'Content is required' });
            }
            const response = await axios.post(apiUrl, { content }, { withCredentials: true });
            res.status(201).json(response.data);
        } catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).json({ message: 'Error adding comment' });
        }
        break;
    default:
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
}
}
