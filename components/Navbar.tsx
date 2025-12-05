// components/Navbar.tsx
"use client";

import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/70 border-b border-slate-800 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-8 h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-500 via-purple-500 to-cyan-400 flex items-center justify-center text-sm font-bold">
            DNA
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold tracking-tight">DNA AI</span>
            <span className="text-[10px] text-slate-400">
              Modern Multi-Language Assistant
            </span>
          </div>
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <li className="hover:text-white cursor-pointer">
            <a href="#hero">Home</a>
          </li>
          <li className="hover:text-white cursor-pointer">
            <a href="#features">Features</a>
          </li>
          <li className="hover:text-white cursor-pointer">
            <a href="#chat">Chat</a>
          </li>
        </ul>

        {/* CTA */}
        <button className="hidden md:inline-flex px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-medium hover:opacity-90 transition">
          Get Started
        </button>

        {/* Mobile menu button */}
        <button
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-slate-700 text-slate-200"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95">
          <div className="px-4 py-3 flex flex-col gap-2 text-sm text-slate-200">
            <a href="#hero" onClick={() => setOpen(false)}>
              Home
            </a>
            <a href="#features" onClick={() => setOpen(false)}>
              Features
            </a>
            <a href="#chat" onClick={() => setOpen(false)}>
              Chat
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
