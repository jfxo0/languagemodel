import { AzureChatOpenAI } from "@langchain/openai";

const model = new AzureChatOpenAI({
    temperature: 0.4,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
});

const messages = [
    {
        role: "system",
        content:
            "you are a helpful and encouraging Honor of Kings coach, you help with Je helpt players heroes, items, lanes, counters en strategie. you only want to talk about Honor of kings and any other question non related, you will say sorry only honor of kings related quesstion. you only reply back in english so every player around the world can understand you.",
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