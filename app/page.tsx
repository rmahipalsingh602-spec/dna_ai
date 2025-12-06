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
      text: "Namaste 👋 Main DNA AI hoon. Aap kisi bhi language me baat kar sakte ho – Hindi, English, Hinglish, ya koi bhi Indian language.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll to last message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Voice input setup
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "hi-IN";
    rec.interimResults = false;
    rec.continuous = false;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);

    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + text : text));
    };

    recognitionRef.current = rec;
  }, []);

  // Text-to-speech for AI replies
  const speak = (text: string) => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1;
    u.volume = 1;

    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);

    const voices = window.speechSynthesis.getVoices();
    const indianVoice =
      voices.find((v) => /India|Hindi|hi-IN|en-IN/i.test(v.lang)) ||
      voices.find((v) => /en-|hi-/i.test(v.lang));

    if (indianVoice) u.voice = indianVoice;

    window.speechSynthesis.speak(u);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.reply || "Kuch galat ho gaya, phir se try karo 🙂",
      };

      setMessages((prev) => [...prev, aiMsg]);
      // Auto speak AI reply
      speak(aiMsg.text);
    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: Date.now() + 2,
        sender: "ai",
        text: "Server error aa gaya. Thodi der baad phir try karo.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Mic not supported in this browser. Try Chrome / Edge.");
      return;
    }
    if (listening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  const stopSpeaking = () => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <main className="min-h-screen bg-[#020617] text-slate-50 relative overflow-hidden">
      {/* Background DNA blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-40 -left-32 h-80 w-80 rounded-[60%] bg-gradient-to-br from-cyan-500/40 via-sky-400/30 to-blue-700/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-[60%] bg-gradient-to-tr from-violet-500/40 via-fuchsia-500/40 to-blue-500/40 blur-3xl" />
        <div className="absolute inset-x-0 top-1/3 mx-auto h-72 w-72 rounded-full border border-cyan-400/20 bg-cyan-400/5 blur-3xl" />
      </div>

      {/* Content wrapper */}
      <div className="relative max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-10">
        {/* Top bar / title */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-cyan-300/80">
              DNA • MODERN AI PLATFORM
            </p>
            <h1 className="mt-2 text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-400 text-transparent bg-clip-text">
                DNA AI
              </span>{" "}
              <span className="text-slate-200">Biomorphic Assistant</span>
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-300 max-w-xl">
              Organic DNA inspired interface. Baith ke aaraam se AI se baat
              karo – multi-language, Hinglish, voice input, sab ek hi jagah.
            </p>
          </div>
          <div className="self-start md:self-auto text-xs text-slate-400 bg-slate-900/60 border border-slate-700/70 rounded-2xl px-4 py-2 backdrop-blur-lg">
            <p className="font-medium text-slate-200">
              Created by{" "}
              <span className="text-cyan-300">Mahipal Singh Rathore</span>
            </p>
            <p className="text-[11px]">
              Live at{" "}
              <span className="text-slate-200">
                dna-ai-mu.vercel.app
              </span>
            </p>
          </div>
        </header>

        {/* Hero DNA + Chat layout */}
        <section className="grid md:grid-cols-[1.1fr,0.9fr] gap-8 items-stretch">
          {/* Left: Hero + Features + DNA visual */}
          <div className="space-y-5">
            {/* DNA card */}
            <div className="glass rounded-3xl border border-cyan-400/20 bg-slate-950/70 p-5 relative overflow-hidden">
              {/* Floating DNA helix lines */}
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-cyan-400/40 opacity-30" />
              <div className="absolute -right-16 top-6 h-44 w-44 rounded-full border border-violet-400/30 opacity-30" />
              <div className="absolute -right-6 bottom-0 h-28 w-28 rounded-full bg-gradient-to-tr from-cyan-500/40 via-sky-400/40 to-violet-500/40 blur-2xl opacity-70" />

              <div className="flex items-start justify-between gap-4 relative z-10">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-1">
                    Biomorphic DNA Core 🧬
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300">
                    Har message AI ke DNA jaisa evolve hota hai – tumhari
                    language, style aur tone ke hisaab se adapt hota hai.
                  </p>
                </div>
                <div className="hidden md:flex flex-col items-center text-[11px] text-slate-300">
                  <span className="h-12 w-[2px] bg-gradient-to-b from-cyan-300 via-slate-200/80 to-violet-300 rounded-full" />
                  <span className="mt-1">Live</span>
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-slate-300">
                <div className="rounded-2xl bg-slate-900/70 border border-slate-700/80 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-cyan-300/90">
                    Languages
                  </p>
                  <p>Hindi, Hinglish, Gujarati, Tamil, Bangla & more</p>
                </div>
                <div className="rounded-2xl bg-slate-900/70 border border-slate-700/80 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-violet-300/90">
                    Modes
                  </p>
                  <p>Text + Voice input, AI voice replies</p>
                </div>
              </div>
            </div>

            {/* Small feature chips */}
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40">
                🧬 DNA-inspired UI
              </span>
              <span className="px-3 py-1 rounded-full bg-violet-500/15 border border-violet-400/40">
                🌐 Multi-language India + World
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40">
                🎙 Voice Ready
              </span>
            </div>

            {/* Tips */}
            <div className="rounded-3xl bg-slate-900/70 border border-slate-700/80 p-4 text-xs text-slate-300 space-y-2">
              <p className="font-medium text-slate-100">
                How to talk to DNA AI:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Simple Hindi me likho: “business ka idea batao”</li>
                <li>Hinglish: “kya scene hai kal ka bro?”</li>
                <li>Regional language: “મારે study plan બનાવો” (Gujarati)</li>
                <li>Mic se bolo, DNA AI reply text + voice se karega.</li>
              </ul>
            </div>
          </div>

          {/* Right: Chat panel */}
          <div className="rounded-[28px] border border-slate-700/80 bg-slate-950/80 backdrop-blur-2xl shadow-[0_0_40px_rgba(34,197,235,0.35)] flex flex-col overflow-hidden">
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-slate-950/90">
              <div>
                <p className="text-xs text-slate-400">Chat with</p>
                <p className="text-sm font-semibold text-slate-100">
                  DNA AI • Multi-Language
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span
                  className={`flex items-center gap-1 px-2 py-1 rounded-full border ${
                    listening
                      ? "border-emerald-400/70 text-emerald-300 bg-emerald-500/10"
                      : "border-slate-600 text-slate-300 bg-slate-900"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      listening ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                    }`}
                  />
                  {listening ? "Listening…" : "Mic ready"}
                </span>
                {speaking && (
                  <button
                    onClick={stopSpeaking}
                    className="px-2 py-1 rounded-full border border-slate-600 text-[10px] text-slate-200 hover:border-rose-400 hover:text-rose-300"
                  >
                    Stop voice 🔇
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gradient-to-b from-slate-950 via-slate-900/80 to-slate-950">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[78%] px-3 py-2 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-br-sm shadow-indigo-500/40"
                        : "bg-slate-800/90 text-slate-100 border border-slate-700/90 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-[10px] opacity-70 mb-1">
                      {msg.sender === "user" ? "You" : "DNA AI"}
                    </p>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
              {loading && (
                <p className="text-[11px] text-slate-400">DNA AI soch raha hai…</p>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-slate-800/80 bg-slate-950/95 px-3 py-3 space-y-2">
              <div className="flex gap-2 items-end">
                <textarea
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type here… ya bolo 🎙️ (Hindi, Hinglish, any language)"
                  className="flex-1 resize-none rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs md:text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/80"
                />
                <button
                  onClick={toggleListening}
                  className={`h-10 w-10 flex items-center justify-center rounded-full border text-lg transition ${
                    listening
                      ? "bg-emerald-500 text-slate-950 border-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.8)]"
                      : "bg-slate-900 border-slate-600 text-slate-100 hover:border-emerald-400 hover:text-emerald-300"
                  }`}
                  title="Mic"
                >
                  🎙️
                </button>
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="h-10 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 text-xs md:text-sm font-semibold shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending…" : "Send"}
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                Tip: Hinglish me likho –{" "}
                <span className="text-slate-200">
                  “kya plan hai kal ka bro?”
                </span>{" "}
                – DNA AI bhi waise hi reply karega.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
