import React, { useRef, useState, useEffect } from "react";
import { api } from "../api";

export default function AIChat({ role, tag, welcome, quickChips = [], height = "420px" }) {
  const [messages, setMessages] = useState([{ role: "ai", text: welcome }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, typing]);

  async function send(text) {
    const prompt = (text ?? input).trim();
    if (!prompt) return;
    setMessages((m) => [...m, { role: "user", text: prompt }]);
    setInput("");
    setTyping(true);
    try {
      const res = await api.chat(prompt, role);
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [...m, { role: "ai", text: res.response }]);
      }, 500 + Math.random() * 400);
    } catch (e) {
      setTyping(false);
      setMessages((m) => [...m, { role: "ai", text: "Connection to the AI agent failed — is the backend running on :8000?" }]);
    }
  }

  return (
    <div className="flex flex-col" style={{ height }}>
      <div ref={logRef} className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[82%] px-3.5 py-2.5 rounded-xl text-[13.5px] leading-snug ${
              m.role === "user"
                ? "self-end bg-pitchDim text-[#DFFFEF] border border-[#2A5F45] rounded-br-[3px]"
                : "self-start bg-panel2 border border-border rounded-bl-[3px]"
            }`}
          >
            {m.role === "ai" && (
              <div className="text-[10px] text-pitch uppercase tracking-[.1em] mb-1 font-mono">{tag}</div>
            )}
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="self-start flex gap-1 px-3.5 py-3">
            <span className="w-1.5 h-1.5 bg-muted rounded-full typing-dot" />
            <span className="w-1.5 h-1.5 bg-muted rounded-full typing-dot" style={{ animationDelay: ".15s" }} />
            <span className="w-1.5 h-1.5 bg-muted rounded-full typing-dot" style={{ animationDelay: ".3s" }} />
          </div>
        )}
      </div>

      {quickChips.length > 0 && (
        <div className="flex gap-2 my-2.5 flex-wrap">
          {quickChips.map((c) => (
            <span
              key={c}
              onClick={() => send(c)}
              className="text-[11.5px] px-2.5 py-1.5 border border-border rounded-full text-muted cursor-pointer hover:border-pitch hover:text-pitch transition-colors whitespace-nowrap"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-1">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type your question…"
          className="flex-1 bg-panel2 border border-border rounded-lg px-3.5 py-2.5 text-[13.5px] outline-none focus:border-pitch"
        />
        <button
          onClick={() => send()}
          className="bg-pitch text-[#04140D] font-display font-bold text-[14px] rounded-lg px-4 hover:brightness-110"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
