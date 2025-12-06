"use client";

import { useState, useEffect } from "react";

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
  const [typing, setTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const res = await fetch("/api/chat/route", {
      method: "POST",
      body: JSON.stringify({ message: userMsg.text }),
    });

    const data = await res.json();

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.reply,
      };
      setTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white flex flex-col items-center p-6">

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-purple-400 drop-shadow-2xl mb-6 tracking-wide">
        DNA AI • Ultra Premium
      </h1>

      {/* Chat Box */}
      <div className="w-full max-w-2xl h-[70vh] rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 p-5 overflow-y-auto">

        {/* Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 my-3 rounded-2xl max-w-[75%] transition-all duration-300 ${
              msg.sender === "user"
                ? "ml-auto bg-purple-600 text-white shadow-lg"
                : "mr-auto bg-white/20 text-purple-200 border border-white/10"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {/* Typing Animation */}
        {typing && (
          <div className="mr-auto bg-white/20 border border-white/10 text-purple-300 px-4 py-3 rounded-2xl w-[90px] flex gap-2">
            <span className="animate-bounce">•</span>
            <span className="animate-bounce delay-150">•</span>
            <span className="animate-bounce delay-300">•</span>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="mt-4 w-full max-w-2xl flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message…"
          className="flex-1 p-4 rounded-2xl bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-purple-500 backdrop-blur-xl outline-none placeholder-purple-300 shadow-lg"
        />

        <button
          onClick={sendMessage}
          className="px-6 py-4 bg-purple-600 hover:bg-purple-700 rounded-2xl shadow-xl font-semibold transition-all active:scale-95"
        >
          Send
        </button>
      </div>
    </div>
  );
}
