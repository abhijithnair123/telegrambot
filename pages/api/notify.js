export default async function handler(req, res) {
  const { message = 'Portfolio visited!' } = req.query;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const telegramURL = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(telegramURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    const data = await response.json();
    return res.status(200).json({ success: true, telegram: data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
