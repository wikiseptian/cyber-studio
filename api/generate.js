export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, image } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API Key GEMINI_API_KEY belum dikonfigurasi di Vercel." });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              ...(image ? [{ inlineData: { mimeType: "image/jpeg", data: image } }] : [])
            ]
          }]
        }),
      }
    );

    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server AI." });
  }
}
