import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Missing card name' });
  }

  try {
    const response = await fetch(`https://api.mpcfill.com/cards?name=${encodeURIComponent(name as string)}`);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch MPC arts' });
  }
}
