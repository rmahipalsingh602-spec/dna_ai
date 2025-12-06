"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: number;
  sender: "user" | "ai";
  text: string;
};

// ---- Typing animation for AI text ----
function TypingText({ text }: { text: string }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    setDisplay("");
    let i = 0;
    const speed = 18; // ms per character

    const timer = setInterval(() => {
      setDisplay((prev) => prev + text[i]);
      i += 1;
      if (i >= text.length) clearInterval(timer);
    }, speed);

    return () => clearInterval(timer);
  }, [text]);

  return <span>{display}</span>;
}

// ---- Voice recognition types (browser only) ----
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
      text: "Namaste! Main DNA AI hoon. Kisi bhi language me baat karlo — Hindi, English, Hinglish, ya koi bhi Indian language.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Setup Speech Recognition (mic)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "hi-IN"; // Indian languages + Hinglish
    rec.interimResults = false;
    rec.continuous = false;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);

    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognitionRef.current = rec;
  }, []);

  // Text-to-speech (AI bol kar reply kare)
  const speak = (text: string) => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.02;
    utt.pitch = 1;

    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);

    const voices = window.speechSynthesis.getVoices();
    const indianVoice =
      voices.find((v) => /India|Hindi|en-IN|hi-IN/i.test(v.lang)) ||
      voices.find((v) => /en-|hi-/i.test(v.lang));

    if (indianVoice) utt.voice = indianVoice;

    window.speechSynthesis.speak(utt);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
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

      const replyText: string =
        data?.reply || "Thoda issue aa gaya, phir se try karo 🙂";

      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: replyText,
      };

      setMessages((prev) => [...prev, aiMsg]);
      speak(replyText);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "ai",
          text: "Server se connect nahi ho paya. Thodi der baad try karo.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white flex items-center justify-center px-4 py-6">
      {/* Outer glow card */}
      <div className="relative w-full max-w-5xl">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/10 to-emerald-400/20 blur-3xl rounded-3xl pointer-events-none" />

        <div className="relative bg-slate-900/70 border border-slate-700/60 rounded-3xl shadow-[0_0_45px_rgba(15,23,42,0.9)] backdrop-blur-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-5 pb-3 border-b border-slate-700/70 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-center text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-300 via-sky-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                DNA AI • Ultra Premium
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1 text-center md:text-left">
                Biomorphic multi-language assistant · Hinglish + Voice · Created
                by{" "}
                <span className="text-purple-300 font-semibold">
                  Mahipal Singh Rathore
                </span>
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] bg-slate-800/80 border border-slate-600/80 text-slate-300 flex items-center gap-1">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Mic {listening ? "Listening…" : "Ready"}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] bg-slate-800/80 border border-slate-600/80 text-slate-300">
                {speaking ? "Speaking reply…" : "Tap reply bubble to replay 🔊"}
              </span>
            </div>
          </div>

          {/* Chat area */}
          <div className="px-4 sm:px-6 pb-4 pt-3 flex flex-col gap-3">
            {/* Tips / info strip */}
            <div className="text-[11px] sm:text-xs text-slate-300 bg-slate-900/70 border border-slate-700/70 rounded-2xl px-3 py-2 flex flex-wrap gap-x-3 gap-y-1">
              <span className="font-medium text-cyan-300">
                👉 Example prompts:
              </span>
              <span>“Business ka idea batao”</span>
              <span>“Kya scene hai kal ka bro?”</span>
              <span>“Mujhe Gujarati me samjhao”</span>
            </div>

            {/* Messages window */}
            <div className="relative h-[460px] md:h-[520px] rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-black border border-slate-800 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-cyan-500/15 to-transparent pointer-events-none" />
              <div className="absolute inset-x-6 top-3 flex justify-between text-[11px] text-slate-500">
                <span>Biomorphic Core · DNA-Inspired Replies</span>
                <span>Multi-Language · Voice Ready</span>
              </div>

              <div className="relative h-full pt-8 pb-16 px-4 sm:px-6 overflow-y-auto space-y-4">
                {messages.map((msg) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] md:max-w-[72%] group ${
                          isUser
                            ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                            : "bg-slate-900/90 border border-slate-700/80"
                        } rounded-2xl px-4 py-3 shadow-lg shadow-black/40 text-sm leading-relaxed relative`}
                      >
                        {/* small label */}
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-[11px] uppercase tracking-wide ${
                              isUser
                                ? "text-cyan-50/80"
                                : "text-slate-400/90"
                            }`}
                          >
                            {isUser ? "You" : "DNA AI"}
                          </span>
                          {!isUser && (
                            <button
                              onClick={() => speak(msg.text)}
                              className="text-[11px] text-slate-400 hover:text-cyan-300 transition-opacity opacity-0 group-hover:opacity-100"
                            >
                              🔊 Play
                            </button>
                          )}
                        </div>

                        {/* message text */}
                        <div className="whitespace-pre-wrap break-words">
                          {!isUser ? (
                            <TypingText text={msg.text} />
                          ) : (
                            msg.text
                          )}
                        </div>

                        {/* neon border highlight */}
                        {!isUser && (
                          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-cyan-500/0 group-hover:border-cyan-400/50 transition-all duration-300" />
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Loading typing bubbles */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900/80 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-300 flex items-center gap-2">
                      <span className="text-[11px] uppercase tracking-wide text-slate-500">
                        DNA AI
                      </span>
                      <span className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.2s]" />
                        <span className="h-2 w-2 rounded-full bg-cyan-300 animate-bounce [animation-delay:-0.05s]" />
                        <span className="h-2 w-2 rounded-full bg-cyan-200 animate-bounce" />
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input area */}
            <div className="mt-1 flex flex-col gap-2">
              <div className="flex items-end gap-3">
                <div className="flex-1 bg-slate-900/80 border border-slate-700 rounded-2xl px-3 py-2 shadow-inner shadow-black/40">
                  <textarea
                    rows={2}
                    className="w-full bg-transparent text-sm outline-none resize-none placeholder:text-slate-500"
                    placeholder="Type here in Hindi, English, Hinglish… (Enter = Send, Shift+Enter = New Line)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                <button
                  onClick={toggleMic}
                  className={`h-11 w-11 rounded-2xl flex items-center justify-center text-xl shadow-lg border transition-all ${
                    listening
                      ? "bg-emerald-400 text-black border-emerald-300 shadow-emerald-500/40 scale-105"
                      : "bg-slate-900 border-slate-600 text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
                  }`}
                  title="Tap to speak"
                >
                  🎙️
                </button>

                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="h-11 px-5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 text-sm font-semibold shadow-lg shadow-cyan-500/40 hover:shadow-cyan-400/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Thinking…
                    </>
                  ) : (
                    <>
                      Send
                      <span>➤</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-right">
                DNA AI adapts to your language &amp; tone · Multi-Language ·
                Voice Enabled
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
