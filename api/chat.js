import { callOpenAI } from "../chat.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { prompt } = req.body;

        const response = await callOpenAI(prompt);

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}