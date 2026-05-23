import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Missing card name' });
  }

  try {
    const searchName = (name as string).replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
    
    const response = await fetch(`https://api.mpcfill.com/cards?name=${encodeURIComponent(searchName)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LeylineCardLab/1.0)',
      }
    });

    if (!response.ok) {
      throw new Error(`MPC API returned ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data || []);

  } catch (error: any) {
    console.error("MPC Backend Error:", error.message);
    return res.status(500).json({ error: "Failed to fetch from MPC" });
  }
}
