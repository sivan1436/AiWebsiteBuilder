

const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions"

const model = "nvidia/nemotron-3-ultra-550b-a55b:free"

async function generateResponse(prompt) {
    const response = await fetch(openRouterUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            // 'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
            // 'X-OpenRouter-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: "system", content: "You must return ONLY valid raw JSON." },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
        }),
    });
    if (!response.ok) {
        const err = await res.text()
        throw new Error("openRouter error"+err)
    }
 const data = await res.json()  
 return data
}

