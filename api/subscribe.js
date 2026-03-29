module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch(
      'https://api.beehiiv.com/v2/publications/pub_eb96b681-3ebd-4c06-944b-d242dacbbac1/subscriptions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey,
        },
        body: JSON.stringify({
          email: email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: 'stayklar.com',
          utm_medium: 'waitlist',
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Beehiiv error:', response.status, err);
      return res.status(500).json({ error: 'Subscription failed' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Server error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
};
