const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// POST /recipe endpoint
app.post('/recipe', async (req, res) => {
  let { recipeType, servings, prepTime, difficulty } = req.body;

  try {
    // "kek" kelimesini "tatlı" ile değiştir
    recipeType = recipeType.replace(/kek/gi, 'tatlı');

    // 1. Tarif Verisini OpenAI API'den Al
    const recipeResponse = await axios.post(
      process.env.OPENAI_CHAT_URL || 'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Sen bir tarif asistanısın ve sadece Türkçe cevap veriyorsun. Dünya mutfaklarından doğru ve detaylı tarifler sağlıyorsun.",
          },
          {
            role: "user",
            content: `Lütfen "${recipeType}" türünde, ${servings} kişilik, hazırlık süresi "${prepTime}" olan, zorluk seviyesi "${difficulty}" bir tarif öner. Bu tarif, dünya mutfaklarından olabilir. Cevabını sadece aşağıdaki formatta geçerli bir JSON olarak ver ve başka hiçbir şey ekleme:

{
  "title": "Tarifin Adı",
  "description": "Tarifin kısa bir açıklaması",
  "ingredients": ["Malzeme 1", "Malzeme 2", "..."],
  "steps": ["Adım 1", "Adım 2", "..."],
  "nutrition": {
    "calories": "....",
    "protein": "....",
    "fat": "....",
    "carbohydrates": "...."
  }
}
`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let recipeContent = recipeResponse.data.choices[0].message.content;

    // Yanıtın içindeki JSON'u yakala
    const jsonMatch = recipeContent.match(/{[\s\S]*}/);
    if (jsonMatch) {
      recipeContent = jsonMatch[0];
    } else {
      throw new Error('Beklenen formatta JSON bulunamadı.');
    }

    const recipeJson = JSON.parse(recipeContent);

    // 2. Tarif Başlığını İngilizce'ye Çevir
    const translationResponse = await axios.post(
      process.env.OPENAI_CHAT_URL || 'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that translates Turkish to English.",
          },
          {
            role: "user",
            content: `Translate the following recipe title to English, avoiding any disallowed content: "${recipeJson.title}"`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let translatedTitle = translationResponse.data.choices[0].message.content.trim();

    // 3. Tarifin Fotoğrafını OpenAI Image API ile Oluştur
    const imagePrompt = `${translatedTitle}, a delicious dessert, high-quality food photograph, professional lighting, studio shot`;
    try {
      const imageResponse = await axios.post(
        process.env.OPENAI_IMAGE_URL || 'https://api.openai.com/v1/images/generations',
        {
          prompt: imagePrompt,
          n: 1,
          size: "512x512",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const imageUrl = imageResponse.data.data[0].url;

      // Tarif verisine imageUrl'i ekle
      recipeJson.imageUrl = imageUrl;
    } catch (imageError) {
      console.error("Görsel oluşturma sırasında hata oluştu:", imageError.response ? imageError.response.data : imageError.message);
      recipeJson.imageUrl = null; // Veya placeholder bir resim URL'si kullanabilirsiniz
    }

    res.json({ recipe: recipeJson });
  } catch (error) {
    console.error("Tarif alınırken hata oluştu:", error.response ? error.response.data : error.message);
    res.status(500).send("Tarif alınırken bir hata oluştu: " + (error.response ? JSON.stringify(error.response.data) : error.message));
  }
});

// Dinamik PORT kısmı kaldırıldı
app.listen(3000, () => {
  console.log('Sunucu 3000 portunda çalışıyor.');
});
