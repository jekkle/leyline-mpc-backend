import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Missing card name' });
  }

  const originalName = name as string;
  const cleanName = originalName.replace(/[^a-zA-Z0-9\s]/g, ' ').trim();

  const searchVariations = [
    cleanName,
    originalName,
    cleanName.split(' ').slice(0, 3).join(' '), // First 3 words only
  ];

  for (const searchTerm of searchVariations) {
    if (!searchTerm || searchTerm.length < 3) continue;

    try {
      const response = await fetch(`https://api.mpcfill.com/cards?name=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(8000), // 8 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data) && data.length > 0) {
          return res.status(200).json(data);
        }
      }
    } catch (err) {
      console.error(`Failed with term "${searchTerm}":`, err);
      // Continue to next variation
    }
  }

  // If all variations fail
  return res.status(200).json([]);
}
