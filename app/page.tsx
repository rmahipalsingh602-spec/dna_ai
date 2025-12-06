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
  const [typing, setTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    const res = await fetch("/api/chat/route", {
      method: "POST",
      body: JSON.stringify({ message: userMessage.text }),
    });

    const data = await res.json();

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: data.reply,
        },
      ]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="flex flex-col items-center p-6">

      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-purple-400 mb-6 drop-shadow-lg">
        DNA AI • Ultra Premium
      </h1>

      {/* Chat Window */}
      <div className="w-full max-w-2xl h-[70vh] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl overflow-y-auto">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 my-3 rounded-2xl max-w-[75%] ${
              msg.sender === "user"
                ? "bg-purple-600 text-white ml-auto shadow-lg"
                : "bg-white/20 text-purple-200 border border-white/10 mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {typing && (
          <div className="mr-auto bg-white/20 text-purple-300 border border-white/10 rounded-2xl px-4 py-2 w-[70px] flex gap-2">
            <span className="animate-bounce">•</span>
            <span className="animate-bounce delay-150">•</span>
            <span className="animate-bounce delay-300">•</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="w-full max-w-2xl flex mt-4 gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here…"
          className="flex-1 px-4 py-4 bg-white/10 border border-white/20 placeholder-purple-300 text-white rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={sendMessage}
          className="px-6 py-4 bg-purple-600 hover:bg-purple-700 rounded-2xl font-semibold shadow-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}
