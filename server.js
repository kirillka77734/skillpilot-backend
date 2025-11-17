import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/gpt", async (req, res) => {
    try {
        const yandex = await fetch(
            "https://llm.api.cloud.yandex.net/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Api-Key " + process.env.API_KEY,
                    "OpenAI-Project": process.env.FOLDER_ID
                },
                body: JSON.stringify(req.body)
            }
        );

        const data = await yandex.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

app.listen(10000, () => console.log("Server running"));
