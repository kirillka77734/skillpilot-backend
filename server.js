// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// логируем входящие запросы и ответы Яндекса (покажется в Application logs)
function safeLog(...a){ try{ console.log(...a) } catch(e){} }

app.post("/gpt", async (req, res) => {
  try {
    safeLog("Incoming /gpt body:", JSON.stringify(req.body));

    const userMessage = req.body.messages?.[0]?.text || req.body.input?.[0]?.text || "";

    const yResp = await fetch("https://llm.api.cloud.yandex.net/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Api-Key " + process.env.API_KEY,
        // X-Folder-Id — обязательно
        "X-Folder-Id": process.env.FOLDER_ID
      },
      body: JSON.stringify({
        model: `gpt://${process.env.FOLDER_ID}/yandexgpt/rc`,
        messages: [{ role: "user", text: userMessage }],
        temperature: 0.3,
        max_output_tokens: 400
      })
    });

    const data = await yResp.json();
    safeLog("Yandex response snippet:", JSON.stringify(data?.choices?.[0]?.message?.text).slice(0,500));
    res.json(data);
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: err.toString() });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on port", PORT));
