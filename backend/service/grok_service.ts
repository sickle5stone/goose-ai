import dotenv from "dotenv";
dotenv.config();

console.log(process.env.GROK_API_KEY);

const submitMessage = async (message: string): Promise<string> => {
  try {
    console.log(message);

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        model: "grok-beta",
        stream: false,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Grok API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content || "No response generated";
    } else {
      return "No response generated";
    }
  } catch (error) {
    console.error("Error generating content with Grok:", error);
    throw new Error("Failed to generate response from Grok API");
  }
};

export { submitMessage };
