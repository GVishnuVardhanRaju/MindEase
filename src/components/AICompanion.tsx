import { useEffect, useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ChatMessage } from "@/types/chat";

const suggestedPrompts = [
  "What is anxiety?",
  "Help me understand my triggers",
  "A grounding technique",
  "How do I read my ARI score?",
  "Plan a gentle week",
];

type AICompanionProps = {
  messages: ChatMessage[];
  text: string;
  typing: boolean;
  onTextChange: (value: string) => void;
  onSend: (value: string) => void;
};

export function AICompanion({ messages, text, typing, onTextChange, onSend }: AICompanionProps) {
  const messagesRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const container = messagesRef.current;
    const messageElements = container?.querySelectorAll<HTMLElement>("[data-chat-message]");
    const latestMessage = messageElements?.[messageElements.length - 1];
    if (!latestMessage || reducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        latestMessage,
        { autoAlpha: 0, y: 10, filter: "blur(4px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.42, ease: "power2.out" },
      );
    }, container ?? undefined);

    return () => context.revert();
  }, [messages.length, reducedMotion]);

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [messages.length, reducedMotion]);

  return (
    <div className="surface flex min-h-145 flex-col rounded-lg">
      <div className="flex items-center gap-3 border-b border-border p-5">
        <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
          <Sparkles size={20} />
        </span>
        <div>
          <h2 className="text-sm font-bold">MindEase AI Companion</h2>
          <p className="text-xs text-muted-foreground">
            Powered by Gemini · educational support, not clinical care
          </p>
        </div>
      </div>
      <div
        ref={messagesRef}
        className="guide-messages max-h-137.5 min-h-77.5 flex-1 space-y-5 overflow-y-auto overscroll-contain p-5"
        aria-live="polite"
        data-typing={typing ? "true" : undefined}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            data-chat-message
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
            >
              {message.role === "assistant" ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{ p: ({ children }) => <p className="m-0">{children}</p> }}
                >
                  {message.text}
                </ReactMarkdown>
              ) : (
                <p className="m-0 whitespace-pre-wrap">{message.text}</p>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <span className="sr-only" role="status">
            MindEase AI is thinking
          </span>
        )}
      </div>
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {suggestedPrompts.map((prompt) => (
            <Button
              key={prompt}
              size="sm"
              variant="outline"
              className="h-auto whitespace-normal text-left"
              onClick={() => onSend(prompt)}
              disabled={typing}
            >
              {prompt}
            </Button>
          ))}
        </div>
      )}
      <form
        className="flex gap-2 border-t border-border p-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSend(text);
        }}
      >
        <Input
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="Ask a wellness question..."
          aria-label="Message to wellness guide"
          maxLength={1200}
          disabled={typing}
        />
        <Button type="submit" size="icon" aria-label="Send message" disabled={typing}>
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
}
