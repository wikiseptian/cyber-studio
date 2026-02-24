export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body; // image optional, tidak dipakai di contoh ini
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API Key HUGGINGFACE_API_KEY belum dikonfigurasi di Vercel." });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );

    if (!response.ok) {
      const err = await response.json();
      return res.status(500).json({ error: err.error || "Terjadi kesalahan dari HuggingFace API." });
    }

    const data = await response.json();

    // Beberapa model HuggingFace mengembalikan base64 image di data[0].generated_image
    // Sesuaikan jika format berbeda
    res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan pada server AI." });
  }
}  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server AI." });
  }
}
