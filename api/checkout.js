export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { amountInCents, description } = req.body;

    const response = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.YOCO_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency: 'ZAR',
        description: description,
        successUrl: 'https://rinntelligence.github.io/grubguys-raffle/grubguys-raffle.html?status=success',
        cancelUrl: 'https://rinntelligence.github.io/grubguys-raffle/grubguys-raffle.html?status=cancel',
        failureUrl: 'https://rinntelligence.github.io/grubguys-raffle/grubguys-raffle.html?status=cancel'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.message || 'Yoco error' });
    }

    return res.status(200).json({
      checkoutId: data.id,
      redirectUrl: data.redirectUrl
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
