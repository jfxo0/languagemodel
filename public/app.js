import { micromark } from "https://esm.sh/micromark@3?bundle";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@2.4.3/dist/purify.es.js";

const form = document.getElementById("chatForm");
const input = document.getElementById("promptInput");
const messages = document.getElementById("messages");
const button = document.getElementById("sendButton");

function addMessage(text, sender, tokens = null) {
    const chat = document.createElement("div");

    let tokenText = "";

    if (tokens) {
        tokenText = `<div class="text-xs opacity-60 mt-1">Tokens: ${tokens}</div>`;
    }

    if (sender === "user") {
        chat.className = "chat chat-end";
    } else {
        chat.className = "chat chat-start";
    }

    const safeHtml = DOMPurify.sanitize(micromark(String(text)));


    chat.innerHTML = `
        <div class="chat-bubble bg-pink-200 text-black">
            ${safeHtml}
            ${tokenText}
        </div>
    `;

    messages.appendChild(chat);
    messages.scrollTop = messages.scrollHeight;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const prompt = input.value.trim();
    if (!prompt) return;

    addMessage(prompt, "user");

    input.value = "";
    button.disabled = true;

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
            addMessage(data.error || "Server error", "bot");
            return;
        }

        addMessage(data.message, "bot", data.tokens);

    } catch (error) {
        console.error(error);
        addMessage("Server error", "bot");
    }

    button.disabled = false;
});