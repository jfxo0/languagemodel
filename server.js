import express from "express";
import { callOpenAI } from "./api/chat.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/api/test", (req, res) => {
    res.json({ response: "Hello world" });
});

app.post("/api/chat", async (req, res) => {
    const { prompt } = req.body
    const response = await callOpenAI(prompt)
    res.json(response);
});



app.listen(3001, () => {
    console.log("Server on http://localhost:3001");
});