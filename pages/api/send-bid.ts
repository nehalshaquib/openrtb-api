import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const bidRequest = req.body;

    const response = await axios.post(
      'http://endpoint.bc-sys.com/agilitydigitalmedia?token=3AEBEneJTlGjU9KSAikT',
      bidRequest,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': bidRequest.device?.ip || '1.1.1.1',
        },
        validateStatus: () => true, // Important: don't throw for non-200s
      }
    );

    return res.status(response.status).send(response.data || '');
  } catch (error: any) {
    console.error('DSP Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
