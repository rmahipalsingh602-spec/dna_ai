"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: number;
  sender: "user" | "ai";
  text: string;
};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "ai",
      text: "Namaste 👋 Main DNA AI hoon. Aap kisi bhi language me baat kar sakte ho.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Voice Input Setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "hi-IN";
    rec.interimResults = false;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);

    rec.onresult = (e: any) => {
      setInput((prev) => prev + " " + e.results[0][0].transcript);
    };

    recognitionRef.current = rec;
  }, []);

  // AI Message Sender
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.reply,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 2, sender: "ai", text: "Error aa gaya." },
      ]);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white px-4 py-4">

      {/* TITLE */}
      <h1 className="text-center text-4xl font-extrabold bg-gradient-to-r from-cyan-300 to-purple-400 text-transparent bg-clip-text drop-shadow-lg">
        DNA AI – Multi-Language Assistant
      </h1>
      <p className="text-center text-slate-400 text-sm">
        Created by <span className="text-purple-400">Mahipal Singh Rathore</span>
      </p>

      {/* CHAT CONTAINER */}
      <div className="max-w-3xl mx-auto mt-6 glass rounded-3xl p-6 shadow-xl min-h-[70vh] flex flex-col">

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl max-w-[75%] text-sm animate-fade-in
                ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/40 shadow-lg"
                    : "bg-white/10 backdrop-blur-xl border border-white/10"
                }`}
              >
                <p className="opacity-60 text-xs mb-1">
                  {msg.sender === "user" ? "You" : "DNA AI"}
                </p>
                {msg.text}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BOX */}
        <div className="flex gap-3 mt-4">
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type here… ya bolo 🎙️"
            className="flex-1 rounded-xl px-4 py-3 bg-black/40 border border-slate-600 focus:ring-2 focus:ring-cyan-400 outline-none resize-none"
          />

          {/* MIC BUTTON */}
          <button
            onClick={() =>
              listening
                ? recognitionRef.current.stop()
                : recognitionRef.current.start()
            }
            className={`w-12 rounded-xl text-xl transition ${
              listening ? "bg-emerald-500 pulse" : "bg-slate-800"
            }`}
          >
            🎙️
          </button>

          {/* SEND BUTTON */}
          <button
            disabled={loading}
            onClick={sendMessage}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 shadow-lg disabled:opacity-30"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
