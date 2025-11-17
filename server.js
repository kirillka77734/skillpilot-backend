import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/gpt", async (req, res) => {
    try {
        const response = await fetch(
            "https://llm.api.cloud.yandex.net/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Api-Key " + process.env.API_KEY,
                    "OpenAI-Project": process.env.FOLDER_ID
                },
                body: JSON.stringify({
                    model: req.body.model,
                    messages: req.body.messages,
                    temperature: req.body.temperature ?? 0.3,
                    max_output_tokens: req.body.max_output_tokens ?? 200
                })
            }
        );

        const data = await response.json();
        res.json(data);

    } catch (err) {
        console.error("Backend error:", err);
        res.status(500).json({ error: "Backend error: " + err.toString() });
    }
});

// Render MUST use process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
