import React, { useEffect, useRef, useState } from "react";
import { Bot, LoaderCircle, Mic, Send, X } from "lucide-react";
import "../styles/RaymochInformationSupporter.css";

const ENDPOINT = "api/help/information";

function formatInline(text) {
  return String(text).split(/(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if ((part.startsWith("*") && part.endsWith("*")) || (part.startsWith("_") && part.endsWith("_"))) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function FormattedMessage({ content }) {
  return (
    <div className="ray-supporter-rich-text">
      {String(content).split("\n").map((line, index) => {
        const value = line.trim();
        if (!value) return <span className="ray-supporter-rich-space" key={index} aria-hidden="true" />;
        if (value.startsWith("### ")) return <h4 key={index}>{formatInline(value.slice(4))}</h4>;
        if (value.startsWith("## ")) return <h3 key={index}>{formatInline(value.slice(3))}</h3>;
        if (value.startsWith("# ")) return <h2 key={index}>{formatInline(value.slice(2))}</h2>;
        if (/^[-*•]\s+/.test(value)) return <div className="ray-supporter-rich-item" key={index}><span>•</span><p>{formatInline(value.replace(/^[-*•]\s+/, ""))}</p></div>;
        if (/^\d+[.)]\s+/.test(value)) {
          const marker = value.match(/^\d+[.)]/)?.[0];
          return <div className="ray-supporter-rich-item is-numbered" key={index}><span>{marker}</span><p>{formatInline(value.replace(/^\d+[.)]\s+/, ""))}</p></div>;
        }
        if (value.startsWith("> ")) return <blockquote key={index}>{formatInline(value.slice(2))}</blockquote>;
        return <p key={index}>{formatInline(value)}</p>;
      })}
    </div>
  );
}

function csrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";
}

export default function RaymochInformationSupporter() {
  const [open, setOpen] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [launcherPosition, setLauncherPosition] = useState({ x: 32, y: 204 });
  const [closing, setClosing] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Welcome. Ask me about Raymoch accounts, verification, matching, market intelligence, or platform services." },
  ]);
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const messageEndRef = useRef(null);
  const dragRef = useRef(null);
  const launcherMovedRef = useRef(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeAssistant();
    };
    document.addEventListener("keydown", onKeyDown);
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 240);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, thinking]);

  useEffect(() => () => recognitionRef.current?.abort?.(), []);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("raymoch-ai-position"));
      if (Number.isFinite(saved?.x) && Number.isFinite(saved?.y)) {
        setLauncherPosition({
          x: Math.max(8, Math.min(saved.x, window.innerWidth - 72)),
          y: Math.max(8, Math.min(saved.y, window.innerHeight - 72)),
        });
      }
    } catch {
      // Local storage is optional.
    }
  }, []);

  useEffect(() => {
    const keepInView = () => setLauncherPosition((current) => ({
      x: Math.max(8, Math.min(current.x, window.innerWidth - 72)),
      y: Math.max(8, Math.min(current.y, window.innerHeight - 72)),
    }));
    window.addEventListener("resize", keepInView);
    return () => window.removeEventListener("resize", keepInView);
  }, []);

  useEffect(() => {
    let refreshTimer;
    const interval = window.setInterval(() => {
      setRefreshing(true);
      refreshTimer = window.setTimeout(() => setRefreshing(false), 900);
    }, 25000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(refreshTimer);
    };
  }, []);

  const launchAssistant = () => {
    if (launcherMovedRef.current) {
      launcherMovedRef.current = false;
      return;
    }
    if (launching) return;
    setLaunching(true);
    window.setTimeout(() => {
      setOpen(true);
      setLaunching(false);
    }, 420);
  };

  const beginLauncherDrag = (event) => {
    if (open || launching) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - launcherPosition.x,
      offsetY: event.clientY - launcherPosition.y,
      startX: event.clientX,
      startY: event.clientY,
    };
    launcherMovedRef.current = false;
    setDragging(true);
  };

  const moveLauncher = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 5) {
      launcherMovedRef.current = true;
    }
    setLauncherPosition({
      x: Math.max(8, Math.min(event.clientX - drag.offsetX, window.innerWidth - 72)),
      y: Math.max(8, Math.min(event.clientY - drag.offsetY, window.innerHeight - 72)),
    });
  };

  const endLauncherDrag = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    dragRef.current = null;
    setDragging(false);
    setLauncherPosition((current) => {
      try {
        window.localStorage.setItem("raymoch-ai-position", JSON.stringify(current));
      } catch {
        // The position still works for the current visit.
      }
      return current;
    });
  };

  const closeAssistant = () => {
    if (closing) return;
    recognitionRef.current?.stop?.();
    setListening(false);
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 220);
  };

  const submitQuestion = async (spokenQuestion) => {
    const prompt = String(spokenQuestion ?? question).trim();
    if (!prompt || thinking) return;

    const userMessage = { role: "user", content: prompt };
    const priorConversation = messages.slice(-8).map(({ role, content }) => ({ role, content }));
    setMessages((current) => [...current, userMessage]);
    setQuestion("");
    setSpeechError("");
    setThinking(true);

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken(),
        },
        body: JSON.stringify({
          question: prompt,
          current_step: 1,
          conversation: priorConversation,
          form_context: { page: "business", topic: "Raymoch platform information" },
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const fallback = response.status === 429
          ? "Too many questions were sent. Please wait a minute and try again."
          : "Raymoch Information Supporter could not answer right now.";
        throw new Error(payload?.message || fallback);
      }

      setMessages((current) => [...current, {
        role: "assistant",
        content: payload?.answer || "I could not find a supported answer. Please try a more specific question.",
      }]);
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", content: error?.message || "The assistant is temporarily unavailable." }]);
    } finally {
      setThinking(false);
    }
  };

  const startVoiceInput = () => {
    if (listening) {
      recognitionRef.current?.stop?.();
      return;
    }

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setSpeechError("Voice input is not supported by this browser. You can still type your question.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = document.documentElement.lang || "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = () => {
      setListening(true);
      setSpeechError("");
    };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0]?.transcript || "").join(" ").trim();
      setQuestion(transcript);
      const finalResult = Array.from(event.results).some((result) => result.isFinal);
      if (finalResult && transcript) window.setTimeout(() => submitQuestion(transcript), 120);
    };
    recognition.onerror = (event) => {
      if (event.error !== "aborted") setSpeechError("I could not understand the audio. Please try again or type your question.");
    };
    recognition.onend = () => {
      setListening(false);
      inputRef.current?.focus();
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <>
      <div
        className={`ray-supporter-launcher${launching ? " is-launching" : ""}${refreshing ? " is-refreshing" : ""}${dragging ? " is-dragging" : ""}${open ? " is-hidden" : ""}`}
        style={{ left: launcherPosition.x, top: launcherPosition.y }}
      >
        <button
          type="button"
          onClick={launchAssistant}
          onPointerDown={beginLauncherDrag}
          onPointerMove={moveLauncher}
          onPointerUp={endLauncherDrag}
          onPointerCancel={endLauncherDrag}
          aria-label="Open or drag Raymoch Information Supporter"
          data-tooltip="Drag to move · Click to ask Raymoch AI"
        >
          <span className="ray-supporter-pulse" aria-hidden="true" />
          <span className="ray-supporter-pulse ray-supporter-pulse--delayed" aria-hidden="true" />
          <span className="ray-supporter-ai-mark" aria-hidden="true">
            <img src="/images/logo_preview_exact.svg" alt="" />
            <span><Bot size={14} /></span>
          </span>
        </button>
      </div>

      {open && (
        <div className={`ray-supporter-backdrop${closing ? " is-closing" : ""}`} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeAssistant()}>
          <section className="ray-supporter-dialog" role="dialog" aria-modal="true" aria-labelledby="ray-supporter-title">
            <header>
              <span className="ray-supporter-avatar"><Bot size={22} /></span>
              <div><h2 id="ray-supporter-title">Raymoch Information Supporter</h2><p><span /> AI platform guidance</p></div>
              <button type="button" className="ray-supporter-close" onClick={closeAssistant} aria-label="Close Raymoch Information Supporter"><X size={19} /></button>
            </header>

            <div className="ray-supporter-messages" aria-live="polite" aria-busy={thinking}>
              {messages.map((message, index) => (
                <article className={`ray-supporter-message is-${message.role}`} key={`${message.role}-${index}`}>
                  <span>{message.role === "assistant" ? "Raymoch AI" : "You"}</span>
                  <FormattedMessage content={message.content} />
                </article>
              ))}
              {thinking && <article className="ray-supporter-message is-assistant is-thinking"><span>Raymoch AI</span><p><LoaderCircle size={16} /> Thinking<span className="ray-supporter-dots">...</span></p></article>}
              <div ref={messageEndRef} />
            </div>

            <form className="ray-supporter-composer" onSubmit={(event) => { event.preventDefault(); submitQuestion(); }}>
              <label htmlFor="ray-supporter-question">Ask about Raymoch</label>
              <div>
                <textarea
                  ref={inputRef}
                  id="ray-supporter-question"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      submitQuestion();
                    }
                  }}
                  maxLength={2000}
                  rows={2}
                  placeholder="Ask about accounts, verification, matching..."
                />
                <button type="button" className={`ray-supporter-voice${listening ? " is-listening" : ""}`} onClick={startVoiceInput} aria-label={listening ? "Stop voice input" : "Start voice input"}><Mic size={19} /></button>
                <button type="submit" className="ray-supporter-send" disabled={!question.trim() || thinking} aria-label="Send question"><Send size={18} /></button>
              </div>
              <footer><span>{listening ? "Listening… speak now" : speechError || "Enter to send · Shift + Enter for a new line"}</span><span>{question.length}/2000</span></footer>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
