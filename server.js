import express from "express";
import { callOpenAI } from "./chat.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/api/test", (req, res) => {
    res.json({ response: "Hello world" });
});

app.post("/api/chat", async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is verplicht" });
        }

        const result = await callOpenAI(prompt);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});



app.listen(3001, () => {
    console.log("Server on http://localhost:3001");
});