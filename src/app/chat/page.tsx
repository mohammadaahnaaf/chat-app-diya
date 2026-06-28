"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import MarkdownMessage from "@/components/MarkdownMessage";

type Role = "user" | "assistant";

interface Message {
  role: Role;
  content: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) {
          router.push("/login");
          return;
        }
        setUser(data.user);
      });
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/chat")
      .then((r) => r.json())
      .then((data) => {
        if (data.messages) setMessages(data.messages);
      });
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setStreaming(true);

    setMessages([...updatedMessages, { role: "assistant", content: "" }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        history: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!res.ok || !res.body) {
      setStreaming(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let reply = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      reply += decoder.decode(value, { stream: true });
      setMessages([...updatedMessages, { role: "assistant", content: reply }]);
    }

    setStreaming(false);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment">
        <div className="w-8 h-8 border-4 border-golden border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-parchment"
      style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(180,130,40,0.07) 28px, rgba(180,130,40,0.07) 29px)" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-brown-deep border-b-4 border-golden shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-crimson border-2 border-golden flex items-center justify-center text-parchment text-sm font-bold shadow-[2px_2px_0_#b8860b]">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-parchment tracking-wide">{user.name}</p>
            <p className="text-xs text-parchment-dark">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-golden text-xs font-bold tracking-widest uppercase hidden sm:block">
            ✦ Diya Chat ✦
          </span>
          <button
            onClick={handleLogout}
            className="text-xs text-parchment-dark hover:text-crimson border border-brown-light hover:border-crimson px-3 py-1.5 rounded-sm transition-colors uppercase tracking-wider font-semibold"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 max-w-4xl w-full mx-auto overflow-y-auto px-4 py-6 space-y-5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <div className="text-5xl">✦</div>
            <p className="text-xl font-bold text-brown-dark tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
              Start a Conversation
            </p>
            <p className="text-sm text-brown-mid max-w-xs">
              Ask me anything — powered by Alibaba Cloud AI.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-sm bg-golden border-2 border-brown-dark flex items-center justify-center text-brown-deep text-xs font-bold mr-2 shrink-0 mt-0.5 shadow-[1px_1px_0_#1e0d04]">
                AI
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-sm px-4 py-3 text-sm border-2 shadow-[2px_2px_0_#1e0d04] ${
                msg.role === "user"
                  ? "bg-crimson border-brown-dark text-parchment-light whitespace-pre-wrap leading-relaxed"
                  : "bg-parchment-light border-golden text-brown-dark"
              }`}
            >
              {msg.role === "user" ? (
                msg.content
              ) : (
                <MarkdownMessage
                  content={msg.content}
                  streaming={streaming && i === messages.length - 1}
                />
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-sm bg-crimson border-2 border-brown-dark flex items-center justify-center text-parchment-light text-xs font-bold ml-2 shrink-0 mt-0.5 shadow-[1px_1px_0_#1e0d04]">
                {user.name[0].toUpperCase()}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 px-4 py-4 bg-brown-deep border-t-4 border-golden"
      >
        <div className="flex items-end gap-3 max-w-3xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as FormEvent);
              }
            }}
            placeholder="Write your message... (Shift+Enter for newline)"
            rows={1}
            className="flex-1 resize-none rounded-sm border-2 border-brown-light bg-cream px-4 py-3 text-sm text-brown-dark placeholder:text-brown-mid focus:outline-none focus:border-golden max-h-40 overflow-y-auto"
            style={{ height: "auto", fontFamily: "Georgia, serif" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = el.scrollHeight + "px";
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            className="shrink-0 rounded-sm bg-crimson hover:bg-crimson-dark disabled:opacity-40 text-parchment-light px-5 py-3 text-sm font-bold tracking-widest uppercase transition-colors border-2 border-brown-dark shadow-[2px_2px_0_#b8860b]"
          >
            {streaming ? "···" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
