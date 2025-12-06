"use client";

import { useState } from "react";

interface ChatMessage {
  id: number;
  sender: "user" | "ai";
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "ai",
      text: "👋 Namaste! Main DNA AI hoon. Kisi bhi language me baat karlo — Hindi, English, Hinglish, ya koi bhi Indian language.",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const res = await fetch("/api/chat/route", {
      method: "POST",
      body: JSON.stringify({ message: userMsg.text }),
    });

    const data = await res.json();

    const aiMsg: ChatMessage = {
      id: Date.now() + 1,
      sender: "ai",
      text: data.reply,
    };

    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white flex flex-col items-center p-6">
      
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-purple-400 drop-shadow-lg mb-6">
        DNA AI • Modern Assistant
      </h1>

      {/* Chat Box */}
      <div className="w-full max-w-2xl h-[70vh] bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-5 shadow-2xl overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 my-3 rounded-2xl max-w-[75%] text-sm ${
              msg.sender === "user"
                ? "ml-auto bg-purple-600 text-white shadow-lg"
                : "mr-auto bg-white/20 border border-white/10 text-purple-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="mt-4 w-full max-w-2xl flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message…"
          className="flex-1 p-3 rounded-2xl bg-white/10 text-white border border-white/20
                     backdrop-blur-xl outline-none shadow-xl placeholder-purple-300"
        />

        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-2xl shadow-xl transition font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
}
