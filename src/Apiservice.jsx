import axios from "axios";

const API_KEY = "AIzaSyCQcNbpgn1m_cI4mxopoxBtoFhRjlkQiYM";
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

export const GetChatbotResponse = async (message, setStreamingText) => {
  try {
    const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
      contents: [{ parts: [{ text: message }] }],
    });

    const fullText = response.data.candidates[0]?.content?.parts[0]?.text || "No response";

    // Stream response text letter by letter
    streamText(fullText, setStreamingText);
  } catch (error) {
    console.error("Error fetching response:", error);
    setStreamingText("Sorry, something went wrong.");
  }
};

// Streaming function
const streamText = async (text, callback, delay = 10) => {
  let streamedText = "";
  for (const char of text) {
    streamedText += char;
    callback(streamedText);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};
