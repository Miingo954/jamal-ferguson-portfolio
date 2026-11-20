"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type LittleJamChatProps = {
  open: boolean;
  onClose: () => void;
  onActivityChange: (activity: "idle" | "thinking" | "speaking") => void;
};

const welcomeMessage: Message = {
  role: "assistant",
  content: "Hey, I’m Little Jam! Ask me about Jamal’s projects, skills, or how he builds things. When we’re done chatting, close this window and you can drag, toss, or double-click me back home!",
};

export default function LittleJamChat({ open, onClose, onActivityChange }: LittleJamChatProps) {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [avatarMood, setAvatarMood] = useState<"idle" | "thinking" | "speaking" | "error">("idle");
  const [avatarBlinking, setAvatarBlinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || avatarMood !== "idle") {
      return;
    }

    const resetTimer = window.setTimeout(() => setAvatarBlinking(false), 0);
    let blinkTimer: number | undefined;
    const blinkInterval = window.setInterval(() => {
      setAvatarBlinking(true);
      blinkTimer = window.setTimeout(() => setAvatarBlinking(false), 180);
    }, 4200);

    return () => {
      window.clearTimeout(resetTimer);
      window.clearInterval(blinkInterval);
      if (blinkTimer) window.clearTimeout(blinkTimer);
    };
  }, [avatarMood, open]);

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending, error]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const content = String(formData.get("message") ?? "").trim();
    if (!content) return;

    const nextMessages = [...messages, { role: "user" as const, content }].slice(-11);
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    setMessages(nextMessages);
    setPending(true);
    setAvatarMood("thinking");
    onActivityChange("thinking");
    setError("");
    form.reset();

    try {
      const response = await fetch("/api/little-jam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const payload = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok || !payload.reply) {
        throw new Error(payload.error || "Little Jam could not answer.");
      }
      setMessages((current) => [
        ...current,
        { role: "assistant", content: payload.reply as string },
      ]);
      onActivityChange("speaking");
      setAvatarMood("speaking");
      reactionTimerRef.current = setTimeout(() => {
        onActivityChange("idle");
        setAvatarMood("idle");
      }, 2600);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong. Please try again.",
      );
      onActivityChange("idle");
      setAvatarMood("error");
      reactionTimerRef.current = setTimeout(() => setAvatarMood("idle"), 1800);
    } finally {
      setPending(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  if (!open) return null;

  return (
    <aside className={`little-jam-chat is-${avatarMood}`} aria-label="Chat with Little Jam">
      <header className="little-jam-chat__header">
        <Image
          className="little-jam-chat__host"
          src={
            avatarMood === "thinking"
              ? "/doodle/assets/lil-mal-v2-idle.png"
              : avatarMood === "speaking"
                ? "/doodle/assets/lil-mal-v2-wink.png"
                : avatarMood === "error"
                  ? "/doodle/assets/lil-mal-v2-blink.png"
                  : avatarBlinking
                    ? "/doodle/assets/lil-mal-v2-blink.png"
                    : "/doodle/assets/lil-mal-v2-open.png"
          }
          alt=""
          width={148}
          height={148}
        />
        <div className="little-jam-chat__identity">
          <strong>Little Jam <span aria-hidden="true">✦</span></strong>
          <span>Jamal’s AI sidekick</span>
        </div>
        <button type="button" aria-label="Close Little Jam chat" onClick={onClose}>
          ×
        </button>
      </header>

      <div ref={messageListRef} className="little-jam-chat__messages" aria-live="polite">
        {messages.map((message, index) => (
          <div className={`little-jam-message-row little-jam-message-row--${message.role}`} key={`${message.role}-${index}`}>
            <p className={`little-jam-message little-jam-message--${message.role}`}>{message.content}</p>
          </div>
        ))}
        {pending ? (
          <p className="little-jam-message little-jam-message--assistant is-pending">
            Thinking…
          </p>
        ) : null}
        {error ? <p className="little-jam-chat__error">{error}</p> : null}
      </div>

      <form className="little-jam-chat__form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="little-jam-message">
          Message Little Jam
        </label>
        <input
          ref={inputRef}
          id="little-jam-message"
          name="message"
          maxLength={1_000}
          autoComplete="off"
          placeholder="Ask about Jamal…"
          disabled={pending}
          required
        />
        <button type="submit" disabled={pending}>
          Send
        </button>
      </form>
      <small>AI can make mistakes. Check important details with Jamal.</small>
    </aside>
  );
}
