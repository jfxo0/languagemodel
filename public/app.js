import { micromark } from "https://esm.sh/micromark@3?bundle";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@2.4.3/dist/purify.es.js";

const form = document.getElementById("chatForm");
const input = document.getElementById("promptInput");
const messages = document.getElementById("messages");
const button = document.getElementById("sendButton");

function addMessage(text, sender, tokens = null) {
    const wrapper = document.createElement("div");

    wrapper.className = sender === "user"
        ? "chat chat-end"
        : "chat chat-start";

    const safeHtml = DOMPurify.sanitize(micromark(String(text)));

    wrapper.innerHTML = `
    <div class="chat-bubble bg-pink-200 text-black">
      ${safeHtml}
      ${tokens ? `<div class="text-xs opacity-60 mt-1">Tokens: ${tokens}</div>` : ""}
    </div>
  `;

    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const prompt = input.value.trim();
    if (!prompt) return;

    addMessage(prompt, "user");

    input.value = "";
    button.disabled = true;

    const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (data.error) {
        addMessage(data.error, "bot");
    } else {
        addMessage(data.message, "bot", data.tokens);
    }


    {
        addMessage("Server error", "bot");
    }

    button.disabled = false;
});