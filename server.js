import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/gpt", async (req, res) => {
    try {
        const userMessage = req.body.messages?.[0]?.text || "";

        const yandex = await fetch(
            "https://llm.api.cloud.yandex.net/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Api-Key " + process.env.API_KEY,
                    "X-Folder-Id": process.env.FOLDER_ID
                },
                body: JSON.stringify({
                    model: `gpt://${process.env.FOLDER_ID}/yandexgpt/rc`,
                    messages: [
                        { role: "user", text: userMessage }
                    ],
                    temperature: 0.3,
                    max_output_tokens: 200
                })
            }
        );

        const data = await yandex.json();
        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.toString() });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on port", PORT));
