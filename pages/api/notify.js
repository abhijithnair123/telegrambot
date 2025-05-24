export default async function handler(req, res) {
  const { message = 'Portfolio visited!' } = req.query;

  // Get visitor information
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const referer = req.headers['referer'] || 'Direct';
  const timestamp = new Date().toISOString();
  const language = req.headers['accept-language'] || 'Unknown';
  const platform = req.headers['sec-ch-ua-platform'] || 'Unknown';
  const mobile = req.headers['sec-ch-ua-mobile'] === '?1' ? 'Yes' : 'No';

  // Get geolocation data
  let geoData = {};
  try {
    const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
    geoData = await geoResponse.json();
  } catch (error) {
    geoData = { error: 'Could not fetch geolocation data' };
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const telegramURL = `https://api.telegram.org/bot${botToken}/sendMessage`;

  // Create a detailed message
  const detailedMessage = `
🔔 ${message}

📱 Visitor Information:
📍 IP: ${ip}
🌐 User Agent: ${userAgent}
🔗 Referer: ${referer}
⏰ Time: ${timestamp}
🌍 Language: ${language}
💻 Platform: ${platform}
📱 Mobile: ${mobile}

🗺️ Location Data:
${geoData.country ? `🌍 Country: ${geoData.country}` : ''}
${geoData.regionName ? `🏙️ Region: ${geoData.regionName}` : ''}
${geoData.city ? `🏘️ City: ${geoData.city}` : ''}
${geoData.isp ? `📡 ISP: ${geoData.isp}` : ''}
${geoData.org ? `🏢 Organization: ${geoData.org}` : ''}
${geoData.timezone ? `⏰ Timezone: ${geoData.timezone}` : ''}
`;

  try {
    const response = await fetch(telegramURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: detailedMessage,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    return res.status(200).json({ success: true, telegram: data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
