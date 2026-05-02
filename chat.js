import { AzureChatOpenAI } from "@langchain/openai";

const model = new AzureChatOpenAI({
    temperature: 0.4,
});

const messages = [
    {
        role: "system",
        content:
            "you are a helpful and encouraging Honor of Kings coach, you help with Je helpt players heroes, items, lanes, counters en strategie. you only want to talk about Honor of kings and any other question non related, you will say sorry only honor of kings related quesstion",
    },
];

export async function callOpenAI(prompt) {
    messages.push({ role: "user", content: prompt });

    const result = await model.invoke(messages);

    messages.push({ role: "assistant", content: result.content });

    return {
        message: String(result.content),
        tokens: result?.usage_metadata?.total_tokens ?? 0,
    };
}