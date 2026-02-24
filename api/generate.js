// File ini berjalan di Server Vercel menggunakan API Hugging Face
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  
  // Menggunakan HF_TOKEN dari Environment Variables Vercel
  const hfToken = process.env.HF_TOKEN;

  if (!hfToken) {
    return res.status(500).json({ error: "Token HF_TOKEN tidak ditemukan di Vercel." });
  }

  try {
    // Kita gunakan model Mistral-7B-Instruct yang sangat pintar membuat skrip
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        headers: { Authorization: `Bearer ${hfToken}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          inputs: `<s>[INST] Kamu adalah pakar marketing digital. ${prompt} Berikan skrip iklan pendek yang sangat menarik dalam 4 baris saja. [/INST]`,
          parameters: { max_new_tokens: 250, temperature: 0.7 }
        }),
      }
    );

    const result = await response.json();
    
    // Hugging Face mengembalikan array, kita ambil teks pertama
    const generatedText = result[0]?.generated_text?.split('[/INST]')[1]?.trim() || "Gagal membuat skrip.";

    res.status(200).json({ generated_text: generatedText });

  } catch (error) {
    res.status(500).json({ error: "Gagal menghubungi server Hugging Face." });
  }
}
