import { useState, useRef, useEffect } from "react";
import { GetChatbotResponse } from "../Apiservice";
import { SendHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../assets/deep-GPT.png";
import "../App.css";
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsTyping(true);

    let botReply = { text: "", sender: "bot" };
    setMessages((prev) => [...prev, botReply]);

    await GetChatbotResponse(input, (streamingText) => {
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = { text: streamingText, sender: "bot" };
        return updatedMessages;
      });
    });

    setIsTyping(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
      
      {/* ✅ Logo Placement */}
      <div className="flex justify-center p-4 bg-gray-100 shadow-xl">
        <img src={logo} alt="Deep-GPT Logo" className="w-24 h-24 logos" />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 text-center text-lg font-semibold">
        deep-GPT Chatbot
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 max-w-xs rounded-2xl shadow-md ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-gray-500 text-sm"
          >
            Bot is typing...
          </motion.div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {/* Input Field */}
      <div className="p-3 flex items-center border-t bg-white">
        <input
          type="text"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="ml-3 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition"
        >
          <SendHorizontal size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
